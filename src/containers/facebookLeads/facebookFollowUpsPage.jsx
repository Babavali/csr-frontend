/*eslint-disable no-unused-vars*/
import {
	Box,
	Chip,
	useMediaQuery,
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Tabs,
	Tab,
	Divider,
	IconButton,
	Button,
} from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../shared/axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import FollowUpModalPopup from '../leads/myLeads/components/followUpModalPopup'
import CircularLoader from '../../components/common/loader/circularLoader'
import FacebookFollowUpsFilterComponent from './components/facebookFollowUpsFilterComponent'
import noData from '../../assets/no-data.svg'
import SalesEmpComponent from '../leads/myLeads/components/salesEmpComponent'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import {
	setFacebookFollowUpsDateFrom,
	setFacebookFollowUpsDateTo,
	setFacebookFollowUpsMainStatus,
	setFacebookFollowUpsSubStatus,
	setFacebookFollowUpsEnquirerName,
	setFacebookFollowUpsEnquirerPhone,
	setFacebookFollowUpsPatientCountry,
	setFacebookFollowUpsCategory,
	setFacebookFollowUpsTier,
	setFacebookFollowUpsLeadId,
	setFacebookFollowUpsTreatmentIntensity,
	resetFacebookFollowUpsFilter,
} from '../../slices/facebookFollowUpsFilterSlice'
import { useDispatch } from 'react-redux'
import { tierChipColor } from '../../mixins/chipColor'

export default function FollowUps() {
	const matches = useMediaQuery('(min-width: 600px)')
	const [isLoading, setIsLoading] = useState(true)
	const [followUpsData, setFollowUpsData] = useState()
	const [selectedLeadId, setSelectedLeadId] = useState()
	const [openFollowUpModal, setOpenFollowUpModal] = useState(false)
	const [isFilterVisible, setIsFilterVisible] = useState(false)
	const [statusData, setStatusData] = useState()
	const [status, setStatus] = useState([])

	const initialSearchParams = new URLSearchParams(location.search)
	const [queryParams, setQueryParams] = useSearchParams()
	let followUpType = initialSearchParams.get('type') || 'today'

	const [followUpData, setFollowUpData] = useState()
	// const [followUpsTabIndex, setFollowUpsTabIndex] = useState(0)
	const [followUpCount, setFollowUpCount] = useState(null)
	const [selectedSalesEmpId, setSelectedSalesEmpId] = useState()
	const navigate = useNavigate()
	const user = useSelector((state) => state.user)
	// Redux
	const [noOfFilters, setNoOfFilters] = useState(0)
	const dispatch = useDispatch()
	const filterChips = useSelector((state) => state.facebookFollowUpsFilterReducer.facebookFollowUpsFilter)
	const [countryList, setCountryList] = useState([])
	const [categoryList, setCategoryList] = useState([])

	let initialTabNumber = 0
	if (followUpType === 'today') {
		initialTabNumber = 0
	}
	if (followUpType === 'upcoming') {
		initialTabNumber = 1
	}
	if (followUpType === 'missed') {
		initialTabNumber = 2
	}
	const [followUpsTabIndex, setFollowUpsTabIndex] = useState(initialTabNumber)

	const getFollowUpChipColor = (status, dueDateString) => {
		const dueDate = new Date(dueDateString)
		switch (status) {
			case 'PENDING': {
				const currentDateAndTime = new Date(new Date().getTime())
				return currentDateAndTime < dueDate ? '#fdd835' : '#e57373'
			}
			case 'DONE':
				return '#6ECB63'
			default:
				return '#64b5f6'
		}
	}

	const getFollowUpsTabBackgroundColor = () => {
		if (followUpsTabIndex == 0) {
			return '#DEF3FF'
		} else if (followUpsTabIndex === 1) {
			return '#FFF1B3'
		} else if (followUpsTabIndex == 2) {
			return '#FFB8B8'
		}
	}

	const queryKeyMapping = {
		followUpDateFrom: 'followup_date_from',
		followUpDateTo: 'followup_date_to',
		leadId: 'lead_id',
		mainStatus: 'status',
		subStatus: 'sub_status',
		enquirerName: 'enquirer_name',
		enquirerPhone: 'enquirer_phone',
		patientCountry: 'patient_country_id',
		category: 'category_id',
		tier: 'lead_tier',
		treatmentIntensity: 'treatment_intensity',
	}
	const getCategoryList = () => {
		axios
			.get(`search/category?name`)
			.then((res) => {
				setCategoryList(res.data.data)
			})
			.catch((err) => {
				toast.error(err.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	const getCategoryName = (categoryId) => {
		return _.filter(categoryList, ['id', categoryId])[0].name
	}
	const getCountryList = () => {
		axios.get(`search/country?name`).then((res) => {
			setCountryList(res.data.data)
		})
	}
	const getCountryName = (countryId) => {
		return _.filter(countryList, ['id', countryId])[0].name
	}
	useEffect(() => {
		getCategoryList()
		getCountryList()
	}, [])
	const fetchFollowUpsCount = () => {
		setNoOfFilters(0)
		setIsLoading(true)
		setFollowUpsData([])
		axios
			.get(
				`/sales/employee/followup-reminders/count?lead_source=FACEBOOK,PARTNER,OPD_CAMP,PARTNER_INT_FB,PARTNER_MANUAL,PARTNER_SEO,PARTNER_SEO_MANUAL,PARTNER_PPC,PARTNER_PPC_MANUAL,PARTNER_GMB,PARTNER_CALL,PARTNER_DOM_FB${
					selectedSalesEmpId ? '&emp_id=' + selectedSalesEmpId : ''
				}` + (queryParams ? `&${queryParams}` : '')
			)
			.then((res) => {
				setFollowUpCount(res.data.data)
			})
			.catch((err) => {
				toast.error(err.response?.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	const fetchFollowUpsData = () => {
		// setQueryParams
		let type
		let filterNumber = 0
		const trialFilterParams = {}
		for (const filterChipKey of Object.keys(filterChips)) {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj && filterChipObj.value) {
				trialFilterParams[filterChipObj.queryParameter] = filterChipObj.value
				filterNumber++
			}
		}
		setNoOfFilters(filterNumber)
		if (filterNumber !== 0) {
			type = 'all'
			queryParams.set('type', 'all')
		} else if (followUpsTabIndex == 0) {
			queryParams.set('type', 'today')
		} else if (followUpsTabIndex === 1) {
			queryParams.set('type', 'upcoming')
		} else if (followUpsTabIndex == 2) {
			queryParams.set('type', 'missed')
		}

		if (!_.isEmpty(trialFilterParams)) {
			for (const key in trialFilterParams) {
				if (!trialFilterParams[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(trialFilterParams, key)) {
					queryParams.set(key, trialFilterParams[key])
				}
			}
			setQueryParams(queryParams)
		}

		const url = `sales/employee/followup-reminders?${
			selectedSalesEmpId ? '&emp_id=' + selectedSalesEmpId : ''
		}&lead_source=FACEBOOK,PARTNER,OPD_CAMP,PARTNER_INT_FB,PARTNER_MANUAL,PARTNER_SEO,PARTNER_SEO_MANUAL,PARTNER_PPC,PARTNER_PPC_MANUAL,PARTNER_GMB,PARTNER_CALL,PARTNER_DOM_FB`
		axios
			.get(url + (queryParams ? `&${queryParams}` : ''))
			.then((res) => {
				setFollowUpsData(res.data.data)
				setIsLoading(false)
			})
			.catch((error) => {
				toast.error(error.response?.data.data.message, {
					position: 'bottom-left',
				})
				setIsLoading(false)
			})
	}
	const handleFollowUpsTabChange = (_event, newTabIndex) => {
		setFollowUpsTabIndex(newTabIndex)
		if (newTabIndex === 0) {
			navigate(`/offline/follow-ups?type=today`)
		} else if (newTabIndex === 1) {
			navigate(`/offline/follow-ups?type=upcoming`)
		} else if (newTabIndex === 2) {
			navigate(`/offline/follow-ups?type=missed`)
		}
	}

	const handleSalesEmpChange = (salesEmpId) => {
		setSelectedSalesEmpId(salesEmpId)
	}

	const handleOpenFollowUpModal = (leadId, followUpData, statusData) => {
		setSelectedLeadId(leadId)
		setFollowUpData(followUpData)
		setStatusData(statusData)
		axios
			.get(`sales/leads/${leadId}/statuses`)
			.then((res) => {
				setStatus(res?.data?.data.statuses)
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
		setOpenFollowUpModal(true)
	}

	const handleCloseFollowUpModal = () => setOpenFollowUpModal(false)

	const handleFilterOpen = () => {
		setIsFilterVisible(true)
	}
	const handleFilterClose = () => {
		setIsFilterVisible(false)
	}

	const handleFilterSubmit = (filteringObj) => {
		const filterParams = {}
		// followUpsFilterChips
		for (const filterChipKey of Object.keys(filterChips)) {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj.value) {
				filterParams[filterChipObj.queryParameter] = filterChipObj.value
			}
		}
		const queryParamsObj = getQueryObject(filteringObj)

		if (!_.isEmpty(queryParamsObj)) {
			for (const key in queryParamsObj) {
				if (!queryParamsObj[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(queryParamsObj, key)) {
					queryParams.set(key, queryParamsObj[key])
				}
			}

			setQueryParams(queryParams)
			fetchFollowUpsCount()
		}
	}

	const getQueryObject = (queryRawObject) => {
		// TODO: Remove this key mapping
		let queryObjectToBeMapped = _.pickBy(queryRawObject, (value) => value !== '')
		let replacedKeys = Object.keys(queryObjectToBeMapped)
			.filter((key) => key)
			.map((key) => {
				const newKey = queryKeyMapping[key] || null
				if (newKey) {
					// Dates
					// Follow Up Date From
					if (newKey === 'followup_date_from') {
						// const fromTimeValue = queryObjectToBeMapped['followUpTimeFrom']
						// 	/? queryObjectToBeMapped['followUpTimeFrom']
						// 	: '00:00:00'
						// const fromTimeName = queryObjectToBeMapped['followUpTimeFrom'] ? queryObjectToBeMapped['followUpTimeFrom'] : ''
						// const tempObj = {
						// 	placeholder: 'From',
						// 	queryParameter: 'followup_date_from',
						// 	value: `${queryObjectToBeMapped[key]}T${fromTimeValue}`,
						// 	name: `${queryObjectToBeMapped[key]} ${fromTimeName}`,
						// }
						const tempObj = {
							placeholder: 'From',
							queryParameter: 'followup_date_from',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsDateFrom(tempObj))
					}
					// Follow Up Date To
					if (newKey === 'followup_date_to') {
						// const toTimeValue = queryObjectToBeMapped['followUpTimeTo'] ? queryKeyMapping['followUpTimeTo'] : '23:59:59'
						// const toTimeName = queryObjectToBeMapped['followUpTimeTo'] ? queryObjectToBeMapped['followUpTimeTo'] : ''
						// const tempObj = {
						// 	placeholder: 'To',
						// 	queryParameter: 'followup_date_to',
						// 	value: `${queryObjectToBeMapped[key]}T${toTimeValue}`,
						// 	name: `${queryObjectToBeMapped[key]} ${toTimeName}`,
						// }

						const tempObj = {
							placeholder: 'To',
							queryParameter: 'followup_date_to',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsDateTo(tempObj))
					}

					// Status
					// Main Status
					if (newKey === 'status') {
						const tempObj = {
							placeholder: 'Status',
							queryParameter: 'status',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsMainStatus(tempObj))
					}
					// Sub Status
					if (newKey === 'sub_status') {
						const tempObj = {
							placeholder: 'Sub Status',
							queryParameter: 'sub_status',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsSubStatus(tempObj))
					}

					// Enquirer Information
					// Enquirer Name
					if (newKey === 'enquirer_name') {
						const tempObj = {
							placeholder: 'Enquirer Name',
							queryParameter: 'enquirer_name',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsEnquirerName(tempObj))
					}
					// Enquirer Phone
					if (newKey === 'enquirer_phone') {
						const tempObj = {
							placeholder: 'Enquirer Phone',
							queryParameter: 'enquirer_phone',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsEnquirerPhone(tempObj))
					}
					// Patient Information
					// Patient Country ID & Patient Country Name
					if (newKey === 'patient_country_id') {
						const tempObj = {
							placeholder: 'Patient Country',
							queryParameter: 'patient_country_id',
							value: queryObjectToBeMapped[key],
							name: getCountryName(queryObjectToBeMapped[key]),
						}
						dispatch(setFacebookFollowUpsPatientCountry(tempObj))
					}
					// Additional Information
					// Category
					if (newKey === 'category_id') {
						const tempObj = {
							placeholder: 'Category',
							queryParameter: 'category_id',
							value: queryObjectToBeMapped[key],
							name: getCategoryName(queryObjectToBeMapped[key]),
						}
						dispatch(setFacebookFollowUpsCategory(tempObj))
					}
					// Lead Tier
					if (newKey === 'lead_tier') {
						const tempObj = {
							placeholder: 'Tier',
							queryParameter: 'lead_tier',
							value: queryObjectToBeMapped[key],
							name: _.startCase(_.toLower(queryObjectToBeMapped[key])),
						}
						dispatch(setFacebookFollowUpsTier(tempObj))
					}
					// Lead ID
					if (newKey === 'lead_id') {
						const tempObj = {
							placeholder: 'Lead ID',
							queryParameter: 'lead_id',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsLeadId(tempObj))
					}
					// Treatment Intensity
					if (newKey === 'treatment_intensity') {
						const tempObj = {
							placeholder: 'Treatment Intensity',
							queryParameter: 'treatment_intensity',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setFacebookFollowUpsTreatmentIntensity(tempObj))
					}
					return { [newKey]: queryObjectToBeMapped[key] }
				}
			})
		const queryObj = {
			// page: 1,
			type: followUpType,
			...replacedKeys.reduce((a, b) => Object.assign({}, a, b)),
		}
		return queryObj
	}

	const handleClearFilter = () => {
		Object.keys(filterChips).forEach((filterChipKey) => {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj.value) {
				const queryKey = queryKeyMapping[filterChipKey]
				queryParams.delete(queryKey)
			}
		})

		// queryParams.set('page', 1)
		dispatch(resetFacebookFollowUpsFilter())
		// queryParams.set('type', followUpType)
		queryParams.set('type', 'today')
		setQueryParams(queryParams)
		setFollowUpsTabIndex(0)
		fetchFollowUpsCount()
	}
	const handleDeleteFilterChip = (filterKey, filterObj) => {
		const queryKey = queryKeyMapping[filterKey]
		queryParams.delete(queryKey)
		// queryParams.set('page', 1)
		setQueryParams(queryParams)
		let tempObj = { queryParameter: filterObj.queryParameter, value: null }

		// Dates
		// Lead Date From
		if (filterKey === 'followUpDateFrom') {
			dispatch(setFacebookFollowUpsDateFrom(tempObj))
		}
		// Lead Date To
		if (filterKey === 'followUpDateTo') {
			dispatch(setFacebookFollowUpsDateTo(tempObj))
		}

		// Status
		// Main Status
		if (filterKey === 'mainStatus') {
			dispatch(setFacebookFollowUpsMainStatus(tempObj))
		}
		// Sub Status
		if (filterKey === 'subStatus') {
			dispatch(setFacebookFollowUpsSubStatus(tempObj))
		}

		// Enquirer Information
		// Enquirer Name
		if (filterKey === 'enquirerName') {
			dispatch(setFacebookFollowUpsEnquirerName(tempObj))
		}
		// Enquirer Phone
		if (filterKey === 'enquirerPhone') {
			dispatch(setFacebookFollowUpsEnquirerPhone(tempObj))
		}

		// Patient Information
		// Patient Country ID & Patient Country Name
		if (filterKey === 'patientCountry') {
			// dispatch(setFacebookFollowUpsPatientCountryName(tempObj))
			dispatch(setFacebookFollowUpsPatientCountry(tempObj))
		}

		// Additional Information
		// Category
		if (filterKey === 'category') {
			dispatch(setFacebookFollowUpsCategory(tempObj))
		}
		//Tier
		if (filterKey === 'tier') {
			dispatch(setFacebookFollowUpsTier(tempObj))
		}
		// Lead ID
		if (filterKey === 'leadId') {
			dispatch(setFacebookFollowUpsLeadId(tempObj))
		}
		// Treatment Intensity
		if (filterKey === 'treatmentIntensity') {
			dispatch(setFacebookFollowUpsTreatmentIntensity(tempObj))
		}
	}

	useEffect(() => {
		fetchFollowUpsCount()
	}, [queryParams, followUpsTabIndex, user.userId, selectedSalesEmpId])
	useEffect(() => {
		if (followUpCount != null) {
			fetchFollowUpsData()
		}
	}, [followUpCount])

	return (
		<Box px={matches ? 3 : 1} py={2} width="100%" display="flex" flexDirection="column" justifyContent="center">
			<Box display="flex" justifyContent="end" mb={2}>
				{(user.isAdmin || user.isAuditor) && <SalesEmpComponent handleSalesEmpChange={handleSalesEmpChange} />}
			</Box>
			<Box display="flex" flexDirection={matches ? 'row' : 'column'} justifyContent="space-between" sx={{ mb: 2 }}>
				<Box>
					{noOfFilters === 0 && (
						<Box>
							<Tabs
								sx={{
									'.Mui-selected': {
										backgroundColor: getFollowUpsTabBackgroundColor,
									},
									'.MuiTabs-indicator': {
										background: 'none',
									},
									mb: matches ? 0 : 2,
								}}
								value={followUpsTabIndex}
								onChange={handleFollowUpsTabChange}
								variant="scrollable"
								scrollButtons={!matches}>
								<Tab
									component={Box}
									sx={{
										border: '1px solid #0089D6',
										borderRadius: 1,
										width: matches ? '150px' : '120px',
										mr: 0.5,
										color: '#5A5A5A !important',
										fontSize: matches ? '18px' : '16px',
										textTransform: 'capitalize',
									}}
									label={
										<Box display="flex">
											<Box
												sx={{
													backgroundColor: '#0089D6',
													minWidth: 30,
													color: '#fff',
													mr: 1,
													borderRadius: 1,
												}}>
												{followUpCount?.today}
											</Box>
											Today
										</Box>
									}
								/>
								<Tab
									component={Box}
									sx={{
										border: '1px solid #FDD835',
										borderRadius: 1,
										width: matches ? '150px' : '120px',
										mr: 0.5,
										color: '#5A5A5A !important',
										fontSize: matches ? '18px' : '16px',
										textTransform: 'capitalize',
									}}
									label={
										<Box display="flex">
											<Box
												sx={{
													backgroundColor: '#FDD835',
													minWidth: 30,
													color: '#fff',
													mr: 1,
													borderRadius: 1,
												}}>
												{followUpCount?.upcoming}
											</Box>
											Upcoming
										</Box>
									}
								/>
								<Tab
									component={Box}
									sx={{
										border: '1px solid #E57373',
										borderRadius: 1,
										width: matches ? '150px' : '120px',
										mr: 0.5,
										color: '#5A5A5A !important',
										fontSize: matches ? '18px' : '16px',
										textTransform: 'capitalize',
									}}
									label={
										<Box display="flex">
											<Box
												sx={{
													backgroundColor: '#E57373',
													minWidth: 30,
													color: '#fff',
													mr: 1,
													borderRadius: 1,
												}}>
												{followUpCount?.missed}
											</Box>
											Missed
										</Box>
									}
								/>
							</Tabs>
						</Box>
					)}
					{noOfFilters !== 0 && (
						<Box
							display="flex"
							alignItems="center"
							justifyContent="center"
							sx={{
								border: '1px solid #0089D6',
								borderRadius: 1,
								width: matches ? '150px' : '120px',
								height: '50px',
								mr: 0.5,
								color: '#5A5A5A !important',
								backgroundColor: '#DEF3FF',
								mb: matches ? 0 : 2,
							}}>
							<Box
								sx={{
									backgroundColor: '#0089D6',
									minWidth: 30,
									color: '#fff',
									fontSize: '18px',
									fontWeight: '500',
									mr: 1,
									textAlign: 'center',
									paddingBottom: '2px',
									borderRadius: 1,
								}}>
								{followUpCount.all}
							</Box>
							<Typography fontSize={matches ? '18px' : '16px'}>All</Typography>
						</Box>
					)}
				</Box>
				<Box>
					<IconButton onClick={handleFilterOpen}>
						<FilterAltIcon />
					</IconButton>
					<FacebookFollowUpsFilterComponent
						handleClearFilter={handleClearFilter}
						open={isFilterVisible}
						onClose={handleFilterClose}
						onSubmit={handleFilterSubmit}
					/>
				</Box>
			</Box>
			<Divider sx={{ mb: 2 }} />
			{noOfFilters > 0 && (
				<Box>
					{Object.keys(filterChips).map((filterChipKey) => {
						const filterChipObj = filterChips[filterChipKey]
						let filterChipValue = filterChipObj?.value
						if (filterChipValue && filterChipKey != '_persist') {
							if (filterChipObj?.name) {
								return (
									<Chip
										key={filterChipKey}
										label={`${filterChipObj.placeholder}: ${filterChipObj.name}`}
										onDelete={() => handleDeleteFilterChip(filterChipKey, filterChipObj)}
										sx={{ mr: 2 }}
									/>
								)
							}
							return (
								<Chip
									key={filterChipKey}
									label={`${filterChipObj.placeholder}: ${filterChipValue}`}
									onDelete={() => handleDeleteFilterChip(filterChipKey, filterChipObj)}
									sx={{ mr: 2 }}
								/>
							)
						} else return null
					})}

					<Button variant="outlined" color="error" onClick={handleClearFilter}>
						Clear Filter
					</Button>
				</Box>
			)}
			{isLoading ? (
				// Show loader until the data is loaded
				<Box style={{ width: '100vw' }}>
					<CircularLoader />
				</Box>
			) : followUpsData.length > 0 ? (
				// Show the table after if data is loaded
				<TableContainer sx={{ maxWidth: '96vw', margin: 'auto' }}>
					<Table aria-label="Patient Detail Table">
						<TableHead>
							<TableRow>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Lead ID
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Follow up at
								</TableCell>
								<TableCell
									size="small"
									sx={{
										borderBottom: 'none',
										fontWeight: 'bold',
										whiteSpace: 'nowrap',
									}}>
									Enquirer name
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Country
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Contact
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Follow Up Note
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Follow Up Count
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Status
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Category
								</TableCell>
								<TableCell size="small" sx={{ borderBottom: 'none', fontWeight: 'bold' }}>
									Tier
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{followUpsData?.map((data) => {
								return (
									<TableRow key={data.id}>
										{/* Lead ID */}
										<TableCell size="small" style={{ width: '10px' }}>
											<Chip
												label={data.lead_id}
												sx={{
													bgcolor: '#78909C',
													borderRadius: '5px',
													color: '#FFFFFF',
													marginRight: 1,
												}}
												onClick={() => {
													window.open(`${window.location.origin}/lead/${data.lead_id}`)
												}}
											/>
										</TableCell>
										{/* Follow Up At */}
										<TableCell size="small" style={{ width: '20px' }}>
											<Chip
												label={data.followup_at}
												sx={{
													bgcolor: getFollowUpChipColor(data.followup_status, data.followup_at),
													borderRadius: '5px',
													color: '#FFFFFF',
													':hover': {
														backgroundColor: getFollowUpChipColor(data.followup_status, data.followup_at),
													},
													marginRight: 1,
												}}
												onClick={() => {
													handleOpenFollowUpModal(data.lead_id, data.followup_at, data.status)
												}}
											/>
										</TableCell>
										{/* Enquirer Name */}
										<TableCell size="small" style={{ width: '100px' }}>
											{data.enquirer_name}
										</TableCell>

										{/* Country */}
										<TableCell size="small" style={{ width: '100px' }}>
											<Typography variant="body2">{data.country_name}</Typography>
										</TableCell>

										{/* Contact */}
										<TableCell size="small" style={{ width: '100px' }}>
											{user.isAuditor ? (
												<Typography variant="body2">
													<span>{data.enquirer_phone.slice(0, 5)}*****</span>
													<br />
													<span>********</span>
												</Typography>
											) : (
												<Typography variant="body2">
													<a href={data?.enquirer_phone ? `tel:${data.enquirer_phone}` : ''}>
														{data.enquirer_phone}
													</a>
													<br />
													<a href={data?.enquirer_email ? `mailto:data.enquirer_email` : ''}>
														{data.enquirer_email}
													</a>
												</Typography>
											)}
										</TableCell>

										{/* Follow Up Note */}
										<TableCell size="small" sx={{ minWidth: 200 }}>
											<Typography>{data?.followup_note ? data.followup_note : '----'}</Typography>
										</TableCell>

										{/* Follow Up Count */}
										<TableCell size="small" sx={{ minWidth: 200 }}>
											<Typography>{data?.followup_count ? data.followup_count : '----'}</Typography>
										</TableCell>

										{/* Status */}
										<TableCell size="small" style={{ width: '100px' }}>
											{data?.status?.current_status ? (
												<Chip
													sx={{
														bgcolor: '#37C0B2',
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													onClick={() => {
														handleOpenFollowUpModal(data.lead_id, data.followup_at, data.status)
													}}
													label={`${data.status.current_status.replace(/_/g, ' ')} 
                              ${data.status.sub_status ? '- ' + data.status.sub_status.replace(/_/g, ' ') : ''}`}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Category */}
										<TableCell size="small" style={{ width: '100px' }}>
											{data?.category ? (
												<Chip
													sx={{
														bgcolor: '#6574C4',
														borderRadius: '20px',
														color: '#FFFFFF',
														height: '22px',
													}}
													label={data.category}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Tier */}
										<TableCell size="small" style={{ width: '100px' }}>
											{data?.tier ? (
												<Chip
													sx={{
														bgcolor: tierChipColor(data.tier),
														borderRadius: '20px',
														color: '#FFFFFF',
														height: '22px',
													}}
													label={data.tier}
												/>
											) : (
												'----'
											)}
										</TableCell>
										{data.lead_id === selectedLeadId && (
											<FollowUpModalPopup
												actualInvoice={data.actual_invoice}
												arrivalAt={data.arrival_at}
												estimatedInvoice={data.estimated_invoice}
												fieldPersonName={data.field_person_name}
												hotelName={data.hotel_name}
												passportNumber={data.passport_number}
												registrationNumber={data.registration_number}
												visaExpiryAt={data.visa_expiry_at}
												hotelType={data.hotel_type}
												arrivalType={data.arrival_type}
												selectedLeadId={selectedLeadId}
												open={openFollowUpModal}
												onClose={() => {
													handleCloseFollowUpModal()
												}}
												followUpData={followUpData}
												statusData={statusData}
												status={
													!status?.find((item) => item.status === statusData?.current_status) && statusData
														? [
																...status,
																{
																	status: statusData.current_status,
																	substatus: statusData.sub_status ? [statusData.sub_status] : [],
																},
														  ]
														: status
												}
											/>
										)}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				// Show if the data is loaded but there is no follow ups to show
				<Box
					style={{
						display: 'flex',
						justifyContent: 'center',
						minHeight: '60vh',
						alignItems: 'center',
					}}>
					<Box>
						<img src={noData} alt="no documents" height={100} width={100} />
						<Typography style={{ textAlign: 'center' }}>No follow ups</Typography>
					</Box>
				</Box>
			)}
		</Box>
	)
}

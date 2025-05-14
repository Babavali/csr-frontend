/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../../shared/axios'
import { toast } from 'react-toastify'
import { IconButton, Box, Tabs, Tab, Grid, useMediaQuery, Typography, Chip, Tooltip, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import SalesEmpComponent from '../../leads/myLeads/components/salesEmpComponent'
import noData from '../../../assets/no-data.svg'
import CircularLoader from '../../../components/common/loader/circularLoader'
import PartnerLeadListingFilter from './components/partnerLeadListingFilter'
import PartnerLeadListingComponent from './components/partnerLeadListingComponent'
import usePagination from '../../../components/pagination'
import PartnerTransferMultipleLeadsModalPopup from './components/partnerTransferMultipleLeadsModalPopup'
// MUI Icons
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import EventIcon from '@mui/icons-material/Event'
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation'
//mixin

import {
	setPartnerLeadListingLeadGeneratedDateFrom,
	setPartnerLeadListingLeadGeneratedDateTo,
	setPartnerLeadListingMainStatus,
	setPartnerLeadListingTier,
	setPartnerLeadListingPartnerName,
	setPartnerLeadListingLeadSource,
	resetPartnerLeadListingFilter,
} from '../../../slices/partnerLeadListingFilterSlice'
import { useDispatch } from 'react-redux'
export default function partnerLeadListingPage() {
	const dispatch = useDispatch()
	const queryKeyMapping = {
		leadGeneratedDateFrom: 'lead_date_from',
		leadGeneratedDateTo: 'lead_date_to',

		mainStatus: 'status',
		subStatus: 'sub_status',

		partnerName: 'partner_name',
		enquirerEmail: 'enquirer_email',
		enquirerPhoneNumber: 'enquirer_phone',
		enquirerCountry: 'enquirer_country_id',
		preferredLanguage: 'preferred_language',
		contactMeans: 'preferred_contact_means',

		patientName: 'patient_name',
		patientGender: 'patient_gender',
		patientDob: 'patient_birth_date',
		patientAddress: 'patient_address',
		patientPostalCode: 'patient_postal_code',
		patientCountry: 'patient_country_id',

		category: 'category_id',
		tier: 'lead_tier',
		leadId: 'lead_id',
		leadSource: 'lead_source',
		treatmentIntensity: 'treatment_intensity',
	}
	const matches = useMediaQuery('(min-width: 600px)')
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const [leadData, setPartnerLeadListingData] = useState([])
	const [selectedSalesEmpId, setSelectedSalesEmpId] = useState()
	const [selectedPartnerId, setSelectedPartnerId] = useState()
	const [isFilterVisible, setIsFilterVisible] = useState(false)
	const [paginationData, setPaginationData] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()
	const pathName = location.pathname + location.search
	const initialSearchParams = new URLSearchParams(location.search)
	const [queryParams, setQueryParams] = useSearchParams()
	const leadListingType = initialSearchParams.get('type') || 'doctor'
	// Transfer Multiple Leads
	const [transferMultipleLeadsArray, setTransferMultipleLeadsArray] = useState([])
	const isLeadSelected = useMemo(() => transferMultipleLeadsArray.length > 0, [transferMultipleLeadsArray])
	const [openTransferMultipleLeadsModal, setOpenTransferMultipleLeadsModal] = useState(false)

	// Redux
	const filterObj = useSelector((state) => state.partnerLeadListingFilterReducer)
	const filterChips = filterObj.partnerLeadListingFilter

	let partnerPage = parseInt(initialSearchParams.get('page'), 10) || 1
	const [partnerLeadPage, setPartnerLeadPage] = useState(partnerPage)

	const setTabNumber = () => {
		if (location.search.includes('is_transferred=true')) {
			return 3
		} else if (leadListingType === 'stale') {
			return 2
		} else if (leadListingType === 'sales') {
			return 1
		} else if (leadListingType === 'doctor') {
			return 0
		}
	}
	const [leadListingTabIndex, setPartnerLeadListingTabNumber] = useState(setTabNumber())
	const [noOfFilters, setNoOfFilters] = useState(0)
	const handleSalesEmpChange = (salesEmpId) => {
		setSelectedSalesEmpId(salesEmpId)
	}
	const getQueryObject = (queryRawObject) => {
		// TODO: Remove this key mapping
		let queryObjectToBeMapped = _.pickBy(queryRawObject, (value) => value !== '')
		let replacedKeys = Object.keys(queryObjectToBeMapped)
			.filter((key) => key)
			.map((key) => {
				const newKey = queryKeyMapping[key] || null
				// Dates
				// Lead Date From
				if (newKey === 'lead_date_from') {
					const tempObj = {
						placeholder: 'From',
						queryParameter: 'lead_date_from',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setPartnerLeadListingLeadGeneratedDateFrom(tempObj))
				}
				// Lead Date To
				if (newKey === 'lead_date_to') {
					const tempObj = {
						placeholder: 'To',
						queryParameter: 'lead_date_to',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setPartnerLeadListingLeadGeneratedDateTo(tempObj))
				}

				// Status
				// Main Status
				if (newKey === 'status') {
					const tempObj = {
						placeholder: 'Status',
						queryParameter: 'status',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setPartnerLeadListingMainStatus(tempObj))
				}
				// Tier
				if (newKey === 'lead_tier') {
					const tempObj = {
						placeholder: 'Tier',
						queryParameter: 'lead_tier',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setPartnerLeadListingTier(tempObj))
				}
				if (newKey === 'lead_source') {
					const tempObj = {
						placeholder: 'Lead Source',
						queryParameter: 'lead_source',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setPartnerLeadListingLeadSource(tempObj))
				}
				// Partner Name
				if (newKey === 'partner_name') {
					const tempObj = {
						placeholder: 'Name',
						queryParameter: 'partner_name',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setPartnerLeadListingPartnerName(tempObj))
				}

				return { [newKey]: queryObjectToBeMapped[key] }
			})
		const queryObj = {
			page: 1,
			type: leadListingType,
			...replacedKeys.reduce((a, b) => Object.assign({}, a, b)),
		}
		return queryObj
	}

	const handleFilterSubmit = (filteringObj) => {
		console.log(filteringObj)
		const trialFilterParams = { page: 1, type: leadListingType }
		for (const filterChipKey of Object.keys(filterChips)) {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj.value) {
				trialFilterParams[filterChipObj.queryParameter] = filterChipObj.value
			}
		}
		const queryParamsObj = getQueryObject(filteringObj)
		setPartnerLeadPage(1)
		if (!_.isEmpty(queryParamsObj)) {
			for (const key in queryParamsObj) {
				if (!queryParamsObj[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(queryParamsObj, key)) {
					queryParams.set(key, queryParamsObj[key])
				}
			}
			setQueryParams(queryParams)
		}
	}

	const handleClearFilter = () => {
		setPartnerLeadPage(1)
		setIsFilterVisible(false)
		Object.keys(filterChips).forEach((filterChipKey) => {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj.value) {
				const queryKey = queryKeyMapping[filterChipKey]
				queryParams.delete(queryKey)
			}
		})
		queryParams.set('page', 1)
		queryParams.set('type', leadListingType)
		setQueryParams(queryParams)
		dispatch(resetPartnerLeadListingFilter())
	}

	const handleDeleteFilterChip = (filterKey, filterObj) => {
		setPartnerLeadPage(1)
		const queryKey = queryKeyMapping[filterKey]
		queryParams.delete(queryKey)
		queryParams.set('page', 1)
		setQueryParams(queryParams)
		let tempObj = { queryParameter: filterObj.queryParameter, value: null }

		// Dates
		// Lead Date From
		if (filterKey === 'leadGeneratedDateFrom') {
			dispatch(setPartnerLeadListingLeadGeneratedDateFrom(tempObj))
		}
		// Lead Date To
		if (filterKey === 'leadGeneratedDateTo') {
			dispatch(setPartnerLeadListingLeadGeneratedDateTo(tempObj))
		}

		// Status
		// Main Status
		if (filterKey === 'mainStatus') {
			dispatch(setPartnerLeadListingMainStatus(tempObj))
		}
		// Tier
		if (filterKey === 'tier') {
			dispatch(setPartnerLeadListingTier(tempObj))
		}
		// Lead Source
		if (filterKey === 'leadSource') {
			dispatch(setPartnerLeadListingLeadSource(tempObj))
		}
		// Partner Name
		if (filterKey === 'partnerName') {
			dispatch(setPartnerLeadListingPartnerName(tempObj))
		}
	}

	const handleLeadListingTabChange = (_event, newTabIndex) => {
		setPartnerLeadListingTabNumber(newTabIndex)
		setPartnerLeadPage(1)
		if (newTabIndex === 0) {
			navigate(`/business-partners?type=doctor&page=${partnerLeadPage}`)
		} else if (newTabIndex === 1) {
			navigate(`/business-partners?type=sales&page=${partnerLeadPage}`)
		} else if (newTabIndex === 2) {
			navigate(`/business-partners?type=stale&page=${partnerLeadPage}`)
		} else if (newTabIndex === 3) {
			navigate(`/business-partners?is_transferred=true&page=${partnerLeadPage}`)
		}
	}

	const fetchLeadListingData = useCallback(() => {
		setIsLoading(true)
		setNoOfFilters(0)
		setPartnerLeadListingData([])

		let filterNumber = 0
		const trialFilterParams = { type: leadListingType }
		for (const filterChipKey of Object.keys(filterChips)) {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj && filterChipObj.value) {
				trialFilterParams[filterChipObj.queryParameter] = filterChipObj.value
				filterNumber++
			}
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
		setNoOfFilters(filterNumber)

		let url
		// Doctor Leads
		if (leadListingTabIndex === 0) {
			url =
				`/sales/leads/doctor-leads` +
				(queryParams ? `?${queryParams}` : `?page=${partnerLeadPage}`) +
				`${selectedSalesEmpId ? '&assigned_to=' + selectedSalesEmpId : '&emp_id=' + user.userId}`
		}
		// Sales Partner Leads
		else if (leadListingTabIndex === 1) {
			url = `/sales/leads/partner-leads` + (queryParams ? `?${queryParams}` : `?page=${partnerLeadPage}`) + `&emp_id=${user.userId}`
		} else if (leadListingTabIndex === 2 || leadListingTabIndex === 3) {
			url =
				`/sales/leads/doctor-leads` +
				(queryParams ? `?${queryParams}` : `&page=${partnerLeadPage}`) +
				`${selectedSalesEmpId ? '&assigned_to=' + selectedSalesEmpId : '&emp_id=' + user.userId}`
		}

		axios
			.get(url)
			.then((res) => {
				setPartnerLeadListingData(res.data.data.data)
				setPaginationData(res.data.data.meta)
				setIsLoading(false)
			})
			.catch((error) => {
				toast.error(error.response?.data.data.message, {
					position: 'bottom-left',
				})
				setIsLoading(false)
			})
	}, [
		queryParams,
		user.isAdmin,
		user.userId,
		queryParams,
		leadListingTabIndex,
		selectedPartnerId,
		selectedSalesEmpId,
		user.isAuditor,
		user.userId,
	])

	useEffect(() => {
		fetchLeadListingData()
	}, [queryParams, leadListingTabIndex, selectedPartnerId, selectedSalesEmpId])
	const handleFilterOpen = () => {
		setIsFilterVisible(true)
	}
	const handleFilterClose = () => {
		setIsFilterVisible(false)
	}

	const perPage = paginationData?.per_page
	const Pagination = usePagination(leadData, perPage)

	const handlePartnerLeadPageChange = (_event, pageNumber) => {
		setPartnerLeadPage(pageNumber)
		Pagination.jump(pageNumber)
		queryParams.set('page', pageNumber)
		setQueryParams(queryParams)
	}

	const handleTransferMultipleLeadsArray = (arr) => {
		setTransferMultipleLeadsArray(arr)
	}

	return (
		<>
			<Box
				sx={{
					width: '95%',
					margin: 'auto',
				}}>
				<Grid container sx={{ width: '100%' }}>
					{/* tabs */}
					<Grid item md={6} xs={12} lg={6}>
						<Box
							sx={{
								borderColor: 'divider',
								display: 'flex',
								gap: 2,
								alignItems: 'center',
								justifyContent: matches ? undefined : 'space-between',
							}}>
							<Tabs value={leadListingTabIndex} onChange={handleLeadListingTabChange} aria-label="basic tabs example">
								<Tab label={'Doctor'} />
								<Tab label={'Partner'} />
								<Tab label={'Doctor Stale'} />
								<Tab label={'Transferred'} />
							</Tabs>
						</Box>
					</Grid>
					<Grid item md={6} xs={12} lg={6} display="flex" sx={{ alignItems: 'center', gap: 2 }}>
						<Box sx={{ width: '100%' }}>
							{(user.isAdmin || user.isAuditor) && <SalesEmpComponent handleSalesEmpChange={handleSalesEmpChange} />}
						</Box>
						<Box display="flex" sx={{ gap: 2, justifyContent: matches ? 'end' : 'space-evenly' }}>
							{(user.isAdmin || user.isAuditor) && isLeadSelected && (
								<Tooltip arrow title="Transfer Multiple Leads">
									<IconButton
										color="inherit"
										aria-label="menu"
										style={{ padding: '0px' }}
										onClick={() => {
											setOpenTransferMultipleLeadsModal(true)
										}}>
										<TransferWithinAStationIcon />
									</IconButton>
								</Tooltip>
							)}
							<PartnerTransferMultipleLeadsModalPopup
								transferMultipleLeadsArray={transferMultipleLeadsArray}
								open={openTransferMultipleLeadsModal}
								onClose={() => {
									setOpenTransferMultipleLeadsModal(false)
								}}
							/>
							{isAllowed('view_doctor_followup') && (
								<Tooltip arrow title="View Follow Ups">
									<IconButton
										color="inherit"
										aria-label="menu"
										style={{ padding: '0px' }}
										onClick={() => {
											if (leadListingTabIndex === 1) {
												navigate(`/business-partner/sales/follow-ups`)
											} else {
												navigate(`/business-partner/doctor/follow-ups`)
											}
										}}>
										<EventIcon />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip arrow title="Open Filters">
								<IconButton color="inherit" aria-label="menu" style={{ padding: '0px' }} onClick={handleFilterOpen}>
									<FilterAltIcon />
								</IconButton>
							</Tooltip>
							<PartnerLeadListingFilter
								handleClearFilter={handleClearFilter}
								open={isFilterVisible}
								onClose={handleFilterClose}
								onSubmit={handleFilterSubmit}
							/>
						</Box>
					</Grid>
				</Grid>

				{queryParams
					.get('query')
					?.split('&')
					.map((pair) => pair.split('='))
					.filter(([key, value]) => key !== 'undefined' && value !== 'undefined')
					.map(([key, value]) => ({
						key: key?.replace(/_/g, ' '),
						value: value?.replace(/_/g, ' '),
					}))
					.map(({ key, value }, index) => (
						<Chip key={index} label={`${key}: ${value}`} sx={{ marginBottom: 2, marginRight: 1 }} />
					))}

				<Box display="flex" alignItems="center" gap={2} mt={2}>
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
				</Box>
				{/* TabPanel start */}

				{/* Doctor Leads */}
				<Box>
					{isLoading ? (
						<CircularLoader />
					) : leadData.length === 0 ? (
						<Box
							style={{
								display: 'flex',
								justifyContent: 'center',
								minHeight: '60vh',
								alignItems: 'center',
							}}>
							<Box>
								<img src={noData} alt="no documents" height={100} width={100} />
								<Typography style={{ textAlign: 'center' }}>No leads found</Typography>
							</Box>
						</Box>
					) : (
						<PartnerLeadListingComponent
							tabName={leadListingTabIndex === 1 ? 'sales' : 'doctor'}
							matches={matches}
							query={queryParams.toString()}
							paginationData={paginationData}
							data={leadData}
							leadPage={partnerLeadPage}
							handleLeadPageChange={handlePartnerLeadPageChange}
							transferMultipleLeadsArray={transferMultipleLeadsArray}
							handleTransferMultipleLeadsArray={handleTransferMultipleLeadsArray}
							fetchData={fetchLeadListingData}
						/>
					)}
				</Box>

				{/* TabPanel ends  */}
				{/* Cards */}
			</Box>
		</>
	)
}

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
// Packages
import axios from '../../shared/axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import _ from 'lodash'
// MUI Components
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	IconButton,
	Modal,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	useMediaQuery,
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
// MUI Icons
import DownloadIcon from '@mui/icons-material/Download'
// Local Components
import LeadUpdatesFilter from './components/leadUpdatesFilter'
import usePagination from '../../components/pagination'
import CircularLoader from '../../components/common/loader/circularLoader'
import { toast } from 'react-toastify'
// Redux Filter
import { setLeadUpdatesDateFrom, setLeadUpdatesDateTo, resetLeadUpdatesFilter } from '../../slices/leadUpdatesFilterSlice'
import { useDispatch, useSelector } from 'react-redux'
// const filterChips = filterObj.leadUpdatesFilter

export default function LeadUpdatesPage() {
	const matches = useMediaQuery('(min-width: 600px)')
	const [leadUpdatesData, setLeadUpdatesData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	// const [leadUpdatesCSVData, setLeadUpdatesCSVData] = useState([])
	const navigate = useNavigate()
	// Page Number Start
	let [page, setPage] = useState(1)
	const PER_PAGE = 10
	const count = Math.ceil(leadUpdatesData.length / PER_PAGE)
	const leadUpdates = usePagination(leadUpdatesData, PER_PAGE)
	const handlePageChange = (event, page) => {
		setPage(page)
		leadUpdates.jump(page)
	}
	// Page Number End

	// Modal Variables Start
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalDataIndex, setModalDataIndex] = useState(0)
	const handleOpenModal = (index) => {
		setIsModalOpen(true)
		setModalDataIndex(index)
	}
	const handleCloseModal = () => {
		setIsModalOpen(false)
	}
	const modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		width: '80vw',
		height: '80vh',
		overflow: 'scroll',
	}
	// Modal Variables End

	// Filter Variables Start
	const [noOfFilters, setNoOfFilters] = useState(0)
	const dispatch = useDispatch()
	const leadUpdatesFilter = useSelector((state) => state.leadUpdatesFilterReducer.leadUpdatesFilter)

	const [queryParams, setQueryParams] = useSearchParams()
	const queryKeyMapping = {
		leadUpdatesDateFrom: 'lead_date_from',
		leadUpdatesDateTo: 'lead_date_to',
	}
	// Filter Variables End

	const fetchLeadUpdatesData = () => {
		setIsLoading(true)
		setLeadUpdatesData([])
		// Filter
		let filterNumber = 0
		const filterParams = {}
		for (const filterChipKey of Object.keys(leadUpdatesFilter)) {
			const filterChipObj = leadUpdatesFilter[filterChipKey]
			if (filterChipObj && filterChipObj.value) {
				filterParams[filterChipObj.queryParameter] = filterChipObj.value
				filterNumber++
			}
		}
		setNoOfFilters(filterNumber)
		if (!_.isEmpty(filterParams)) {
			for (const key in filterParams) {
				if (!filterParams[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(filterParams, key)) {
					queryParams.set(key, filterParams[key])
				}
			}
			// setQueryParams(queryParams)
		}

		// Axios Request
		const url = 'sales/leads/all-sale-emp-leads-count'
		axios
			.get(`${url}${queryParams ? `?${queryParams}` : ''}`)
			.then((res) => {
				setIsLoading(false)
				setLeadUpdatesData(res.data.data)
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	useEffect(() => {
		fetchLeadUpdatesData()
	}, [queryParams])

	const handleFilterSubmit = (filteringObj) => {
		const filterParams = { page: 1 }
		// followUpsFilterChips
		for (const filterChipKey of Object.keys(leadUpdatesFilter)) {
			const filterChipObj = leadUpdatesFilter[filterChipKey]
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
			fetchLeadUpdatesData()
		}
	}
	const getQueryObject = (queryRawObject) => {
		let queryObjectToBeMapped = _.pickBy(queryRawObject, (value) => value !== '')
		let replacedKeys = Object.keys(queryObjectToBeMapped)
			.filter((key) => key)
			.map((key) => {
				const newKey = queryKeyMapping[key] || null
				if (newKey) {
					// Dates
					// Follow Up Date From
					if (newKey === 'lead_date_from') {
						const tempObj = {
							placeholder: 'From',
							queryParameter: 'lead_date_from',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setLeadUpdatesDateFrom(tempObj))
					}
					// Follow Up Date To
					if (newKey === 'lead_date_to') {
						const tempObj = {
							placeholder: 'To',
							queryParameter: 'lead_date_to',
							value: queryObjectToBeMapped[key],
						}
						dispatch(setLeadUpdatesDateTo(tempObj))
					}
					return { [newKey]: queryObjectToBeMapped[key] }
				}
			})
		const queryObj = {
			page: 1,
			...replacedKeys.reduce((a, b) => Object.assign({}, a, b)),
		}
		return queryObj
	}
	const handleClearFilter = () => {
		Object.keys(leadUpdatesFilter).forEach((filterChipKey) => {
			const filterChipObj = leadUpdatesFilter[filterChipKey]
			if (filterChipObj.value) {
				const queryKey = queryKeyMapping[filterChipKey]
				queryParams.delete(queryKey)
			}
		})

		dispatch(resetLeadUpdatesFilter())
		setQueryParams(queryParams)
		fetchLeadUpdatesData()
	}
	const handleDeleteFilterChip = (filterKey, filterObj) => {
		const queryKey = queryKeyMapping[filterKey]
		queryParams.delete(queryKey)
		queryParams.set('page', 1)
		setQueryParams(queryParams)
		let tempObj = { queryParameter: filterObj.queryParameter, value: null }

		// Dates
		// Lead Date From
		if (filterKey === 'leadUpdatesDateFrom') {
			dispatch(setLeadUpdatesDateFrom(tempObj))
		}
		// Lead Date To
		if (filterKey === 'leadUpdatesDateTo') {
			dispatch(setLeadUpdatesDateTo(tempObj))
		}
	}

	const goToLeadDetailPage = (leadID) => {
		navigate(`/lead/${leadID}`)
	}

	// CSV Begin
	const headers = {
		lead_id: 'Lead ID',
		enquirer_name: 'Patient Name',
		status: 'Status',
		worked_at: 'Last Work',
		lead_assigned_at: 'Assigned At',
		task: 'Task',
		// leadUpdateObj
		sales_emp_id: 'Employee ID',
		sales_emp_name: 'Employee Name',
		leads_updated: 'Updated Lead Count',
		leads_not_updated_count: 'Not Updated Lead Count',
	}
	const handleDownloadAsCSV = () => {
		if (leadUpdates.currentData().length > 0) {
			startCSVDownload()
		}
	}
	const startCSVDownload = () => {
		const leadUpdatesArr = []
		leadUpdates.currentData().forEach((leadUpdateObj) => {
			leadUpdateObj.updated_leads.map((updatedLead) => {
				leadUpdatesArr.push({
					lead_id: updatedLead.lead_id,
					enquirer_name: updatedLead.enquirer_name,
					status: 'UPDATED',
					worked_at: updatedLead.worked_at,
					lead_assigned_at: updatedLead.lead_assigned_at,
					task: updatedLead.task,
					// leadUpdateObj
					sales_emp_id: leadUpdateObj.sales_emp_id,
					sales_emp_name: leadUpdateObj.sales_emp_name,
					leads_updated: leadUpdateObj.leads_updated,
					leads_not_updated_count: leadUpdateObj.leads_not_updated_count,
				})
			})
			leadUpdateObj.leads_not_updated.map((notUpdatedLead) => {
				leadUpdatesArr.push({
					lead_id: notUpdatedLead.lead_id,
					enquirer_name: notUpdatedLead.enquirer_name,
					status: 'NOT UPDATED',
					worked_at: '------',
					lead_assigned_at: '------',
					task: '------',
					// leadUpdateObj
					sales_emp_id: leadUpdateObj.sales_emp_id,
					sales_emp_name: leadUpdateObj.sales_emp_name,
					leads_updated: leadUpdateObj.leads_updated,
					leads_not_updated_count: leadUpdateObj.leads_not_updated_count,
				})
			})
		})
		const fileTitle = `leadUpdatesCSV`
		exportCSVFile(headers, leadUpdatesArr, fileTitle)
	}
	function exportCSVFile(headers, items, fileTitle) {
		if (headers) {
			items.unshift(headers)
		}
		//Convert Object to JSON
		var jsonObject = JSON.stringify(items)
		var csv = convertToCSV(jsonObject)
		var exportedFilenmae = fileTitle + '.csv' || 'export.csv'
		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, exportedFilenmae)
		} else {
			var link = document.createElement('a')
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob)
				link.setAttribute('href', url)
				link.setAttribute('download', exportedFilenmae)
				link.style.visibility = 'hidden'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			}
		}
	}
	function convertToCSV(objArray) {
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
		var str = ''

		for (var i = 0; i < array.length; i++) {
			var line = ''
			for (var index in array[i]) {
				if (line != '') line += ','

				line += array[i][index]
			}

			str += line + '\r\n'
		}

		return str
	}
	// CSV End
	return (
		<>
			<Box sx={{ width: '98%', margin: 'auto', marginTop: 2, marginY: 4, paddingX: 2 }}>
				<Box display="flex" justifyContent="space-between" sx={{ flexDirection: matches ? 'row' : 'column' }}>
					<Typography variant="h1" color="#505050" sx={{ fontSize: '30px', mb: 1 }}>
						Lead Updates
					</Typography>
					<LeadUpdatesFilter matches={matches} handleClearFilter={handleClearFilter} onSubmit={handleFilterSubmit} />
				</Box>
				<Divider sx={{ marginBottom: 3 }} />

				{noOfFilters > 0 && (
					<Box mb={1}>
						{Object.keys(leadUpdatesFilter).map((filterChipKey) => {
							const filterChipObj = leadUpdatesFilter[filterChipKey]
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
										label={`${filterChipObj.placeholder}: ${filterChipValue.replace('T', ' ')}`}
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
					<CircularLoader />
				) : (
					<Box>
						<Box mb={2} display="flex" justifyContent="end">
							{!user.isAuditor && user.userId !== 82 && isAllowed('get_partner_leads_csv') && (
								<Tooltip arrow title="Export as CSV">
									<IconButton color="success" size="large" onClick={handleDownloadAsCSV}>
										<DownloadIcon />
									</IconButton>
								</Tooltip>
							)}
						</Box>
						<TableContainer>
							<Table sx={{ tableLayout: 'fixed' }}>
								<TableHead sx={{ backgroundColor: '#bba1b4' }}>
									<TableRow
										sx={{
											[`& .${tableCellClasses.root}`]: {
												color: 'white',
												fontWeight: 550,
											},
										}}>
										<TableCell align="center">Advisor</TableCell>
										<TableCell align="center">Leads Assigned</TableCell>
										<TableCell align="center">Leads Updated</TableCell>
										<TableCell align="center">First Punch</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{leadUpdates &&
										leadUpdates.currentData().map((leadUpdate, index) => {
											return (
												<TableRow
													key={leadUpdate.sales_emp_id}
													style={{ cursor: 'pointer' }}
													onClick={() => {
														handleOpenModal(index)
													}}>
													<TableCell align="center">{leadUpdate.sales_emp_name}</TableCell>
													<TableCell align="center">{leadUpdate.leads_assigned}</TableCell>
													<TableCell align="center">{leadUpdate.leads_updated}</TableCell>
													<TableCell align="center">
														{leadUpdate.lead_activity?.punch_time && (
															<Typography
																sx={{ cursor: 'pointer', color: 'darkblue' }}
																onClick={() => {
																	goToLeadDetailPage(leadUpdate.lead_activity?.lead_id)
																}}>
																{leadUpdate.lead_activity?.punch_time}
															</Typography>
														)}
													</TableCell>
												</TableRow>
											)
										})}
								</TableBody>
							</Table>
						</TableContainer>
						{/* Lead Assigned Listing */}

						{leadUpdates.currentData()[modalDataIndex]?.sales_emp_name && (
							<Modal open={isModalOpen} onClose={handleCloseModal}>
								<Box sx={modalStyle}>
									<Typography variant="h5">{leadUpdates.currentData()[modalDataIndex].sales_emp_name}</Typography>
									<Typography variant="body2" sx={{ mb: 3 }}>
										Employee ID: {leadUpdates.currentData()[modalDataIndex].sales_emp_id}
									</Typography>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<Table>
												<TableHead sx={{ backgroundColor: '#000' }}>
													<TableRow>
														<TableCell align="center">
															<Typography variant="h6" color="white">
																Updated ({leadUpdates.currentData()[modalDataIndex].leads_updated})
															</Typography>
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{leadUpdates.currentData()[modalDataIndex].updated_leads.map((lead, index) => {
														return (
															<TableRow key={index}>
																<TableCell align="center" sx={{ backgroundColor: '#f5f5f4' }}>
																	{lead.lead_id} - {lead.enquirer_name} - {lead.lead_assigned_at}
																	<p>
																		(Last Work: {lead.task} @ {lead.worked_at})
																	</p>
																</TableCell>
															</TableRow>
														)
													})}
												</TableBody>
											</Table>
										</Grid>
										<Grid item xs={6}>
											<Table>
												<TableHead sx={{ backgroundColor: '#b91c1c' }}>
													<TableRow>
														<TableCell align="center">
															<Typography variant="h6" color="white">
																Not Updated (
																{leadUpdates.currentData()[modalDataIndex].leads_not_updated_count})
															</Typography>
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{leadUpdates.currentData()[modalDataIndex].leads_not_updated.map((lead, index) => {
														return (
															<TableRow key={index}>
																<TableCell align="center" sx={{ backgroundColor: '#fee2e2' }}>
																	{lead.lead_id} - {lead.enquirer_name}
																</TableCell>
															</TableRow>
														)
													})}
												</TableBody>
											</Table>
										</Grid>
									</Grid>
								</Box>
							</Modal>
						)}

						<Box display="flex" justifyContent="center" mt={4}>
							<Pagination count={count} color="primary" page={page} onChange={handlePageChange} shape="rounded" />
						</Box>
					</Box>
				)}
			</Box>
		</>
	)
}

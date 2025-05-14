/* eslint-disable  no-unused-vars */
// React
import * as React from 'react'
import { useState, useEffect } from 'react'
// Packages
import { useNavigate } from 'react-router-dom'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
// MUI Components
import {
	Box,
	Checkbox,
	Chip,
	Divider,
	IconButton,
	Modal,
	Pagination,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import TransferLeadModalPopup from './transferLeadModalPopup.jsx'
// Global Components
import usePagination from '../../../../components/pagination'
// Local Components
import PartnerLeadDetailFollowUpModal from '../../partnerLeadDetail/components/partnerLeadDetailFollowUpModal.jsx'
import PartnerLeadListingTierModal from './partnerLeadListingTierModal.jsx'
import { tierChipColor } from '../../../../mixins/chipColor'
// Icons
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import PartnerLeadAddPage from '../../partnerLeadAdd/partnerLeadAddPage.jsx'
import DownloadIcon from '@mui/icons-material/Download'
import CallIcon from '@mui/icons-material/Call'
import WifiCalling3Icon from '@mui/icons-material/WifiCalling3'
import { timelineClasses } from '@mui/lab'
//mixin

const getFollowUpColor = (status, dueDateString) => {
	const dueDate = new Date(dueDateString)
	if (status === 'PENDING') {
		const currentDateAndTime = new Date(new Date().getTime() + 330 * 60000)
		return currentDateAndTime < dueDate ? '#fdd835' : '#e57373'
	} else if (status === 'DONE' || status === 'TIME_CHANGED') {
		return '#6ECB63'
	} else {
		return '#64b5f6'
	}
}

export default function PartnerLeadListingComponent({
	tabName,
	matches,
	query,
	paginationData,
	data,
	leadPage,
	handleLeadPageChange,
	transferMultipleLeadsArray,
	handleTransferMultipleLeadsArray,
	fetchData,
}) {
	const location = useLocation()
	const pathName = location.pathname + location.search
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const [open, setOpen] = useState(false)
	const [transferSelectedLeadId, setTransferSelectedLeadId] = useState()
	const [openTransferLeadModal, setOpenTransferLeadModal] = useState(false)
	const [status, setStatus] = useState([])
	const [callingNumber, setCallingNumber] = useState(null)
	const [selectedLeadId, setSelectedLeadId] = useState()
	const [followUpData, setFollowUpData] = useState()
	const [openFollowUpModal, setOpenFollowUpModal] = useState(false)
	const [statusData, setStatusData] = useState()
	const navigate = useNavigate()
	const [openMessageModal, setOpenMessageModal] = useState('')
	const [partnerLeadCSVData, setPartnerLeadCSVData] = useState([])
	const tempIsCheckedArr = []
	for (let i = 0; i < 25; i++) {
		tempIsCheckedArr.push(false)
	}
	const [isCheckedArr, setIsCheckedArr] = useState(tempIsCheckedArr)

	const perPage = paginationData?.per_page
	const pageCount = paginationData?.page_count
	const leadData = usePagination(data, perPage)

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	}

	const handleOpenTransferLeadModal = (id) => {
		setTransferSelectedLeadId(id)
		setOpenTransferLeadModal(true)
	}

	const handleCloseTransferLeadModal = () => setOpenTransferLeadModal(false)

	const handleClose = () => setOpen(false)

	const handleOpenFollowUpModal = (leadId) => {
		setSelectedLeadId(leadId)

		axios
			.get(`sales/leads/doctor-leads/statuses`)
			.then((res) => {
				setStatus(res?.data?.data)
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
		setOpenFollowUpModal(true)
	}

	const [isTierModalOpen, setIsTierModalOpen] = useState(false)
	const [selectedLeadTier, setSelectedLeadTier] = useState(null)
	const handleOpenTierModal = (leadID, leadTier) => {
		setSelectedLeadId(leadID)
		setSelectedLeadTier(leadTier)
		setIsTierModalOpen(true)
	}
	const handleCloseTierModal = () => {
		setIsTierModalOpen(false)
	}

	const handleCloseFollowUpModal = () => setOpenFollowUpModal(false)

	const handleClickStatus = (leadId, statusData) => {
		setSelectedLeadId(leadId)
		setStatusData(statusData)
		axios
			.get(`sales/leads/doctor-leads/statuses`)
			.then((res) => {
				setOpen(true)
				setStatus(res?.data?.data.statuses)
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}

	const handleOpenMessage = (id) => {
		setOpenMessageModal(id)
	}

	const handleCloseMessage = () => {
		setOpenMessageModal('')
	}

	function selectLead(event, leadId, index) {
		const isChecked = event.target.checked
		if (isChecked) {
			handleTransferMultipleLeadsArray([...transferMultipleLeadsArray, leadId])
			//set Is Checked Array
			const tempIsCheckedArr = isCheckedArr
			tempIsCheckedArr[index] = true
			setIsCheckedArr(tempIsCheckedArr)
		} else {
			const removeIndex = transferMultipleLeadsArray.indexOf(leadId)
			if (removeIndex > -1) {
				const tempArr = transferMultipleLeadsArray
				tempArr.splice(removeIndex, 1) //the second parameter means remove one item only
				handleTransferMultipleLeadsArray([...tempArr])
				// set Is Checked Array
				const tempIsCheckedArr = isCheckedArr
				tempIsCheckedArr[index] = false
				setIsCheckedArr(tempIsCheckedArr)
			}
		}
	}

	function selectAllLeads(event) {
		let tempArr = []
		let tempIsCheckedArr = []
		const isChecked = event.target.checked
		if (isChecked) {
			leadData.currentData().forEach((partnerLead) => {
				tempArr.push(partnerLead.id)
				tempIsCheckedArr.push(true)
			})
		} else {
			leadData.currentData().forEach(() => {
				tempIsCheckedArr.push(false)
			})
		}

		setIsCheckedArr(tempIsCheckedArr)
		handleTransferMultipleLeadsArray(tempArr)
	}
	const goToPartnerLeadPage = (leadID) => {
		if (tabName === 'doctor') {
			navigate(`/business-partner/doctor/${leadID}`)
		} else if (tabName === 'sales') {
			navigate(`/business-partner/sales/${leadID}`)
		}
	}

	const handleEdit = (leadID) => {
		navigate(`/business-partner/doctor/${leadID}/edit`)
	}
	// CSV Start
	const headers = {
		id: 'ID',
		name: 'Name',
		phone: 'Phone',
		message: 'Message',
		email_id: 'Email',
		current_status: 'Status',
		lead_tier: 'Tier',
		source: 'Source',
		assigned_to: 'Assigned',
		link_exchange: 'Link Exchanged',
		back_link: 'Backlink',
		iframe: 'Widget',
		specialization: 'Specialization',
		pages_sold: 'Pages',
		listing_duration_from_date: 'From',
		listing_duration_to_date: 'To',
		amount: 'Amount',
		created_at: 'Created At',
	}
	const handleDownloadAsCSV = () => {
		const queryParametersURL =
			user.isAdmin || user.isAuditor ? window.location.search : window.location.search + `&emp_id=${user.userId}`
		setPartnerLeadCSVData([])
		let url
		if (tabName === 'doctor') {
			url = `sales/leads/doctor-leads/csv${queryParametersURL}`
		} else if (tabName === 'sales') {
			url = `sales/leads/partner-leads/csv${queryParametersURL}`
		}
		axios
			.get(url)
			.then((res) => {
				setPartnerLeadCSVData(res.data.data)
			})
			.catch((error) => {
				toast.error(error?.response?.data?.data?.message, {
					position: 'bottom-left',
				})
			})
	}
	useEffect(() => {
		if (partnerLeadCSVData.length > 0) {
			startCSVDownload()
		}
	}, [partnerLeadCSVData])
	const startCSVDownload = () => {
		const partnerLeadsArr = partnerLeadCSVData.map((partnerLead) => ({
			id: partnerLead.id,
			name: partnerLead.name,
			phone: user.isAuditor ? '**********' : partnerLead.phone,
			message: partnerLead.message,
			email_id: user.isAuditor ? '**********' : partnerLead.email_id,
			current_status: partnerLead.current_status,
			lead_tier: partnerLead.lead_tier,
			source: partnerLead.source,
			assigned_to: partnerLead.assigned_to,
			link_exchange: partnerLead.link_exchange,
			back_link: partnerLead.back_link,
			iframe: partnerLead.iframe,
			specialization: partnerLead.specialization.name,
			pages_sold: partnerLead.pages_sold,
			listing_duration_from_date: partnerLead.listing_duration_from_date,
			listing_duration_to_date: partnerLead.listing_duration_to_date,
			amount: partnerLead.amount,
			created_at: partnerLead.created_at,
		}))
		const fileTitle = tabName === 'doctor' ? 'DoctorLeads' : 'PartnerLeads'
		exportCSVFile(headers, partnerLeadsArr, fileTitle)
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

	const makeLeadCall = (phone) => {
		setCallingNumber(phone)
		const payload = {
			phone: phone,
		}
		axios
			.post('sales/leads/knowlarity/make-call', payload)
			.then((res) => {
				console.log(res)
				setTimeout(() => {
					setCallingNumber(null)
				}, 60000)
			})
			.error((err) => {
				console.log(err)
			})
	}
	// CSV End

	//Logs duration
	// function timeToMinutes(time) {
	// 	let parts = time.split(':')
	// 	let hours = parseInt(parts[0], 10)
	// 	let minutes = parseInt(parts[1], 10)
	// 	let seconds = parseInt(parts[2], 10)
	// 	function truncateToTwoDecimals(number) {
	// 		return Math.trunc(number * 100) / 100
	// 	}
	// 	// Convert hours and seconds to minutes
	// 	return `${truncateToTwoDecimals(hours * 60 + minutes + seconds / 60)}`
	// }
	const getDate = (inputDate) => {
		// Create a new Date object from the input string
		const date = new Date(inputDate)
		// Define an array of month names
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		]
		// Extract the day, month, and year from the Date object
		const day = date.getDate()
		const month = monthNames[date.getMonth()]
		const year = date.getFullYear()
		// Combine them into the desired format
		const outputDate = `${day} ${month} ${year}`
		return outputDate
	}
	const getTime = (inputTime) => {
		// Split the input time into hours, minutes, and seconds
		const [hours, minutes] = inputTime.split(':').map(Number)
		// Determine if it's AM or PM
		const period = hours >= 12 ? 'PM' : 'AM'
		// Convert hours to 12-hour format
		const hours12 = hours % 12 || 12 // '0' hours should be treated as '12'
		// Combine them into the desired format
		const outputTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
		// Output the result
		return outputTime
	}
	const showCallSection = () => {
		// * This is a temporary function, until the call button is displayed to everyone.
		return user.isAdmin || [90, 66, 91].includes(user.userId)
	}
	return (
		<>
			<Box sx={{ width: '100%', overflow: 'hidden' }}>
				<Divider sx={{ marginTop: 2, marginBottom: 1 }} />
				<Box display="flex" justifyContent="space-between">
					<Typography m={2}>Leads: {paginationData.total}</Typography>
					{isAllowed('get_doctor_leads_csv') && user.userId !== 82 && (
						<Tooltip arrow title="Export as CSV">
							<IconButton color="success" size="large" onClick={handleDownloadAsCSV}>
								<DownloadIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
				<Divider sx={{ marginTop: 1, marginBottom: 2 }} />
				<TableContainer sx={{ maxHeight: 500 }}>
					<Table stickyHeader aria-label="Table">
						<TableHead>
							<TableRow>
								{(user.isAdmin || user.isAuditor) && (
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
										<Checkbox onClick={(event) => selectAllLeads(event)} />
									</TableCell>
								)}
								<TableCell
									sx={{
										fontWeight: 'bold',
										whiteSpace: matches ? 'nowrap' : '',
										position: 'sticky',
										left: -1,
										background: 'white',
										boxShadow: '0px 0px 5px #D8D8D8',
										zIndex: 3,
									}}>
									Name
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Contact</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Message</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Status</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tier</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Source</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Assigned</TableCell>
								{/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Category</TableCell> */}
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Created At</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Lead ID</TableCell>
								{showCallSection() && (
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'center' }}>
										Last Call Details
									</TableCell>
								)}
								{(isAllowed('view_doctor') || isAllowed('edit_doctor')) && (
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} align="center">
										Actions
									</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{leadData.currentData().map((partnerLead, index) => {
								return (
									<TableRow key={partnerLead.id}>
										{/* Checkbox */}
										{(user.isAdmin || user.isAuditor) && (
											<TableCell
												sx={{
													whiteSpace: matches ? 'nowrap' : '',
												}}>
												<Checkbox
													onClick={(event) => selectLead(event, partnerLead.id, index)}
													checked={isCheckedArr[index]}
												/>
											</TableCell>
										)}
										{/* Patient Name */}
										<TableCell
											sx={{
												whiteSpace: matches ? 'nowrap' : '',
												position: 'sticky',
												left: -1,
												background: 'white',
												boxShadow: '0px 0px 5px #D8D8D8',
												zIndex: 1,
												cursor: isAllowed('view_doctor') ? 'pointer' : '',
											}}
											onClick={
												isAllowed('view_doctor')
													? () => {
															goToPartnerLeadPage(partnerLead.id)
													  }
													: ''
											}>
											<Box display="flex" alignItems="center">
												<Typography>{partnerLead.name}</Typography>
											</Box>
										</TableCell>
										{/* Contact */}
										<TableCell>
											<Typography variant="body2" align="center">
												{!(partnerLead.phone === 'NaN') ? (
													<a
														href={!user.isAuditor && partnerLead?.phone ? `tel:${partnerLead.phone}` : null}
														target="_blank"
														rel="noreferrer"
														style={{ textDecoration: 'none' }}>
														{user.isAuditor ? `${partnerLead.phone.slice(0, 3)}*******` : partnerLead.phone}
													</a>
												) : (
													'----'
												)}
											</Typography>
										</TableCell>
										{/* Message */}
										<TableCell
											style={{
												whiteSpace: 'nowrap',
												cursor: 'pointer',
											}}
											onClick={() => {
												if (partnerLead?.message && partnerLead?.message !== null) {
													handleOpenMessage(partnerLead.id)
												}
											}}>
											<Box sx={{ width: 200 }}>
												<Typography noWrap sx={{ whiteSpace: 'normal' }}>
													{partnerLead?.message && partnerLead?.message !== null
														? partnerLead.message.length > 250
															? `${partnerLead.message.slice(0, 250)}...`
															: `${partnerLead.message}`
														: '----'}
												</Typography>
											</Box>
										</TableCell>
										{/* Message Modal Start */}
										<Modal open={partnerLead.id === openMessageModal} onClose={handleCloseMessage}>
											<Box sx={style}>
												<Typography
													id="modal-modal-title"
													variant="h6"
													component="h2"
													style={{
														display: 'flex',
														justifyContent: 'center',
														marginBottom: '20px',
													}}>
													Message
												</Typography>
												<div
													style={{
														margin: 'auto',
														maxWidth: '80vw',
														maxHeight: '80vh',
														overflow: 'auto',
														backgroundColor: 'white',
														padding: '16px',
													}}>
													{partnerLead.message}
												</div>
											</Box>
										</Modal>
										{/* Status */}
										<TableCell>
											<Chip
												label={partnerLead.current_status}
												sx={{
													bgcolor: '#37C0B2',
													color: '#FFFFFF',
													borderRadius: '20px',
													height: '22px',
												}}
												onClick={
													isAllowed('add_doctor_followup')
														? () => {
																handleOpenFollowUpModal(partnerLead.id)
														  }
														: ''
												}
											/>
										</TableCell>
										{/* Tier */}
										<TableCell>
											<Chip
												sx={{
													bgcolor: tierChipColor(partnerLead.lead_tier),
													color: '#FFFFFF',
													borderRadius: '20px',
													height: '22px',
												}}
												label={partnerLead.lead_tier}
												onClick={() => {
													handleOpenTierModal(partnerLead.id, partnerLead.lead_tier)
												}}
											/>
										</TableCell>
										{/* Source */}
										<TableCell sx={{ textAlign: 'center' }}>
											<Box>{partnerLead.source ? partnerLead.source.replace(/_/g, ' ') : '----'}</Box>
										</TableCell>
										{/* Assigned */}
										<TableCell sx={{ textAlign: 'center' }}>
											{partnerLead.assigned_to ? partnerLead.assigned_to : '----'}
										</TableCell>
										{/* Created at */}
										<TableCell>
											{partnerLead?.created_at ? (
												<Chip
													sx={{
														bgcolor: '#9685CE',
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													label={partnerLead?.created_at}
												/>
											) : (
												'----'
											)}
										</TableCell>
										{/* Lead ID */}
										<TableCell>
											<Chip
												label={`#${partnerLead.id}`}
												sx={{
													bgcolor: '#78909C',
													color: '#FFFFFF',
													borderRadius: '20px',
													height: '22px',
												}}
											/>
										</TableCell>
										{/* Last Call Information */}
										{showCallSection() && (
											<TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
												{partnerLead.call_logs?.meta_data ? (
													<>
														<Box sx={{ marginBottom: 1 }}>
															<Box>
																<p
																	style={{
																		color:
																			partnerLead.call_logs.meta_data.call_status === 'Connected'
																				? 'green'
																				: partnerLead.call_logs.meta_data.call_status ===
																				  'Not Connected'
																				? '#f97316'
																				: partnerLead.call_logs.meta_data.call_status === 'Missed'
																				? 'red'
																				: '',
																		marginRight: 4,
																	}}>
																	{partnerLead.call_logs.meta_data.call_status} -{' '}
																	{partnerLead.call_logs.meta_data.call_duration}
																</p>
																{`${getDate(partnerLead.call_logs.meta_data.call_date)} ${getTime(
																	partnerLead.call_logs.meta_data.call_time
																)}`}
															</Box>
														</Box>
													</>
												) : (
													'----'
												)}
											</TableCell>
										)}
										{/* Actions */}
										<TableCell>
											<Box display="flex" justifyContent="center">
												{((user.type.is_mt && isAllowed('transfer_doctor_lead')) || user.isAdmin) && (
													<Tooltip arrow title="Transfer Lead">
														<IconButton
															onClick={() => {
																handleOpenTransferLeadModal(partnerLead.id)
															}}>
															<SwapHorizOutlinedIcon />
														</IconButton>
													</Tooltip>
												)}
												{isAllowed('view_doctor') && (
													<Tooltip arrow title="View Partner Detail">
														<IconButton
															onClick={() => {
																goToPartnerLeadPage(partnerLead.id)
															}}>
															<VisibilityIcon />
														</IconButton>
													</Tooltip>
												)}

												{isAllowed('edit_doctor') && (
													<Tooltip arrow title="Edit Partner Detail">
														<IconButton
															onClick={() => {
																handleEdit(partnerLead.id)
															}}>
															<EditIcon />
														</IconButton>
													</Tooltip>
												)}

												{showCallSection(partnerLead.phone) && (
													<Tooltip arrow title="Call">
														<IconButton
															onClick={() => {
																makeLeadCall(partnerLead.phone)
															}}>
															{partnerLead.phone === callingNumber ? <WifiCalling3Icon /> : <CallIcon />}
														</IconButton>
													</Tooltip>
												)}
											</Box>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<PartnerLeadDetailFollowUpModal
					type={tabName}
					selectedLeadId={selectedLeadId}
					status={status}
					open={openFollowUpModal}
					onClose={() => {
						handleCloseFollowUpModal()
					}}
				/>
				<PartnerLeadListingTierModal
					key={selectedLeadTier}
					open={isTierModalOpen}
					onClose={handleCloseTierModal}
					leadID={selectedLeadId}
					leadTier={selectedLeadTier}
					tabName={tabName}
					fetchData={fetchData}
				/>
				<TransferLeadModalPopup
					transferSelectedLeadId={transferSelectedLeadId}
					open={openTransferLeadModal}
					onClose={() => {
						handleCloseTransferLeadModal()
					}}
				/>
			</Box>

			{/* Pagination */}
			<Box display="flex" justifyContent="center" my={2}>
				<Pagination count={pageCount} color="primary" page={leadPage} onChange={handleLeadPageChange} shape="rounded" />
			</Box>
		</>
	)
}

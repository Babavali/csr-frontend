/* eslint-disable  no-unused-vars */
// React
import { useEffect, useState, useTransition } from 'react'
// Packages
import { useNavigate } from 'react-router-dom'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
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
	useMediaQuery,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	Button,
	Link,
} from '@mui/material'
// MUI Icons
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DownloadIcon from '@mui/icons-material/Download'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
// Global Components
import usePagination from '../../../../components/pagination'
// Local Components
import TransferLeadModalPopup from './transferLeadModalPopup'
import FollowUpModalPopup from './followUpModalPopup'
import StatusModalPopUp from './statusModalPopUp'
import { tierChipColor } from '../../../../mixins/chipColor'
import { useLocation } from 'react-router-dom'

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

export default function LeadListingComponent({
	handleClearFilter,
	handleDeleteFilterChip,
	query,
	tabName,
	paginationData,
	data,
	leadPage,
	handleLeadPageChange,
	transferMultipleLeadsArray,
	handleTransferMultipleLeadsArray,
	selectedSalesEmpId,
}) {
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const location = useLocation()
	const pathName = location.pathname
	const pathNameQuery = location.search
	const filterChips = useSelector((state) => state.filter)
	const matches = useMediaQuery('(min-width: 600px)')
	const [open, setOpen] = useState(false)
	const [transferSelectedLeadId, setTransferSelectedLeadId] = useState()
	const [openTransferLeadModal, setOpenTransferLeadModal] = useState(false)
	const [status, setStatus] = useState([])
	const [selectedLeadId, setSelectedLeadId] = useState()
	const [followUpData, setFollowUpData] = useState()
	const [openFollowUpModal, setOpenFollowUpModal] = useState(false)
	const [statusData, setStatusData] = useState()
	const [leadDownloadData, setLeadDownloadData] = useState([])
	const navigate = useNavigate()
	const [openMessageModal, setOpenMessageModal] = useState('')
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

	const handleCloseFollowUpModal = () => {
		setOpenFollowUpModal(false)
	}

	const handleClickStatus = (leadId, statusData) => {
		setSelectedLeadId(leadId)
		setStatusData(statusData)
		axios
			.get(`sales/leads/${leadId}/statuses`)
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
			leadData.currentData().forEach((patientCard) => {
				tempArr.push(patientCard.additional_information?.lead_id)
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

	const headers = {
		id: 'Lead ID',
		enquirer_name: 'Enquirer Name',
		enquirer_email: 'Enquirer Email',
		enquirer_phone: 'Enquirer Phone',
		category: 'Category',
		specialization: 'Specialization',
		service: 'Service',
		city: 'City',
		country: 'Country',
		message: 'Message',
		lead_source: 'Lead Source',
		page_title: 'Page Title',
		assigned_to: 'Assigned To',
		status: 'Status',
		tier: 'Tier',
		transfer: 'Transfer',
		created_at: 'Created At',
		modified_at: 'Modified At',
		remark: 'Remark',
		video_call_count: 'Video Call Count',
		is_shared: 'Shared',
		shared_by: 'Shared By',
		shared_to: 'Shared To',
		parent_id: 'Parent Lead ID',
	}
	const handleDownloadAsCSV = async () => {
		const fullURL = window.location.href
		const employeeQuery =
			user.isAdmin || user.isAuditor ? (selectedSalesEmpId ? `&emp_id=${selectedSalesEmpId}` : '') : `&emp_id=${user.userId}`
		const queryParametersURL = `?${fullURL.split('?')[1]}${employeeQuery}`
		setLeadDownloadData([])
		const url = `sales/leads/csv${queryParametersURL ? queryParametersURL : ''}`
		await axios
			.get(`${url}`)
			.then((res) => {
				setLeadDownloadData(res.data.data)
			})
			.catch((error) => {
				toast.error(error?.response?.data?.data?.message, {
					position: 'bottom-left',
				})
			})
	}
	const startCSVDownload = () => {
		const leadArr = []
		leadDownloadData.forEach((data) => {
			const tempObj = {
				id: data.id,
				enquirer_name: data.enquirer_name ? data.enquirer_name : null,
				enquirer_email: user.userId === 72 || user.isAuditor ? '************' : data.enquirer_email || null,
				enquirer_phone: user.userId === 72 || user.isAuditor ? '************' : data.enquirer_phone || null,
				category: data.category ? data.category : null,
				specialization: data.specialization ? data.specialization : null,
				service: data.service ? data.service : null,
				city: data.city ? data.city : null,
				country: data.country ? data.country : null,
				message: data.message ? data.message : null,
				lead_source: data.lead_source ? data.lead_source : null,
				page_title: data.page_title ? data.page_title : null,
				assigned_to: data.assigned_to ? data.assigned_to : null,
				status: data.status ? data.status : null,
				tier: data.tier ? data.tier : null,
				transfer: data.transfer ? data.transfer : null,
				created_at: data.created_at ? data.created_at : null,
				modified_at: data.modified_at ? data.modified_at : null,
				remark: data.remark ? data.remark : null,
				video_call_count: data.video_call_count ? data.video_call_count : null,
				is_shared: data.is_shared ? data.is_shared : null,
				shared_by: data?.shared_by,
				shared_to: data?.shared_to,
				parent_id: data.parent_id ? data.parent_id : null,
			}
			leadArr.push(tempObj)
		})
		var fileTitle = `LeadCSV1`
		exportCSVFile(headers, leadArr, fileTitle)
	}
	useEffect(() => {
		if (leadDownloadData.length > 0) {
			startCSVDownload()
		}
	}, [leadDownloadData])
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

	const showAction = () => {
		if ((!user.isAuditor && isAllowed('transfer_lead')) || isAllowed('view_partner') || isAllowed('edit_partner')) {
			return true
		} else return false
	}

	return (
		<>
			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<Divider sx={{ marginTop: 2 }} />
				<Box m={1} display="flex" justifyContent="space-between" alignItems="center">
					<Typography sx={{ my: 1 }}>Leads: {paginationData.total}</Typography>
					{isAllowed('get_partner_leads_csv') && user.userId !== 82 && (
						<Tooltip arrow title="Export as CSV">
							<IconButton color="success" size="large" onClick={handleDownloadAsCSV}>
								<DownloadIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
				<Divider sx={{ marginBottom: 2 }} />

				<TableContainer sx={{ maxWidth: '96vw', margin: 'auto' }}>
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
										whiteSpace: 'nowrap',
										position: 'sticky',
										left: -1,
										background: 'white',
										boxShadow: '0px 0px 5px #D8D8D8',
										zIndex: 3,
									}}>
									Patient Name
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Lead ID</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Country</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Contact</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Message</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Status</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Source</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Follow up</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Category</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Specialization</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Service</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Assigned To</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Created At</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Modified At</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tier</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Share Status</TableCell>
								{showAction() && (
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} align="center">
										Actions
									</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{leadData.currentData().map((patientCard, index) => {
								return (
									<TableRow key={patientCard.additional_information.lead_id}>
										{/* Checkbox */}
										{(user.isAdmin || user.isAuditor) && (
											<TableCell
												sx={{
													whiteSpace: matches ? 'nowrap' : '',
												}}>
												<Checkbox
													onClick={(event) =>
														selectLead(event, patientCard.additional_information?.lead_id, index)
													}
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
												cursor: isAllowed('view_partner') ? 'pointer' : '',
											}}
											onClick={
												isAllowed('view_partner')
													? () => {
															window.open(`/lead/${patientCard.additional_information?.lead_id}`)
													  }
													: ''
											}>
											{patientCard.patient.name}
											{(patientCard.patient.age || patientCard.patient.gender) && (
												<Typography variant="subtitle2">
													{patientCard.patient.gender ? patientCard.patient.gender : ''}
													&nbsp;
													{patientCard.patient.gender && patientCard.patient.age ? '|' : ''}
													&nbsp;
													{patientCard.patient.age && patientCard.patient.age > 0 ? patientCard.patient.age : ''}
												</Typography>
											)}
											{patientCard.is_shared === 'true' && (
												<Box sx={{ marginY: '4px' }}>
													<Chip label="Shared" variant="outlined" size="small" color="primary" />
												</Box>
											)}
										</TableCell>

										{/* Lead ID */}
										<TableCell>
											<Chip
												label={`#${patientCard.additional_information?.lead_id}`}
												sx={{
													bgcolor: '#78909C',
													color: '#FFFFFF',
													borderRadius: '20px',
													height: '22px',
												}}
											/>
										</TableCell>

										{/* Country */}
										<TableCell
											sx={{
												whiteSpace: 'nowrap',
											}}>
											<Typography>
												{patientCard.enquirer?.country?.name ? patientCard.enquirer.country.name : '----'}
											</Typography>
										</TableCell>
										{/* Contact */}
										<TableCell>
											{user.isAuditor ? (
												<Typography variant="body2">
													{patientCard.enquirer.phone
														? `${patientCard.enquirer.phone.slice(0, 5)}********`
														: null}
												</Typography>
											) : (
												<Typography variant="body2">
													<a
														href={`tel:${patientCard.enquirer.phone}`}
														target="_blank"
														rel="noreferrer"
														style={{ textDecoration: 'none' }}>
														{patientCard.enquirer.phone}
													</a>
													<a
														href={`mailto:${patientCard.enquirer.email}`}
														target="_blank"
														rel="noreferrer"
														style={{ textDecoration: 'none', display: 'block' }}>
														{patientCard.enquirer.email}
													</a>
												</Typography>
											)}
										</TableCell>
										{/* Message */}
										<TableCell
											style={{
												whiteSpace: 'nowrap',
												cursor: 'pointer',
											}}
											onClick={() => {
												if (patientCard?.additional_information?.message !== null) {
													handleOpenMessage(patientCard.additional_information.lead_id)
												}
											}}>
											<Box sx={{ width: 200 }}>
												<Typography noWrap sx={{ whiteSpace: 'normal' }}>
													{patientCard?.additional_information?.message !== null
														? patientCard.additional_information?.message?.length > 250
															? `${patientCard.additional_information?.message.slice(0, 250)}...`
															: `${patientCard.additional_information?.message}`
														: '----'}
												</Typography>
											</Box>
										</TableCell>
										{/* Message Modal Start */}
										<Modal
											open={patientCard.additional_information.lead_id === openMessageModal}
											onClose={handleCloseMessage}>
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
													{patientCard.additional_information.message}
												</div>
											</Box>
										</Modal>
										{/* Message Modal End */}

										{/* Status */}
										<TableCell>
											{patientCard.additional_information.status.current_status && (
												<Box class="flex">
													<Chip
														clickable={!user.isAuditor && isAllowed('add_partner_followup')}
														sx={{
															bgcolor: '#37C0B2',
															color: '#FFFFFF',
															borderRadius: '20px',
															height: '22px',
														}}
														onClick={
															!user.isAuditor && isAllowed('add_partner_followup')
																? () => {
																		handleOpenFollowUpModal(
																			patientCard.additional_information.lead_id,
																			patientCard?.followup_reminder,
																			patientCard.additional_information.status
																		)
																  }
																: ''
														}
														label={
															<Box display="flex" alignItems="center" justifyContent="space-between">
																{patientCard.additional_information.status.current_status === 'INVALID' &&
																	tabName === 'working' && <HourglassTopIcon fontSize="small" />}
																{patientCard.additional_information.status.current_status?.replace(
																	/_/g,
																	' '
																) +
																	(patientCard.additional_information.status.sub_status
																		? `, ${patientCard.additional_information.status.sub_status.replace(
																				/_/g,
																				' '
																		  )}`
																		: '')}
															</Box>
														}
													/>
												</Box>
											)}
										</TableCell>

										{/* Source */}
										<TableCell>
											<Box sx={{ whiteSpace: 'normal' }}>
												<Typography display="inline" fontWeight="bold">
													{patientCard?.additional_information?.lead_source?.replace(/_/g, ' ')}
												</Typography>
												{patientCard?.additional_information?.page_title && (
													<Typography display="inline">
														{` - (${patientCard?.additional_information?.page_title})`}
													</Typography>
												)}
											</Box>
										</TableCell>

										{/* Follow Up */}
										<TableCell>
											<Chip
												clickable={!user.isAuditor && isAllowed('add_partner_followup')}
												sx={{
													bgcolor: getFollowUpColor(
														patientCard?.followup_reminder?.status,
														patientCard?.followup_reminder?.timestamp
													),
													color: '#FFFFFF',
													borderRadius: '20px',
													height: '22px',
												}}
												onClick={() => {
													!user.isAuditor && isAllowed('add_partner_followup')
														? handleOpenFollowUpModal(
																patientCard.additional_information.lead_id,
																patientCard?.followup_reminder,
																patientCard.additional_information.status
														  )
														: ''
												}}
												label={
													<Box
														style={{
															display: 'flex',
															justifyContent: 'space-between',
														}}>
														<AccessTimeIcon fontSize="small" />
														<Typography
															style={{
																fontSize: '14px',
																fontWeight: '500',
																marginLeft: '4px',
															}}>
															{patientCard.followup_reminder.timestamp
																? patientCard.followup_reminder.display_time
																: 'Add estimation'}
														</Typography>
													</Box>
												}></Chip>
										</TableCell>

										{/* Category */}
										<TableCell>
											{patientCard.additional_information.category.name ? (
												<Chip
													sx={{
														bgcolor: '#6574C4',
														borderRadius: '20px',
														height: '22px',
														color: '#FFFFFF',
													}}
													label={patientCard.additional_information.category.name}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Specialization */}
										<TableCell>
											{patientCard.additional_information.specialization.name ? (
												<Chip
													sx={{
														bgcolor: '#6574C4',
														borderRadius: '20px',
														height: '22px',
														color: '#FFFFFF',
													}}
													label={patientCard.additional_information.specialization.name}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Service */}
										<TableCell>
											{patientCard.additional_information.service.name ? (
												<Chip
													sx={{
														bgcolor: '#6574C4',
														borderRadius: '20px',
														height: '22px',
														color: '#FFFFFF',
													}}
													label={patientCard.additional_information.service.name}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Assigned To */}
										<TableCell
											sx={{
												whiteSpace: 'nowrap',
											}}>
											{patientCard.additional_information.assigned_to ? (
												<Typography>{patientCard.additional_information.assigned_to}</Typography>
											) : (
												'----'
											)}
										</TableCell>

										{/* Created at */}
										<TableCell>
											{patientCard?.additional_information?.created_at ? (
												<Chip
													sx={{
														bgcolor: '#9685CE',
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													label={patientCard?.additional_information?.created_at}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Modified at */}
										<TableCell>
											{patientCard?.additional_information?.updated_at ? (
												<Chip
													sx={{
														bgcolor: '#9685CE',
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													label={patientCard?.additional_information?.updated_at}
												/>
											) : (
												'----'
											)}
										</TableCell>

										{/* Tier */}
										<TableCell>
											{patientCard?.additional_information?.tier && (
												<Chip
													sx={{
														bgcolor: tierChipColor(patientCard?.additional_information?.tier),
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													label={patientCard?.additional_information?.tier}
												/>
											)}
										</TableCell>

										{/* Share Status */}
										<TableCell>
											<Box display="flex" justifyContent="center">
												{patientCard.shared_to ? (
													<Box display="flex" justifyContent="center" alignItems="center">
														{patientCard?.shared_by}
														<ArrowRightAltIcon sx={{ marginX: 2 }} />
														{patientCard?.shared_to}
													</Box>
												) : (
													'----'
												)}
											</Box>
										</TableCell>

										{/* Actions */}
										<TableCell>
											<Box display="flex">
												{(user.type.is_mt || user.isAdmin) && isAllowed('transfer_lead') && (
													<Tooltip arrow title="Transfer Lead">
														<IconButton
															onClick={() => {
																handleOpenTransferLeadModal(patientCard.additional_information.lead_id)
															}}>
															<SwapHorizOutlinedIcon />
														</IconButton>
													</Tooltip>
												)}
												{isAllowed('view_partner') && (
													<Tooltip arrow title="View Patient Detail">
														<IconButton
															onClick={() => {
																navigate(`/lead/${patientCard.additional_information?.lead_id}`)
															}}>
															<VisibilityIcon />
														</IconButton>
													</Tooltip>
												)}
												{!user.isAuditor && isAllowed('edit_partner') && (
													<Tooltip arrow title="Edit Patient Detail">
														<IconButton
															onClick={() => {
																navigate(`/lead/${patientCard.additional_information?.lead_id}/edit`)
															}}>
															<EditIcon />
														</IconButton>
													</Tooltip>
												)}
											</Box>
										</TableCell>
										{patientCard.additional_information.lead_id === selectedLeadId ? (
											<FollowUpModalPopup
												selectedLeadId={selectedLeadId}
												open={openFollowUpModal}
												actualInvoice={patientCard.actual_invoice}
												arrivalAt={patientCard.arrival_at}
												estimatedInvoice={patientCard.estimated_invoice}
												fieldPersonName={patientCard.field_person_name}
												hotelName={patientCard.hotel_name}
												passportNumber={patientCard.passport_number}
												registrationNumber={patientCard.registration_number}
												visaExpiryAt={patientCard.visa_expiry_at}
												hotelType={patientCard.hotel_type}
												arrivalType={patientCard.arrival_type}
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
										) : (
											''
										)}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			{/* Modals*/}
			<Box>
				<StatusModalPopUp
					open={open}
					handleClose={handleClose}
					selectedLeadId={selectedLeadId}
					statusData={statusData}
					// Follow Up Data
					followUpData={followUpData}
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

/* eslint-disable no-unused-vars */
// React
import { useState } from 'react'
// Packages
import { useNavigate } from 'react-router-dom'
import axios from '../../../shared/axios'
import { toast } from 'react-toastify'
// MUI Components
import {
	Box,
	Button,
	Checkbox,
	Chip,
	IconButton,
	Link,
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
// MUI Icons
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DeleteIcon from '@mui/icons-material/Delete'
// Global Components
import usePagination from '../../../components/pagination'
// Local Components
// import TransferLeadModalPopup from '../containers/leads/myLeads/components/transferLeadModalPopup'
// import FollowUpModalPopup from '../containers/leads/myLeads/components/followUpModalPopup'
// import StatusModalPopUp from '../containers/leads/myLeads/components/statusModalPopUp'
// Images
// import TransferLead from '../../../assets/transferlead.svg'

const getColor = (status, dueDateString) => {
	const dueDate = new Date(dueDateString)
	switch (status) {
		case 'PENDING': {
			const currentDateAndTime = new Date(new Date().getTime() + 330 * 60000)
			return currentDateAndTime < dueDate ? '#fdd835' : '#e57373'
		}
		case 'DONE':
			return '#6ECB63'
		default:
			return '#64b5f6'
	}
}

export default function PendingApprovalListing({
	matches,
	query,
	paginationData,
	data,
	leadPage,
	handleLeadPageChange,
	transferMultipleLeadsArray,
	handleTransferMultipleLeadsArray,
}) {
	const navigate = useNavigate()
	const [openMessageModal, setOpenMessageModal] = useState('')
	const [openRemarkModal, setOpenRemarkModal] = useState('')
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

	const redirectHandler = (path, optionalArguments) => {
		navigate(path, optionalArguments)
	}

	// Message Modal
	const handleOpenMessage = (id) => {
		setOpenMessageModal(id)
	}
	const handleCloseMessage = () => {
		setOpenMessageModal('')
	}

	// Last Remark Modal
	const handleOpenRemark = (id) => {
		setOpenRemarkModal(id)
	}
	const handleCloseRemark = () => {
		setOpenRemarkModal('')
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
	function handleSendApproveRequest(lead_id) {
		axios
			.put(`/sales/leads/${lead_id}/approve-status`)
			.then(() => {
				toast.success('Saved successfully', {
					position: 'bottom-left',
				})
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	function handleSendDeleteRequest(lead_id) {
		if (confirm('Are you sure you want to delete this?')) {
			axios
				.delete(`/sales/leads/${lead_id}`)
				.then(() => {
					toast.success('Deleted successfully', {
						position: 'bottom-left',
					})
					setTimeout(() => {
						window.location.reload()
					}, 2000)
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		}
	}

	return (
		<>
			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<TableContainer sx={{ maxWidth: '96vw', margin: 'auto' }}>
					<Table stickyHeader aria-label="Table">
						<TableHead>
							<TableRow>
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
									Patient Name
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Country</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Last Remark</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Message</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Source</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Status</TableCell>
								{/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Follow up</TableCell> */}
								{/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Category</TableCell> */}
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Assigned To</TableCell>
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Modified At</TableCell>
								{/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Contact</TableCell> */}
								<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Lead ID</TableCell>
								{/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tier</TableCell> */}
								{/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} align="center">
									Actions
								</TableCell> */}
								<TableCell sx={{ fontWeight: 'bold' }} align="center">
									Approve
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} align="center">
									Delete
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{leadData.currentData().map((patientCard) => {
								return (
									<TableRow key={patientCard.additional_information.lead_id}>
										{/* Patient Name */}
										<TableCell
											sx={{
												whiteSpace: matches ? 'nowrap' : '',
												position: 'sticky',
												left: -1,
												background: 'white',
												boxShadow: '0px 0px 5px #D8D8D8',
												zIndex: 1,
											}}>
											<Link
												href={`/lead/${patientCard.additional_information?.lead_id}`}
												variant="body1"
												color="inherit"
												underline="none">
												{patientCard.patient.name}
											</Link>
											{(patientCard.patient.age || patientCard.patient.gender) && (
												<Typography variant="subtitle2">
													{patientCard.patient.gender ? patientCard.patient.gender : ''}
													&nbsp;
													{patientCard.patient.gender && patientCard.patient.age ? '|' : ''}
													&nbsp;
													{patientCard.patient.age && patientCard.patient.age > 0 ? patientCard.patient.age : ''}
												</Typography>
											)}
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

										{/* Last Remark */}
										<TableCell
											style={{
												whiteSpace: 'nowrap',
												cursor: 'pointer',
											}}
											onClick={() => {
												handleOpenRemark(patientCard.additional_information.lead_id)
											}}>
											<Box sx={{ width: 200, whiteSpace: 'normal' }}>
												{patientCard.additional_information.remark
													? patientCard.additional_information.remark.length > 250
														? `${patientCard.additional_information.remark.slice(0, 250)}...`
														: `${patientCard.additional_information.remark}`
													: '----'}
											</Box>
										</TableCell>
										{/* Remark Modal Start */}
										<Modal
											open={patientCard.additional_information.lead_id === openRemarkModal}
											onClose={handleCloseRemark}>
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
													Remark
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
													{patientCard?.additional_information?.remark
														? patientCard.additional_information.remark
														: '----'}
												</div>
											</Box>
										</Modal>
										{/* Message Modal End */}

										{/* Message */}
										<TableCell
											style={{
												whiteSpace: 'nowrap',
												cursor: 'pointer',
											}}
											onClick={() => {
												handleOpenMessage(patientCard.additional_information.lead_id)
											}}>
											<Box sx={{ width: 200, whiteSpace: 'normal' }}>
												{patientCard.additional_information.message !== null
													? patientCard.additional_information.message &&
													  patientCard.additional_information.message.length > 250
														? `${patientCard.additional_information.message.slice(0, 250)}...`
														: `${patientCard.additional_information.message}`
													: '----'}
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

										{/* Source */}
										<TableCell>
											<Box sx={{ width: 150, whiteSpace: 'normal' }}>
												<Typography display="inline" fontWeight="bold">
													{patientCard?.additional_information?.lead_source.replace(/_/g, ' ')}
												</Typography>
												{patientCard?.additional_information?.page_title && (
													<Typography display="inline">
														{` - (${patientCard?.additional_information?.page_title})`}
													</Typography>
												)}
											</Box>
										</TableCell>

										{/* Status */}
										<TableCell>
											{patientCard.additional_information.status.current_status && (
												<Chip
													sx={{
														bgcolor: '#37C0B2',
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													label={
														patientCard.additional_information.status.current_status?.replace(/_/g, ' ') +
														(patientCard.additional_information.status.sub_status
															? `, ${patientCard.additional_information.status.sub_status.replace(/_/g, ' ')}`
															: '')
													}
												/>
											)}
										</TableCell>

										{/* Category */}
										{/* <TableCell>
											{patientCard.additional_information.category.name && (
												<Chip
													sx={{
														bgcolor: '#6574C4',
														borderRadius: '20px',
														height: '22px',
														color: '#FFFFFF',
													}}
													label={patientCard.additional_information.category.name}
												/>
											)}
										</TableCell> */}

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

										{/* Contact */}
										{/* <TableCell>
											<Typography variant="body2">
												<a
													href={`tel:${patientCard.enquirer.phone}`}
													target="_blank"
													rel="noreferrer"
													style={{ textDecoration: 'none' }}>
													{patientCard.enquirer.phone}
												</a>
											</Typography>
											<Typography variant="body2">
												<a
													href={`mailto:${patientCard.enquirer.email}`}
													target="_blank"
													rel="noreferrer"
													style={{ textDecoration: 'none' }}>
													{patientCard.enquirer.email}
												</a>
											</Typography>
										</TableCell> */}

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
										{/* Tier */}
										{/* <TableCell>
											{patientCard?.additional_information?.tier && (
												<Chip
													sx={{
														bgcolor: '#FF9848',
														color: '#FFFFFF',
														borderRadius: '20px',
														height: '22px',
													}}
													label={patientCard?.additional_information?.tier}
												/>
											)}
										</TableCell> */}

										{/* Actions */}
										{/* <TableCell>
											<Box display="flex">
												<Tooltip arrow title="View Patient Detail">
													<IconButton
														onClick={() => {
															redirectHandler(`/lead/${patientCard.additional_information?.lead_id}?${query}`)
														}}>
														<VisibilityIcon />
													</IconButton>
												</Tooltip>
												<Tooltip arrow title="Edit Patient Detail">
													<IconButton
														onClick={() => {
															redirectHandler(
																`/lead/${patientCard.additional_information?.lead_id}/edit?${query}`
															)
														}}>
														<EditIcon />
													</IconButton>
												</Tooltip>
											</Box>
										</TableCell> */}

										{/* Approve */}
										<TableCell>
											<Button
												variant="contained"
												color="error"
												onClick={() => handleSendApproveRequest(patientCard.additional_information?.lead_id)}>
												Approve
											</Button>
										</TableCell>

										{/* Delete */}
										<TableCell>
											<IconButton
												color="error"
												size="large"
												onClick={() => handleSendDeleteRequest(patientCard.additional_information?.lead_id)}>
												<DeleteIcon fontSize="large" />
											</IconButton>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			{/* Pagination */}
			<Box display="flex" justifyContent="center" my={2}>
				<Pagination count={pageCount} color="primary" page={leadPage} onChange={handleLeadPageChange} shape="rounded" />
			</Box>
		</>
	)
}

/* eslint-disable no-unused-vars*/
import { useState } from 'react'
// Packages
import { useNavigate } from 'react-router-dom'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
// MUI Components
import { Box, Button, Chip, IconButton, Tooltip, Typography, Table, TableHead, TableRow, TableBody, Grid } from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
// MUI Icons
import PersonIcon from '@mui/icons-material/Person'
import UpdateIcon from '@mui/icons-material/Update'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import ShareIcon from '@mui/icons-material/Share'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import EditIcon from '@mui/icons-material/Edit'
// Leads Components
import FollowUpModalPopup from '../../myLeads/components/followUpModalPopup'
import TransferLeadModalPopup from '../../myLeads/components/transferLeadModalPopup'
import ShareLeadModal from '../../myLeads/components/shareLeadModal'
import VideoCallLogsModal from '../../myLeads/components/videoCallLogsModal'

export default function PreviewLeadSummary(props) {
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const matches = props.matches
	const navigate = useNavigate()
	const redirectHandler = (path, optionalArguments) => {
		navigate(path, optionalArguments)
	}
	// useState
	const [openFollowUpModal, setOpenFollowUpModal] = useState(false)
	const [openTransferLeadModal, setOpenTransferLeadModal] = useState(false)
	const [openShareLeadModal, setOpenShareLeadModal] = useState(false)
	const [openVideoCallLogsModal, setOpenVideoCallLogsModal] = useState(false)
	const [followUpData, setFollowUpData] = useState()
	const [statusData, setStatusData] = useState()
	const [status, setStatus] = useState([])

	// Event handlers
	const handleCloseTransferLeadModal = () => {
		props.fetchActivities()
		setOpenTransferLeadModal(false)
	}
	const handleCloseFollowUpModal = () => {
		props.fetchActivities()
		setOpenFollowUpModal(false)
	}
	const handleOpenFollowUpModal = (followup_reminder, status) => {
		setFollowUpData(followup_reminder)
		setStatusData(status)
		axios
			.get(`sales/leads/${props.lead_id}/statuses`)
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
	const handleOpenShareLeadModal = () => {
		setOpenShareLeadModal(true)
	}
	const handleCloseShareLeadModal = () => {
		setOpenShareLeadModal(false)
	}
	const handleOpenVideoCallLogsModal = () => {
		setOpenVideoCallLogsModal(true)
	}
	const handleCloseVideoCallLogsModal = () => {
		setOpenVideoCallLogsModal(false)
	}

	return (
		<>
			<Box
				sx={{
					backgroundColor: '#F0FAFD',
					border: '1px solid #1976D2',
					borderRadius: '4px',
					paddingY: 2,
					paddingX: matches ? 2 : 0.5,
				}}>
				<Box
					display="flex"
					sx={{
						flexDirection: matches ? 'row' : 'column',
						alignItems: matches ? 'center' : '',
						justifyContent: matches ? 'space-between' : '',
						marginBottom: 4,
					}}>
					{/* Lead ID and Name */}
					<Box display="flex" alignItems="center" justifyContent={matches ? 'start' : 'center'}>
						<Chip
							label={`#${props.lead_id}`}
							sx={{
								bgcolor: '#78909C',
								color: '#FFFFFF',
								borderRadius: '4px',
								fontSize: 'large',
								marginRight: '15px',
							}}
						/>
						<PersonIcon fontSize="large" />
						<Typography variant="h5">
							{props.data?.patient?.name}
							{props.data?.patient?.gender && ` (${props.data?.patient?.gender}) `}
							{props.data?.patient?.age && ` ${props.data?.patient?.age} `}
						</Typography>
					</Box>
					{/* Buttons */}
					<Box
						display="flex"
						sx={{
							flexDirection: matches ? 'row' : 'column',
							alignItems: matches ? 'center' : 'center',
							justifyContent: matches ? 'end' : 'center',
							gap: 2,
						}}>
						{/* Status and Follow Up Buttons */}
						<Box display="flex" alignItems="center" sx={{ marginTop: matches ? 0 : 2, gap: 2 }}>
							{/* Status Button */}
							{!user.isAuditor && isAllowed('add_partner_followup') && (
								<>
									<Button
										variant="contained"
										disableElevation
										endIcon={<UpdateIcon />}
										sx={{
											backgroundColor: '#9685CE',
											':hover': {
												backgroundColor: '#9685CE', // theme.palette.primary.main
											},
										}}
										onClick={() => {
											handleOpenFollowUpModal(props.data.followup_reminder, props.data.additional_information.status)
										}}>
										Status
									</Button>
									{/* Follow up Button */}
									{/* {JSON.stringify(props.data)} */}
									<Button
										color="error"
										variant="contained"
										disableElevation
										endIcon={<PhoneInTalkIcon />}
										sx={{
											whiteSpace: 'nowrap',
											backgroundColor: '#FF9848',
											':hover': {
												backgroundColor: '#FF9848', // theme.palette.primary.main
											},
										}}
										onClick={() => {
											handleOpenFollowUpModal(props.data.followup_reminder, props.data.additional_information.status)
										}}>
										Follow up
									</Button>
								</>
							)}

							<FollowUpModalPopup
								selectedLeadId={props.lead_id}
								open={openFollowUpModal}
								onClose={() => {
									handleCloseFollowUpModal()
								}}
								followUpData={followUpData}
								statusData={statusData}
								actualInvoice={props.data.actual_invoice}
								arrivalAt={props.data.arrival_at}
								estimatedInvoice={props.data.estimated_invoice}
								fieldPersonName={props.data.field_person_name}
								hotelName={props.data.hotel_name}
								passportNumber={props.data.passport_number}
								registrationNumber={props.data.registration_number}
								visaExpiryAt={props.data.visa_expiry_at}
								arrivalType={props.data.arrival_type}
								hotelType={props.data.hotel_type}
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
						</Box>
						{/* Share, Transfer and Edit Buttons */}
						<Box display="flex" alignItems="center" sx={{ gap: 2 }}>
							{/* Video Call Logs Button */}
							{!user.isAuditor && isAllowed('video_call_logs') && (
								<Tooltip title="Video Call Logs" arrow>
									<Button
										variant="contained"
										size="small"
										disableElevation
										onClick={handleOpenVideoCallLogsModal}
										sx={{ minWidth: 0 }}>
										<VideoCallIcon />
									</Button>
								</Tooltip>
							)}
							<VideoCallLogsModal
								open={openVideoCallLogsModal}
								onClose={handleCloseVideoCallLogsModal}
								leadId={props.lead_id}
								fetchData={props.fetchActivities}
							/>
							{/* Share Button */}
							{!user.isAuditor && isAllowed('share_lead') && (
								<Tooltip title="Share Lead" arrow>
									<Button
										variant="contained"
										size="small"
										disableElevation
										onClick={handleOpenShareLeadModal}
										sx={{ minWidth: 0 }}>
										<ShareIcon />
									</Button>
								</Tooltip>
							)}
							<ShareLeadModal
								open={openShareLeadModal}
								onClose={() => {
									handleCloseShareLeadModal()
								}}
								leadId={props.lead_id}
								fetchActivities={props.fetchActivities}
							/>
							{/* Transfer Button */}
							{!user.isAuditor && isAllowed('transfer_lead') && (
								<Tooltip title="Transfer Lead" arrow>
									<Button
										variant="contained"
										size="small"
										onClickCapture={() => {
											setOpenTransferLeadModal(true)
										}}
										disableElevation
										sx={{ minWidth: 0 }}
										onClick={{}}>
										<SwapHorizOutlinedIcon />
									</Button>
								</Tooltip>
							)}
							<TransferLeadModalPopup
								transferSelectedLeadId={props.lead_id}
								open={openTransferLeadModal}
								onClose={() => {
									handleCloseTransferLeadModal()
								}}
							/>
							{/* Edit Button */}
							{!user.isAuditor && isAllowed('edit_partner') && (
								<Tooltip title="Edit Lead" arrow>
									<Button
										variant="contained"
										size="small"
										disableElevation
										sx={{ minWidth: 0 }}
										onClick={() => {
											redirectHandler(`/lead/${props.lead_id}/edit`)
										}}>
										<EditIcon />
									</Button>
								</Tooltip>
							)}
						</Box>
					</Box>
				</Box>
				<Grid container spacing={2}>
					{/* Lead Assigned To */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Lead Assigned To
							</Typography>
							<Typography variant="body2" align="center">
								{props.data?.additional_information?.assigned_to ? props.data?.additional_information?.assigned_to : '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Modified At */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Modified At
							</Typography>
							<Typography variant="body2" align="center">
								{props.data?.additional_information?.updated_at ? props.data?.additional_information?.updated_at : '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Hospital Name */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Hospital Name
							</Typography>
							<Typography variant="body2" align="center">
								{props?.data?.additional_information?.facility.name
									? props?.data?.additional_information?.facility.name
									: '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Follow Up Count */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Follow Up Count
							</Typography>
							<Typography variant="body2" align="center">
								{props.data?.additional_information?.followup_count
									? props.data?.additional_information?.followup_count
									: '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Follow Up At */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Follow Up At
							</Typography>
							<Typography variant="body2" align="center">
								{props?.data?.followup_reminder?.display_time ? props?.data?.followup_reminder?.display_time : '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Status */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Status
							</Typography>
							<Typography variant="body2" align="center">
								{props?.data?.additional_information?.status?.current_status
									? props.data.additional_information.status.current_status.replaceAll('_', ' ')
									: '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Sub Status */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Sub Status
							</Typography>
							<Typography variant="body2" align="center">
								{props?.data?.additional_information?.status?.sub_status
									? props.data.additional_information.status.sub_status.replaceAll('_', ' ')
									: '----'}
							</Typography>
						</Box>
					</Grid>

					{/* Category */}
					<Grid item xs={6} md={1.5}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Category
							</Typography>
							<Typography variant="body2" align="center">
								{props.data?.additional_information.category.name
									? props.data?.additional_information.category.name
									: '----'}
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	)
}

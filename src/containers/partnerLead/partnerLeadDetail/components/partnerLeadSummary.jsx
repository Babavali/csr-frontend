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
import PartnerLeadDetailFollowUpModal from './partnerLeadDetailFollowUpModal.jsx'
// import TransferLeadModalPopup from '../../myLeads/components/transferLeadModalPopup'
// import ShareLeadModal from '../../myLeads/components/shareLeadModal'
// import VideoCallLogsModal from '../../myLeads/components/videoCallLogsModal'
import { useLocation } from 'react-router-dom'

export default function PartnerLeadSummary(props) {
	const location = useLocation()
	const pathName = location.pathname
	const pathnamestartswith = pathName.startsWith('/business-partner/doctor')
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const leadID = props.lead_id
	const type = props.type
	const data = props.data
	const matches = props.matches
	const partnerData = type === 'doctor' ? data.doctor : data.partner
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
	const goToEditPartnerPage = () => {
		redirectHandler(`/business-partner/doctor/${leadID}/edit`)
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
							label={`#${leadID}`}
							sx={{
								bgcolor: '#78909C',
								color: '#FFFFFF',
								borderRadius: '4px',
								fontSize: 'large',
								marginRight: '15px',
							}}
						/>
						<PersonIcon fontSize="large" />
						<Typography variant="h5">{partnerData.name}</Typography>
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
						{isAllowed('add_doctor_followup') && (
							<Box display="flex" alignItems="center" sx={{ marginTop: matches ? 0 : 2, gap: 2 }}>
								{/* Status Button */}
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
										handleOpenFollowUpModal()
									}}>
									Status
								</Button>
								{/* Follow up Button */}
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
										handleOpenFollowUpModal()
									}}>
									Follow up
								</Button>
								<PartnerLeadDetailFollowUpModal
									type={type}
									selectedLeadId={props.lead_id}
									open={openFollowUpModal}
									status={status}
									onClose={() => {
										handleCloseFollowUpModal()
									}}
								/>
							</Box>
						)}
						{/* Share, Transfer and Edit Buttons */}
						<Box display="flex" alignItems="center" sx={{ gap: 2 }}>
							{/* Share Button */}
							{/* <Tooltip title="Share Lead" arrow>
								<Button
									variant="contained"
									size="small"
									disableElevation
									onClick={handleOpenShareLeadModal}
									sx={{ minWidth: 0 }}>
									<ShareIcon />
								</Button>
							</Tooltip> */}

							{/* <ShareLeadModal
								open={openShareLeadModal}
								onClose={() => {
									handleCloseShareLeadModal()
								}}
								leadId={props.lead_id}
								fetchActivities={props.fetchActivities}
							/> */}

							{/* Transfer Button */}
							{/* {user.isAdmin && (
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
							)} */}

							{/* <TransferLeadModalPopup
								transferSelectedLeadId={props.lead_id}
								open={openTransferLeadModal}
								onClose={() => {
									handleCloseTransferLeadModal()
								}}
							/> */}

							{/* Edit Button */}
							{isAllowed('edit_doctor') && (
								<Tooltip title="Edit Lead" arrow>
									<Button
										variant="contained"
										size="small"
										disableElevation
										sx={{ minWidth: 0 }}
										onClick={goToEditPartnerPage}>
										<EditIcon />
									</Button>
								</Tooltip>
							)}
						</Box>
					</Box>
				</Box>
				<Grid container spacing={2}>
					{/* Lead Assigned To */}
					<Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Lead Assigned To
							</Typography>
							<Typography variant="body2" align="center">
								{data.additional_information.assigned_to ? data.additional_information.assigned_to : '-----'}
							</Typography>
						</Box>
					</Grid>

					{/* Modified At */}
					<Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Modified At
							</Typography>
							<Typography variant="body2" align="center">
								{data.additional_information.updated_at ? data.additional_information.updated_at : '-----'}
							</Typography>
						</Box>
					</Grid>

					{/* Hospital Name */}
					{/* <Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Hospital Name
							</Typography>
							<Typography variant="body2" align="center">
								TO BE ADDED
							</Typography>
						</Box>
					</Grid> */}

					{/* Follow Up Count */}
					<Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Follow Up Count
							</Typography>
							<Typography variant="body2" align="center">
								{data.additional_information.followup_count ? data.additional_information.followup_count : '-----'}
							</Typography>
						</Box>
					</Grid>

					{/* Follow Up At */}
					<Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Follow Up At
							</Typography>
							<Typography variant="body2" align="center">
								{data.followup_reminder.timestamp ? data.followup_reminder.timestamp : '-----'}
							</Typography>
						</Box>
					</Grid>

					{/* Tier */}
					<Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Tier
							</Typography>
							<Typography variant="body2" align="center">
								{data.lead_tier}
							</Typography>
						</Box>
					</Grid>

					{/* Status */}
					<Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Status
							</Typography>
							<Typography variant="body2" align="center">
								{data.additional_information.status?.current_status
									? data.additional_information.status?.current_status
									: '-----'}
							</Typography>
						</Box>
					</Grid>

					{/* Category */}
					{/* <Grid item xs={6} md={2}>
						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography variant="body2" align="center">
								Category
							</Typography>
							<Typography variant="body2" align="center">
								TO BE ADDED
							</Typography>
						</Box>
					</Grid> */}
				</Grid>
			</Box>
		</>
	)
}

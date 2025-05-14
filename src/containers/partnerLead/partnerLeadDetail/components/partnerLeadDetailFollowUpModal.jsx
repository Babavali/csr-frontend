/* eslint-disable  no-unused-vars */
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	FormControlLabel,
	Radio,
	RadioGroup,
	Grid,
	IconButton,
	InputLabel,
	Select,
	useMediaQuery,
	MenuItem,
	Modal,
	TextField,
	Typography,
	Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import axios from '../../../../shared/axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	p: 4,
}

export default function FollowUpModalPopup(props) {
	const type = props.type
	const matches = useMediaQuery('(min-width: 600px)')
	const leadId = props.selectedLeadId
	const statusTrial = props.status
	const finalStatuses = ['CLOSE', 'UNQUALIFIED', 'CONVERTED', 'INVALID']
	// const successfulFinalStatuses = ['IP', 'OP']
	const [showRemarks, setShowRemarks] = useState(false)

	let timeStamp = null
	let followUpDataStatus = null
	if (props.followUpData) {
		timeStamp = props.followUpData.timestamp || props.followUpData.followUpAt
		followUpDataStatus = props.followUpData.status
	}

	const regex = /([0-9]{4}-[0-9]{2}-[0-9]{2})?.([:0-9]+)/
	const date = timeStamp?.match(regex)[1]
	const time = timeStamp?.match(regex)[2]

	const [followUpDate, setFollowUpDate] = useState(null)
	const [followUpTime, setFollowUpTime] = useState(null)
	const [followUpStatus, setFollowUpStatus] = useState(null)
	const [followUpNote, setFollowUpNote] = useState(null)
	const [followUpRemark, setFollowUpRemark] = useState(null)

	const formatFollowUpTime = (followUpTime) => {
		if (!followUpTime) {
			followUpTime = '00:00'
		}
		const regex = /^\d{2}:\d{2}:\d{2}$/
		if (!regex.test(followUpTime)) {
			followUpTime = followUpTime.split(':').slice(0, 2).join(':') + ':00'
		}
		return followUpTime
	}

	const handleFollowUpStatus = (event) => {
		setFollowUpStatus(event.target.value)
	}
	const handleCloseModal = () => {
		setFollowUpDate(null)
		setFollowUpTime(null)
		setFollowUpRemark(null)
		props.onClose()
	}
	const handleOnSave = () => {
		const isFinal = finalStatuses.includes(selectedStatus)
		// If the status is not final status and the follow up date is not selected
		if (!isFinal && !followUpDate) {
			toast.error('Please select the date', { position: 'bottom-left' })
		}
		// If the showRemarks is not selected and the follow up note is not added
		else if (!showRemarks && !followUpNote) {
			toast.error('Please enter the follow up note', { position: 'bottom-left' })
		}
		// If it is a final remark and the remarks section is selected but the remark is not added
		else if (isFinal && showRemarks && followUpRemark.length <= 0) {
			toast.error('Please enter the remark', { position: 'bottom-left' })
		} else {
			let updatedFollowUpTime = null
			let followUpDateTime = null
			//Post Follow up
			if (followUpDate) {
				updatedFollowUpTime = formatFollowUpTime(followUpTime)
				followUpDateTime = followUpDate.concat(' ' + updatedFollowUpTime)
			}
			// Post Request for Follow Up Date
			const payload = {
				followup: {
					type: 'CALL',
					time: followUpDateTime ? followUpDateTime : null,
					notes: followUpNote ? followUpNote : null,
				},
				status: {
					new_status: selectedStatus ? selectedStatus : null,
					new_sub_status: null,
				},
				remark: followUpRemark,
			}
			let url
			if (window.location.href.includes('doctor') || window.location.href.includes('stale')) {
				url = `sales/leads/doctor-leads/${leadId}/follow_up`
			} else if (window.location.href.includes('sales')) {
				url = `sales/leads/partner-leads/${leadId}/follow_up`
			}
			axios
				.post(url, payload)
				.then((res) => {
					if (res?.status === 201) {
						toast.success('Saved successfully', {
							position: 'bottom-left',
						})
						handleCloseModal()
						setTimeout(() => {
							window.location.reload()
						}, 1000)
					}
				})
				.catch((error) => {
					toast.error(`${error.response.data.data.message}`, {
						position: 'bottom-left',
					})
				})
		}
	}

	function handleChangeFollowUpRemark(event) {
		setFollowUpRemark(event.target.value)
	}
	function handleChangeFollowUpNote(event) {
		setFollowUpNote(event.target.value)
	}

	// Status JavaScript Start
	const [statusModalStatus, setStatusModalStatus] = useState([])

	useEffect(() => {
		if (props.status?.length > 0) {
			setStatusModalStatus(props.status)
		}
	}, [props.status])
	const [selectedStatus, setSelectedStatus] = useState()
	useEffect(() => {
		if (selectedStatus) {
			if (finalStatuses.includes(selectedStatus)) {
				setShowRemarks(true)
			} else {
				setShowRemarks(false)
			}
		}
	}, [selectedStatus])

	const getTodaysDate = () => {
		const date = new Date()
		return date.toISOString().split('T')[0]
	}
	const toggleShowRemarks = () => {
		setFollowUpRemark(null)
		setFollowUpDate(null)
		setFollowUpNote(null)
		setShowRemarks(!showRemarks)
	}
	// Status JavaScript End

	return (
		<Modal open={props.open} onClose={handleCloseModal}>
			<Box sx={style} style={{ minWidth: matches ? '750px' : 0 }}>
				<Box display="flex" justifyContent="flex-end">
					<IconButton onClick={handleCloseModal}>
						<CloseIcon />
					</IconButton>
				</Box>
				{/* Status */}
				<Box>
					<Typography
						style={{
							fontSize: '20px',
							fontWeight: '500',
							display: 'flex',
							justifyContent: 'left',
							marginBottom: '20px',
						}}>
						Status
					</Typography>

					<InputLabel>Main status</InputLabel>
					<FormControl size="small">
						<Select
							name="mainStatus"
							onChange={(event) => {
								const selectedStatus = event.target.value
								setSelectedStatus(selectedStatus)
							}}
							style={{
								minWidth: '300px',
							}}>
							{statusModalStatus?.map((item) => {
								return (
									<MenuItem value={item} key={item}>
										{item}
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				</Box>
				<Divider sx={{ my: 3 }} />
				{/* Toggle Follow up and Remark Button */}
				{/* {successfulFinalStatuses.includes(selectedStatus) && (
					<Button variant="contained" onClick={toggleShowRemarks} sx={{ my: 2 }}>
						{showRemarks ? 'Enter Follow Up' : 'Enter Remark'}
					</Button>
				)} */}
				{/* Follow Up */}
				{!showRemarks && (
					<Box>
						<Typography
							style={{
								fontSize: '20px',
								fontWeight: '500',
								display: 'flex',
								justifyContent: 'left',
								marginBottom: '2px',
							}}>
							Follow-up Details*
						</Typography>
						<Box display="flex" justifyContent="space-between" alignItems="baseline" mb={2}></Box>

						<Box>
							<Grid container spacing={2} style={{ marginBottom: '36px' }}>
								<Grid item xs={12} md={6}>
									<TextField
										name="selectDate"
										label="Select Date*"
										type="date"
										InputProps={{ inputProps: { min: getTodaysDate() } }}
										InputLabelProps={{
											shrink: true,
										}}
										sx={{ minWidth: 200 }}
										size="small"
										value={followUpDate || ''}
										onChange={(e) => {
											setFollowUpDate(e.target.value)
										}}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										name="selectTime"
										label="Select Time*"
										type="time"
										InputLabelProps={{
											shrink: true,
										}}
										size="small"
										sx={{ minWidth: 200 }}
										value={followUpTime || ''}
										onChange={(e) => {
											setFollowUpTime(e.target.value)
										}}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="outlined-basic"
										label="Follow Up Note"
										required
										size="small"
										variant="outlined"
										fullWidth
										multiline
										rows={3}
										onChange={handleChangeFollowUpNote}
										value={followUpNote}
									/>
								</Grid>
							</Grid>
						</Box>
					</Box>
				)}
				{/* Remark */}
				{showRemarks && (
					<Box sx={{ mb: 4 }}>
						<Typography
							style={{
								fontSize: '20px',
								fontWeight: '500',
								display: 'flex',
								justifyContent: 'left',
								marginBottom: '20px',
							}}>
							Remark*
						</Typography>
						<TextField
							id="outlined-basic"
							label="Write a Remark"
							required
							size="small"
							variant="outlined"
							fullWidth
							multiline
							rows={3}
							onChange={handleChangeFollowUpRemark}
							value={followUpRemark}
						/>
					</Box>
				)}
				<Button onClick={handleOnSave} variant="contained" sx={{ borderRadius: 2, fontWeight: 550 }}>
					Save
				</Button>
			</Box>
		</Modal>
	)
}

/* eslint-disable no-unused-vars */
import { Box, Button, Grid, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 680,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
}

export default function VideoCallLogsModal(props) {
	const open = props.open
	const onClose = props.onClose
	const leadId = props.leadId
	const fetchData = props.fetchData

	const [videoCallLogDate, setVideoCallLogDate] = useState(null)
	const [videoCallLogTime, setVideoCallLogTime] = useState(null)

	const formatTime = (timeString) => {
		timeString = timeString + ':00'
		return timeString
	}
	const handleSendVideoCallLog = () => {
		let isDataValid = true
		if (!videoCallLogDate) {
			isDataValid = false
			toast.error('Please select the date of the call log', {
				position: 'bottom-left',
			})
		}
		if (!videoCallLogTime) {
			isDataValid = false
			toast.error('Please select the time of the call log', {
				position: 'bottom-left',
			})
		}

		if (isDataValid) {
			const payload = {
				followup: {
					type: 'VIDEO_CALL',
					time: `${videoCallLogDate} ${formatTime(videoCallLogTime)}`,
					notes: 'Logged a Video Call',
				},
				status: {
					new_status: null,
					new_sub_status: null,
				},
				remark: null,
			}
			axios
				.post(`sales/leads/${leadId}/follow_up`, payload)
				.then((res) => {
					if (res?.status === 201) {
						toast.success('Saved successfully', {
							position: 'bottom-left',
						})
						fetchData()
						onClose()
					}
				})
				.catch((error) => {
					toast.error(`${error.response.data.data.message}`, {
						position: 'bottom-left',
					})
				})
		}
	}

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style}>
				<Typography
					style={{
						fontSize: '20px',
						fontWeight: '500',
						display: 'flex',
						justifyContent: 'center',
						marginBottom: '20px',
					}}>
					Video Call Logs
				</Typography>

				<Grid container spacing={2} style={{ marginBottom: '36px' }}>
					<Grid item xs={12} md={6}>
						<TextField
							name="selectDate"
							label="Select Date*"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							sx={{ minWidth: 200 }}
							size="small"
							onChange={(e) => {
								setVideoCallLogDate(e.target.value)
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
							onChange={(e) => {
								setVideoCallLogTime(e.target.value)
							}}
							fullWidth
						/>
					</Grid>
				</Grid>

				{/* Send Button */}
				<Box textAlign="center" mt={4}>
					<Button variant="contained" onClick={handleSendVideoCallLog}>
						Send
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}

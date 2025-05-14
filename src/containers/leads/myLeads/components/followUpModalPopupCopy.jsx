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
	const matches = useMediaQuery('(min-width: 600px)')
	const leadId = props.selectedLeadId
	const finalStatuses = ['IP', 'OP', 'INVALID', 'LOST', 'CLOSE', 'NUTURE']
	let timeStamp = null
	let followUpDataStatus = null
	if (props.followUpData) {
		timeStamp = props.followUpData.timestamp || props.followUpData.followUpAt
		followUpDataStatus = props.followUpData.status
	}

	const regex = /([0-9]{4}-[0-9]{2}-[0-9]{2})?.([:0-9]+)/
	const date = timeStamp?.match(regex)[1]
	const time = timeStamp?.match(regex)[2]

	const [followUpDate, setFollowUpDate] = useState(date)
	const [followUpTime, setFollowUpTime] = useState(time)
	const [followUpStatus, setFollowUpStatus] = useState('')
	const [followUpRemark, setFollowUpRemark] = useState('')

	useEffect(() => {
		setFollowUpDate(date)
		setFollowUpTime(time)
		if (
			followUpDataStatus === null ||
			followUpDataStatus === 'DONE' ||
			followUpDataStatus === 'TIME_CHANGED' ||
			finalStatuses.includes(selectedStatus) ||
			finalStatuses.includes(statusData.current_status)
		) {
			setFollowUpDate(null)
			setFollowUpTime(null)
		}
	}, [date, time, followUpDataStatus])

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
		setFollowUpRemark('')
		props.onClose()
	}
	const handleOnSave = () => {
		const isFinal = finalStatuses.includes(selectedStatus)
		if (!isFinal && !followUpDate) {
			toast.error('Please select the date', { position: 'bottom-left' })
		} else if (followUpRemark.length <= 0) {
			toast.error('Please enter a remark for the change in follow up', { position: 'bottom-left' })
		} else {
			if (followUpDate) {
				const updatedFollowUpTime = formatFollowUpTime(followUpTime)
				const followUpDateTime = followUpDate.concat(' ' + updatedFollowUpTime)
				// Post Request for Follow Up Date
				axios
					.post(`sales/leads/${leadId}/follow_up`, {
						followup_at: followUpDateTime,
					})
					.then((res) => {
						if (res?.status === 201) {
							toast.success('Saved successfully', {
								position: 'bottom-left',
							})
							handleCloseModal()
						}
					})
					.catch((error) => {
						toast.error(`Follow Up Error - ${error.response.data.data.message}`, {
							position: 'bottom-left',
						})
					})
			}

			// Status
			if (!(statusData.current_status === selectedStatus && statusData.sub_status === subStatus)) {
				axios
					.put(`sales/leads/${leadId}/status/edit`, {
						new_status: selectedStatus,
						new_sub_status: subStatus,
					})
					.then((res) => {
						if (res?.status === 200) {
							toast.success('Saved successfully', {
								position: 'bottom-left',
							})
						}
					})
					.catch((error) => {
						toast.error(`Status Error - ${error.response.data.data.message}`, {
							position: 'bottom-left',
						})
					})
			}

			// Remark
			const payload = {
				remark: followUpRemark,
			}
			// `/sales/leads/${lead_id}/add-remark'
			axios.post(`/sales/leads/${leadId}/add-remark`, payload).catch((error) => {
				toast.error(`Remark Error - ${error.response.data.data.message}`, {
					position: 'bottom-left',
				})
			})
			setTimeout(() => {
				window.location.reload()
			}, 1000)
		}
	}

	function handleChangeFollowUpRemark(event) {
		setFollowUpRemark(event.target.value)
	}

	// Status JavaScript Start
	const statusModalStatus = props.status
	const statusData = props.statusData

	const [possibleSubStatuses, setPossibleSubStatuses] = useState([])
	const [selectedStatus, setSelectedStatus] = useState()
	const [subStatus, setSubStatus] = useState()
	const [, setSelectedSubStatus] = useState()

	const getTodaysDate = () => {
		const date = new Date()
		return date.toISOString().split('T')[0]
	}
	useEffect(() => {
		const data = statusModalStatus?.find((item) => item.status === statusData?.current_status)
		const allSubstatuses = data?.substatus.substatuses || []
		if (statusData?.sub_status && !allSubstatuses.includes(statusData.sub_status)) {
			allSubstatuses.push(statusData.sub_status)
		}
		setPossibleSubStatuses(allSubstatuses)
		setSelectedSubStatus(statusData?.sub_status)
		setSelectedStatus(statusData?.current_status)
		setSubStatus(statusData?.sub_status)
	}, [statusModalStatus, statusData])
	// Status JavaScript End

	return (
		<Modal open={props.open} onClose={handleCloseModal}>
			<Box sx={style}>
				<Box display="flex" justifyContent="flex-end">
					<IconButton onClick={handleCloseModal}>
						<CloseIcon />
					</IconButton>
				</Box>
				{/* Status */}
				<Box mb={matches ? 8 : 2}>
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

					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<InputLabel>Main status</InputLabel>
							<FormControl size="small">
								<Select
									name="mainStatus"
									onChange={(event) => {
										const selectedStatus = event.target.value
										const possibleSubStatuses = statusModalStatus?.find((item) => {
											return item.status === selectedStatus
										}).substatus.substatuses
										setPossibleSubStatuses(possibleSubStatuses)
										setSelectedStatus(selectedStatus)
										setSubStatus(null)
									}}
									style={{
										width: '300px',
									}}
									defaultValue={statusData?.current_status}
									disabled={statusModalStatus?.length === 0}>
									{statusModalStatus?.map((item) => {
										return (
											<MenuItem
												selected={statusData?.current_status === item.status}
												value={item.status}
												key={item.status}>
												{item.status?.replaceAll('_', ' ')}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} md={6}>
							<InputLabel>Sub status</InputLabel>
							<FormControl size="small">
								<Select
									name="subStatus"
									style={{ width: '300px' }}
									disabled={!possibleSubStatuses?.length}
									onChange={(event) => {
										const selectedSubStatus = event.target.value
										setSubStatus(selectedSubStatus)
									}}
									defaultValue={statusData?.sub_status}>
									{possibleSubStatuses?.map((substatus) => {
										return (
											<MenuItem selected={statusData?.sub_status === substatus} key={substatus} value={substatus}>
												{substatus?.replaceAll('_', ' ')}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</Box>

				{/* Follow Up */}
				<Box mb={matches ? 8 : 2}>
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
						</Grid>
					</Box>
				</Box>

				{/* Remark */}
				<Box mb={matches ? 8 : 2}>
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

				<Button onClick={handleOnSave} variant="contained" sx={{ borderRadius: 2, fontWeight: 550 }}>
					Save
				</Button>
			</Box>
		</Modal>
	)
}

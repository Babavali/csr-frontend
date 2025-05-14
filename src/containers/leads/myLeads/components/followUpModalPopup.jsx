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
import { SettingsPhoneTwoTone } from '@mui/icons-material'

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
	const finalStatuses = ['IP', 'OP', 'INVALID', 'LOST', 'CLOSE']
	const successfulFinalStatuses = ['IP', 'OP']
	const [showRemarks, setShowRemarks] = useState(false)
	const [open, setOpen] = useState(props.open)
	// const ActualInvoice = props.ActualInvoice
	// const ArrivalAt = props.ArrivalAt
	// const EstimatedInvoice = props.EstimatedInvoice
	// const FieldPersonName = props.FieldPersonName
	// const HotelName = props.HotelName
	// const PassportNumber = props.PassportNumber
	// const RegistrationNumber = props.RegistrationNumber
	// const VisaExpiryAt = props.VisaExpiryAt
	// const HotelType = props.HotelType
	// const ArrivalType = props.ArrivalType

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
	const [estimatedAmount, setEstimatedAmount] = useState(null)
	const [actualInvoiceAmount, setActualInvoiceAmount] = useState(null)
	const [arrivalDate, setArrivalDate] = useState(() => {})
	// if (props.ArrivalAt) {
	// 	setArrivalDate(() => {
	// 		const dateOnly = props.ArrivalAt.split(' ')[0]
	// 		return dateOnly
	// 	})
	// }
	const [registrationNumber, setRegistrationNumber] = useState(null)
	const [fieldPerson, setFieldPerson] = useState(null)
	const [passportNumber, setPassportNumber] = useState(null)
	const [hotelName, setHotelName] = useState(null)
	const [visaExpiryDate, setVisaExpiryDate] = useState(null)
	// 	() => {
	// 	if (prodps.VisaExpiryAt) {
	// 		const dateOnly = prdops.VisaExpiryAt.split(' ')[0]
	// 		return dateOnly
	// 	}
	// }
	const [hotelTypeList, setHotelTypeList] = useState(null)
	const [hotelType, setHotelType] = useState(null)
	const [arrivalType, setArrivalType] = useState(null)
	const [arrivalTypeList, setArrivalTypeList] = useState(null)
	const getHotelTypeList = () => {
		axios
			.get('/sales/leads/hotel')
			.then((res) => setHotelTypeList(res?.data.data))
			.catch((error) => {
				toast.error(`${error.response.data.data.message}`, {
					position: 'bottom-left',
				})
			})
	}

	const getLeadTypeList = () => {
		axios
			.get('sales/leads/arrival-type')
			.then((res) => setArrivalTypeList(res?.data.data))
			.catch((error) => {
				toast.error(`${error.response.data.data.message}`, {
					position: 'bottom-left',
				})
			})
	}
	useEffect(() => {
		getHotelTypeList()
		getLeadTypeList()
	}, [])

	useEffect(() => {
		setEstimatedAmount(props.estimatedInvoice || null)
		setActualInvoiceAmount(props.actualInvoice || null)
		setRegistrationNumber(props.registrationNumber || null)
		setFieldPerson(props.fieldPersonName || null)
		setPassportNumber(props.passportNumber || null)
		setHotelName(props.hotelName || null)
		setHotelType(props.hotelType || null)
		setArrivalType(props.arrivalType || null)
		setVisaExpiryDate(props.visaExpiryAt?.split(' ')[0] || null)
		setArrivalDate(props.arrivalAt && props.arrivalAt !== '0000-00-00' ? props.arrivalAt?.split(' ')[0] : null)
	}, [props.open])
	// [estimatedAmount, actualInvoiceAmount, registrationNumber, fieldPerson, passportNumber, hotelName, hotelType, arrivalType])

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
		setActualInvoiceAmount(null)
		setEstimatedAmount(null)
		setRegistrationNumber(null)
		setHotelName('')
		setVisaExpiryDate(null)
		setArrivalDate(null)
		setFieldPerson(null)
		setPassportNumber(null)
		setHotelType('')
		setArrivalType(null)
		// setOpen(false)
		props.onClose()
	}
	const handleOnSave = () => {
		const isFinal = finalStatuses.includes(selectedStatus)
		const isIpOp = successfulFinalStatuses.includes(selectedStatus)
		const isArriNotiSTH = selectedStatus === 'ARRIVAL_NOTIFICATION_SENT_TO_HOSPITAL'
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
		} else if (isIpOp && (!estimatedAmount || !registrationNumber || !visaExpiryDate || !arrivalType)) {
			if (!estimatedAmount) toast.error('Please enter the estimated amount', { position: 'bottom-left' })
			if (!registrationNumber) toast.error('Please enter the registration number', { position: 'bottom-left' })
			if (!visaExpiryDate) toast.error('Please enter the visa expiry date', { position: 'bottom-left' })
			if (!arrivalType) toast.error('Please enter the arrival type', { position: 'bottom-left' })
		} else if (isArriNotiSTH && (!arrivalDate || arrivalDate === '0000-00-00' || !fieldPerson)) {
			if (!arrivalDate) toast.error('Please enter the arrival date', { position: 'bottom-left' })
			if (!fieldPerson) toast.error('Please enter the field person name', { position: 'bottom-left' })
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
					new_sub_status: subStatus ? subStatus : null,
				},
				remark: followUpRemark,
				meta_data: {
					// IP/OP
					actual_invoice: actualInvoiceAmount ? actualInvoiceAmount : null,
					registration_number: registrationNumber ? registrationNumber : null,
					estimated_invoice: estimatedAmount ? Number(estimatedAmount) : null,
					hotel_name: hotelName ? hotelName : null,
					visa_expiry_at: visaExpiryDate ? visaExpiryDate : null,
					//Arrival notification sent to hospital
					arrival_at: arrivalDate ? arrivalDate : null,
					field_person_name: fieldPerson ? fieldPerson : null,
					passport_number: passportNumber ? passportNumber : null,
					hotel_type: hotelType ? hotelType : null,
					arrival_type: arrivalType || null,
				},
			}

			axios
				.post(`sales/leads/${leadId}/follow_up`, payload)
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
	useEffect(() => {
		if (selectedStatus) {
			if (finalStatuses.includes(selectedStatus)) {
				setShowRemarks(true)
			} else {
				setShowRemarks(false)
			}
		}
	}, [selectedStatus])
	const toggleShowRemarks = () => {
		setFollowUpRemark(null)
		setFollowUpDate(null)
		setFollowUpNote(null)
		setShowRemarks(!showRemarks)
	}

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
						{selectedStatus === 'ARRIVAL_NOTIFICATION_SENT_TO_HOSPITAL' && (
							<>
								<Grid item xs={12} md={6}>
									<TextField
										value={arrivalDate}
										size="small"
										name="toDate"
										label="Arrival Date"
										type="date"
										InputLabelProps={{
											shrink: true,
										}}
										onChange={(event) => setArrivalDate(event.target.value)}
										style={{ width: '300px' }}
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										value={fieldPerson}
										size="small"
										name="fieldPerson"
										label="Field Person"
										InputLabelProps={{
											shrink: true,
										}}
										onChange={(event) => setFieldPerson(event.target.value)}
										style={{ width: '300px' }}
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										value={passportNumber}
										id="outlined-basic"
										size="small"
										label="Passport Number"
										variant="outlined"
										style={{ width: '300px' }}
										onChange={(event) => setPassportNumber(event.target.value)}
									/>
								</Grid>
							</>
						)}
						{successfulFinalStatuses.includes(selectedStatus) && (
							<>
								<Grid item xs={12} md={6}>
									<TextField
										value={actualInvoiceAmount}
										id="outlined-basic"
										size="small"
										label="Actual Invoiced Amount"
										variant="outlined"
										style={{ width: '300px' }}
										onChange={(event) => setActualInvoiceAmount(event.target.value)}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										value={estimatedAmount}
										id="outlined-basic"
										size="small"
										label="Estimated Amount"
										variant="outlined"
										style={{ width: '300px' }}
										onChange={(event) => setEstimatedAmount(event.target.value)}
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										value={registrationNumber}
										id="outlined-basic"
										size="small"
										label="Registration Number"
										variant="outlined"
										style={{ width: '300px' }}
										onChange={(event) => setRegistrationNumber(event.target.value)}
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										value={hotelName}
										id="outlined-basic"
										size="small"
										label="Hotel Name"
										variant="outlined"
										style={{ width: '300px' }}
										onChange={(event) => setHotelName(event.target.value)}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<TextField
										style={{ width: '300px' }}
										value={visaExpiryDate}
										size="small"
										name="visaExpiryDate"
										label="Visa Expiry Date"
										type="date"
										InputLabelProps={{
											shrink: true,
										}}
										onChange={(event) => setVisaExpiryDate(event.target.value)}
										required
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<FormControl size="small">
										<InputLabel id="hotelType">Hotel Type</InputLabel>
										<Select
											labelId="hotelType"
											id="hotelType"
											value={hotelType}
											label="Hotel Type"
											onChange={(event) => setHotelType(event.target.value)}
											style={{
												width: '300px',
											}}
											InputLabelProps={{
												shrink: true,
											}}>
											{hotelTypeList?.map((hotelType) => (
												<MenuItem key={hotelType} value={hotelType}>
													{hotelType.replaceAll('_', ' ')}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={6}>
									<FormControl fullWidth size="small" style={{ width: '447px' }} required>
										<InputLabel>Arrival Type</InputLabel>
										<Select
											labelId="demo-select-small-label"
											id="demo-select-small"
											value={arrivalType}
											label="Arrival Type"
											onChange={(event) => setArrivalType(event.target.value)}
											style={{
												width: '300px',
											}}>
											{arrivalTypeList?.map((arrivalType) => (
												<MenuItem key={arrivalType} value={arrivalType}>
													{arrivalType.replaceAll('_', ' ')}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</>
						)}
					</Grid>
				</Box>
				<Divider sx={{ my: 3 }} />
				{/* Toggle Follow up and Remark Button */}
				{successfulFinalStatuses.includes(selectedStatus) && (
					<Button variant="contained" onClick={toggleShowRemarks} sx={{ my: 2 }}>
						{showRemarks ? 'Enter Follow Up' : 'Enter Remark'}
					</Button>
				)}

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

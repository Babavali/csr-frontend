import React, { useEffect, useState } from 'react'
import CustomModal from '../../../../components/common/customModal/customModal'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'

function StatusModalPopUp({ open, handleClose, status, selectedLeadId, statusData }) {
	const [possibleSubStatuses, setPossibleSubStatuses] = useState([])
	const [selectedStatus, setSelectedStatus] = useState()
	const [subStatus, setSubStatus] = useState()
	const [, setSelectedSubStatus] = useState()

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

	const handleOnSave = () => {
		axios
			.put(`sales/leads/${selectedLeadId}/status/edit`, {
				status: selectedStatus,
				sub_status: subStatus,
			})
			.then((res) => {
				if (res?.status === 200) {
					toast.success('Saved successfully', {
						position: 'bottom-left',
					})
					handleClose()
					setTimeout(() => {
						window.location.reload()
					}, 1000)
				}
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}

	useEffect(() => {
		const data = status?.find((item) => item.status === statusData?.current_status)
		const allSubstatuses = data?.substatus.substatuses || []
		if (statusData?.sub_status && !allSubstatuses.includes(statusData.sub_status)) {
			allSubstatuses.push(statusData.sub_status)
		}
		setPossibleSubStatuses(allSubstatuses)
		setSelectedSubStatus(statusData?.sub_status)
		setSelectedStatus(statusData?.current_status)
		setSubStatus(statusData?.sub_status)
	}, [status, statusData])
	return (
		<CustomModal openModal={open} handleClose={handleClose}>
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
					Status
				</Typography>

				<Grid container spacing={2} sx={{ padding: '20px' }}>
					<Grid item xs={12} md={6}>
						<InputLabel>Main status</InputLabel>
						<FormControl size="small">
							<Select
								name="mainStatus"
								onChange={(event) => {
									const selectedStatus = event.target.value
									const possibleSubStatuses = status?.find((item) => {
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
								disabled={status?.length === 0}>
								{status?.map((item) => {
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
				<Box textAlign="center" mt={4}>
					<Button variant="contained" onClick={handleOnSave}>
						Save
					</Button>
				</Box>
			</Box>
		</CustomModal>
	)
}

export default StatusModalPopUp

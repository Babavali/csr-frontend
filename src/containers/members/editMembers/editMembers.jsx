// React
import { React, useState, useEffect } from 'react'
// Packages
import axios from '../../../shared/axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
// MUI Components
import { Box, Button, Divider, FormControlLabel, Grid, useMediaQuery, Stack, Switch, TextField, Typography } from '@mui/material'
// MUI Icons
import AddCategory from './components/addCategory'
import EditPermissions from './components/editPermissions'
import { useSelector } from 'react-redux'

function EditMembers() {
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const matches = useMediaQuery('(min-width:600px)')
	const [searchParams] = useSearchParams()
	const [data, setData] = useState(null)
	const [switchChecked, setSwitchChecked] = useState(false)
	const id = searchParams.get('id')
	const value = searchParams.get('value')
	const fetchData = () => {
		if (value === '0') {
			axios
				.get(`sales/employee/sale-emp/${id}`)
				.then((res) => {
					setData(res.data.data)
					setSwitchChecked(res.data.data.is_active)
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		} else if (value === '1') {
			axios
				.get(`sales/employee/partner/${id}`)
				.then((res) => {
					setData(res.data.data)
					setSwitchChecked(res.data.data.is_active)
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		}
	}
	useEffect(fetchData, [])

	const navigate = useNavigate()

	const redirectHandler = (path) => {
		navigate(path)
	}

	const payload = {
		is_active: switchChecked,
	}

	const handleSave = () => {
		if (value === '0') {
			axios
				.put(`sales/employee/sale-emp/${id}`, payload)
				.then((res) => {
					if (res?.status === 200) {
						toast.success('Saved successfully', {
							position: 'bottom-left',
						})
						redirectHandler('/members')
					}
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		} else if (value === '1') {
			axios
				.put(`sales/employee/partner/${id}`, payload)
				.then((res) => {
					if (res?.status === 200) {
						redirectHandler('/members')
					}
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		}
	}

	const handleToggleActiveStatus = () => {
		setSwitchChecked(!switchChecked)
	}

	return (
		<>
			<Box sx={{ width: '100%', padding: 3 }}>
				<Stack
					direction="row"
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-end',
					}}
					spacing={2}>
					<Button variant="text" style={{ marginBottom: '4px' }} onClick={handleSave}>
						Save
					</Button>
				</Stack>
				<Divider />
				<Box>
					<Grid container spacing={2}>
						<Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
							<Box
								display="flex"
								sx={{
									alignItems: 'center',
									marginY: 4,
								}}>
								<TextField
									label="First Name"
									variant="standard"
									value={data?.first_name || ''}
									InputLabelProps={{ shrink: true }}
									disabled
								/>
								<TextField
									label="Last Name"
									variant="standard"
									value={data?.last_name || ''}
									InputLabelProps={{ shrink: true }}
									disabled
								/>
								{/* <Chip label="Blood Cancer(Static)"></Chip> */}
							</Box>
						</Grid>
						<Grid item xs={12} md={3} style={{ display: 'flex', justifyContent: 'center' }}>
							<Box m={matches ? 4 : 1} p={4} style={{ border: '1px solid #DCD0D0' }} width={380}>
								<Typography variant="h5">Status</Typography>
								<Divider
									sx={{
										borderBottomWidth: 5,
										borderColor: '#0089D6',
										width: '50px',
									}}
								/>
								<FormControlLabel
									control={<Switch checked={switchChecked} onChange={handleToggleActiveStatus} />}
									label={switchChecked ? 'Active' : 'InActive'}
								/>
							</Box>
						</Grid>
					</Grid>

					{/* Add Category */}
					{isAllowed('allocate_or_assign_lead') && <AddCategory matches={matches} memeber_id={id} />}
					{/* Permissions */}
					{data && <EditPermissions member_id={id} member_data={data} />}
				</Box>
			</Box>
		</>
	)
}

// const categories = [];

export default EditMembers

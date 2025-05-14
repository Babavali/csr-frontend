/*eslint-disable no-unused-vars*/
import { Box, Button, Drawer, Grid, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Toolbar from '@mui/material/Toolbar'
import { Divider, FormControl, InputLabel, MenuItem, Select, FormControlLabel, Checkbox } from '@mui/material'
import TextField from '../../../../components/common/textField/textField'
import { Field, Form, Formik } from 'formik'
import CategoryComponent from '../../components/categoryComponent'
import CountryComponent from '../../components/countryComponent'
import Stack from '@mui/material/Stack'
import axios from '../../../../shared/axios'
// import { Checkbox } from 'formik-mui'

export default function FollowUpsFilterComponent(props) {
	const [mainStatusData, setMainStatusData] = useState()
	const [subStatusData, setSubStatusData] = useState()
	const [mainStatus, setMainStatus] = useState()
	const matches = useMediaQuery('(min-width: 600px)')
	const filterItems = useSelector((state) => state.followUpsFilter)
	/*
	1. category,
	2. lead_id,
	3. country,
	4. treatment_intensity,
	5. email,
	name,
	phone,
	status,
	sub-status,
	date
	*/
	const initialValues = {
		followUpDateFrom: filterItems?.followUpDateFrom?.value ? filterItems?.followUpDateFrom?.value : '',
		followUpTimeFrom: '',
		followUpDateTo: filterItems?.followUpDateTo?.value ? filterItems?.followUpDateTo?.value : '',
		followUpTimeTo: '',

		leadId: filterItems?.leadId?.value ? filterItems?.leadId?.value : '',
		mainStatus: filterItems?.mainStatus?.value ? filterItems?.mainStatus?.value : '',
		subStatus: filterItems?.subStatus?.value ? filterItems?.subStatus?.value : '',
		enquirerName: filterItems?.enquirerName?.value ? filterItems?.enquirerName?.value : '',
		enquirerPhone: filterItems?.enquirerPhone?.value ? filterItems?.enquirerPhone?.value : '',
		patientCountry: filterItems?.patientCountry?.value ? filterItems?.patientCountry?.value : '',
		category: filterItems?.category?.value ? filterItems?.category?.value : '',
		tier: filterItems?.tier?.value ? filterItems?.tier?.value : '',
		treatmentIntensity: filterItems?.treatmentIntensity?.value ? filterItems?.treatmentIntensity?.value : '',

		// Display values
		patientCountryName: filterItems?.patientCountry?.name ? filterItems?.patientCountry?.name : '',
		categoryName: filterItems?.category?.name ? filterItems?.category?.name : '',
	}

	const handleSubmit = (values) => {
		props.onSubmit(values)
		props.onClose()
	}

	const fetchMainStatusData = () => {
		axios.get(`sales/leads/statuses`).then((res) => {
			setMainStatusData(res.data.data)
		})
	}

	const handleClearFilter = () => {
		props.handleClearFilter()
	}

	useEffect(() => {
		fetchMainStatusData()
	}, [])

	const fetchSubStatusData = () => {
		mainStatus &&
			axios.get(`/sales/leads/sub-statuses?status=${mainStatus}`).then((res) => {
				setSubStatusData(res.data.data)
			})
	}

	useEffect(() => {
		fetchSubStatusData()
	}, [mainStatus])

	return (
		<>
			<Drawer
				anchor="right"
				open={props.open}
				onClose={props.onClose}
				sx={{ position: 'absolute', zIndex: '1300' }}
				PaperProps={{
					sx: { width: matches ? '400px' : '100%' },
				}}
				disablescrolllock="true">
				<Box>
					<AppBar sx={{ mt: -1 }} position="static">
						<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<IconButton onClick={props.onClose} size="large" edge="start" color="inherit" aria-label="back">
								<ArrowBackIosNewIcon />
							</IconButton>
							<Typography variant="h6" component="div">
								Follow Ups Filter
							</Typography>
							<Box></Box>
						</Toolbar>
					</AppBar>
				</Box>
				<Formik initialValues={initialValues} onSubmit={handleSubmit}>
					{(props) => {
						const {
							followUpDateFrom,
							followUpTimeFrom,
							followUpDateTo,
							followUpTimeTo,
							leadId,
							mainStatus,
							subStatus,
							enquirerName,
							enquirerPhone,
							patientCountryName,
							category,
							categoryName,
							tier,
							treatmentIntensity,
						} = props.values
						return (
							<Form>
								<Stack spacing={2} sx={{ p: 1.5, marginBottom: 2 }}>
									<Grid container spacing={4}>
										<Grid item xs={12} md={6}>
											<TextField
												name="followUpDateFrom"
												label="From Date"
												type="date"
												InputLabelProps={{
													shrink: true,
												}}
												value={followUpDateFrom}
												onChange={props.handleChange}
												fullWidth
											/>
										</Grid>
										{/* Follow Up Time From */}
										{/* <Grid item xs={12} md={6}>
											<TextField
												name="followUpTimeFrom"
												label="From Time"
												type="time"
												InputLabelProps={{
													shrink: true,
												}}
												value={followUpTimeFrom}
												onChange={props.handleChange}
												fullWidth
											/>
										</Grid> */}
										<Grid item xs={12} md={6}>
											<TextField
												name="followUpDateTo"
												label="To Date"
												type="date"
												InputLabelProps={{
													shrink: true,
												}}
												value={followUpDateTo}
												onChange={props.handleChange}
												fullWidth
											/>
										</Grid>
										{/* Follow Up Time To */}
										{/* <Grid item xs={12} md={6}>
											<TextField
												name="followUpTimeTo"
												label="To Time"
												type="time"
												InputLabelProps={{
													shrink: true,
												}}
												value={followUpTimeTo}
												onChange={props.handleChange}
												fullWidth
											/>
										</Grid> */}
									</Grid>

									{/* Status */}
									<Box>
										<Typography variant="h6">Status</Typography>
										<Divider
											sx={{
												marginTop: -0.5,
												borderBottomWidth: 3,
												borderColor: '#0089D6',
												width: '50px',
											}}
										/>
									</Box>
									<InputLabel>Main status</InputLabel>
									<Select
										name="mainStatus"
										value={mainStatus}
										onChange={(e) => {
											props.handleChange(e)
											setMainStatus(e.target.value)
										}}>
										{mainStatusData?.map((data, index) => {
											return (
												<MenuItem key={index} value={data}>
													{data.replace(/_/g, ' ')}
												</MenuItem>
											)
										})}
									</Select>
									<InputLabel>Sub status</InputLabel>
									<Select
										name="subStatus"
										value={subStatus}
										onChange={props.handleChange}
										disabled={subStatusData?.length === 0}>
										{subStatusData?.map((data, index) => {
											return (
												<MenuItem key={index} value={data}>
													{data.replace(/_/g, ' ')}
												</MenuItem>
											)
										})}
									</Select>

									<Box>
										<Typography variant="h6">Enquirer Information</Typography>
										<Divider
											sx={{
												marginTop: -0.5,
												borderBottomWidth: 3,
												borderColor: '#0089D6',
												width: '50px',
											}}
										/>
									</Box>

									<TextField
										label="Name"
										name="enquirerName"
										value={enquirerName}
										onChange={props.handleChange}
										fullWidth></TextField>

									<TextField
										label="Phone number"
										name="enquirerPhone"
										value={enquirerPhone}
										onChange={props.handleChange}
										fullWidth
										sx={{ marginBottom: 2 }}></TextField>
									<Box>
										<Typography variant="h6">Patient Information</Typography>
										<Divider
											sx={{
												marginTop: -0.5,
												borderBottomWidth: 3,
												borderColor: '#0089D6',
												width: '50px',
											}}
										/>
									</Box>

									<Field
										name="patientCountry"
										label="country"
										component={CountryComponent}
										value={patientCountryName}
										onChange={props.handleChange}
									/>

									<Box>
										<Typography variant="h6">Additional Information</Typography>
										<Divider
											sx={{
												marginTop: -0.5,
												borderBottomWidth: 3,
												borderColor: '#0089D6',
												width: '50px',
											}}
										/>
									</Box>

									<Field
										name="category"
										label="category"
										component={CategoryComponent}
										value={categoryName}
										onChange={props.handleChange}></Field>

									<FormControl fullWidth size="small">
										<InputLabel style={{ backgroundColor: 'white' }}>Tier</InputLabel>
										<Select label="Tier" name="tier" value={tier} onChange={props.handleChange}>
											<MenuItem value="HOT">Hot</MenuItem>
											<MenuItem value="WARM">Warm</MenuItem>
											<MenuItem value="COLD">Cold</MenuItem>
										</Select>
									</FormControl>

									<TextField label="Lead id" name="leadId" value={leadId} onChange={props.handleChange} fullWidth />

									<FormControl fullWidth size="small">
										<InputLabel style={{ backgroundColor: 'white' }}>Treatment intensity</InputLabel>
										<Select
											label="Treatment Intensity"
											name="treatmentIntensity"
											value={treatmentIntensity}
											onChange={props.handleChange}>
											<MenuItem value="Low">Low</MenuItem>
											<MenuItem value="Medium">Medium</MenuItem>
											<MenuItem value="High">High</MenuItem>
										</Select>
									</FormControl>
								</Stack>
								<Box display="flex" justifyContent="center">
									<Button
										onClick={handleClearFilter}
										fullWidth
										variant="contained"
										style={{
											backgroundColor: '#616161',
											borderRadius: 0,
											height: '50px',
											fontSize: '16px',
										}}>
										Clear Filter
									</Button>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										style={{
											borderRadius: 0,
											height: '50px',
											fontSize: '16px',
										}}>
										Search
									</Button>
								</Box>
							</Form>
						)
					}}
				</Formik>
			</Drawer>
		</>
	)
}

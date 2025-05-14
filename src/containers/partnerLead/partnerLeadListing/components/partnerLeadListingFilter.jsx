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
import CategoryComponent from '../../../leads/components/categoryComponent'
import CountryComponent from '../../../leads/components/countryComponent'
import Stack from '@mui/material/Stack'
import PropTypes from 'prop-types'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
// import { Checkbox } from 'formik-mui'

function FilterComponent(props) {
	// const mainStatusData = ['OPEN', 'RINGING', 'CONNECTED', 'WARM', 'COLD', 'CLOSE']
	const [mainStatusData, setMainStatusData] = useState([])
	const [subStatusData, setSubStatusData] = useState()
	const [mainStatus, setMainStatus] = useState()
	const [ppcWebsite, setPpcWebsite] = useState()
	const [ppcWebsiteData, setPpcWebsiteData] = useState()
	const matches = useMediaQuery('(min-width: 600px)')
	const filterItems = useSelector((state) => state.partnerLeadListingFilter)
	const initialValues = {
		leadGeneratedDateFrom: filterItems?.leadGeneratedDateFrom?.value ? filterItems?.leadGeneratedDateFrom?.value : '',
		leadGeneratedDateTo: filterItems?.leadGeneratedDateTo?.value ? filterItems?.leadGeneratedDateTo?.value : '',

		leadId: filterItems?.leadId?.value ? filterItems?.leadId?.value : '',

		mainStatus: filterItems?.mainStatus?.value ? filterItems?.mainStatus?.value : '',
		subStatus: filterItems?.subStatus?.value ? filterItems?.subStatus?.value : '',

		enquirerName: filterItems?.enquirerName?.value ? filterItems?.enquirerName?.value : '',
		enquirerPhone: filterItems?.enquirerPhone?.value ? filterItems?.enquirerPhone?.value : '',

		patientName: filterItems?.patientName?.value ? filterItems?.patientName?.value : '',
		patientGender: filterItems?.patientGender?.value ? filterItems?.patientGender?.value : '',
		patientDob: filterItems?.patientDob?.value ? filterItems?.patientDob?.value : '',
		patientCountry: filterItems?.patientCountry?.value ? filterItems?.patientCountry?.value : '',
		patientStateName: filterItems?.patientStateName?.value ? filterItems?.patientStateName?.value : '',
		patientIsInternationalOnly: filterItems?.patientIsInternationalOnly?.value ? filterItems?.patientIsInternationalOnly?.value : false,

		ppcWebsite: filterItems?.ppcWebsite?.value ? filterItems?.ppcWebsite?.value : '',
		category: filterItems?.category?.value ? filterItems?.category?.value : '',
		tier: filterItems?.tier?.value ? filterItems?.tier?.value : '',
		leadSource: filterItems?.leadSource?.value ? filterItems?.leadSource?.value : '',
		treatmentIntensity: filterItems?.treatmentIntensity?.value ? filterItems?.treatmentIntensity?.value : '',
	}
	useEffect(() => {
		axios
			.get(`sales/leads/doctor-leads/statuses`)
			.then((res) => {
				setMainStatusData(res?.data?.data)
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}, [])
	const handleSubmit = (values) => {
		props.onSubmit(values)
		props.onClose()
	}

	const handleClearFilter = () => {
		props.handleClearFilter()
	}

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
				<AppBar sx={{ mt: -1 }} position="static">
					<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<IconButton onClick={props.onClose} size="large" edge="start" color="inherit" aria-label="back">
							<ArrowBackIosNewIcon />
						</IconButton>
						<Typography variant="h6" component="div">
							Advanced Filter
						</Typography>
						<Box></Box>
					</Toolbar>
				</AppBar>
				<Box sx={{ flexGrow: 1 }}>
					<Formik initialValues={initialValues} onSubmit={handleSubmit}>
						{(props) => {
							const {
								leadGeneratedDateFrom,
								leadGeneratedDateTo,
								// leadId,
								mainStatus,
								// enquirerName,
								// enquirerPhone,
								partnerName,
								// patientGender,
								// patientCountryName,
								// patientIsInternationalOnly,
								// ppcWebsite,
								// category,
								// categoryName,
								leadSource,
								tier,
								// treatmentIntensity,
							} = props.values
							return (
								<Form>
									<Stack spacing={2} sx={{ p: 1.5, marginBottom: 2 }}>
										<Grid container spacing={4}>
											<Grid item xs={12} md={6}>
												<TextField
													name="leadGeneratedDateFrom"
													label="From"
													type="date"
													InputLabelProps={{
														shrink: true,
													}}
													value={leadGeneratedDateFrom}
													onChange={props.handleChange}
													fullWidth
												/>
											</Grid>
											<Grid item xs={12} md={6}>
												<TextField
													name="leadGeneratedDateTo"
													label="To"
													type="date"
													InputLabelProps={{
														shrink: true,
													}}
													value={leadGeneratedDateTo}
													onChange={props.handleChange}
													fullWidth
												/>
											</Grid>
										</Grid>

										<TextField
											name="partnerName"
											value={partnerName}
											label="Name"
											onChange={props.handleChange}
											fullWidth
										/>

										<FormControl fullWidth size="small">
											<InputLabel>Status</InputLabel>
											<Select
												name="mainStatus"
												value={mainStatus}
												label="Status"
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
										</FormControl>

										{/* <TextField
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
									</Box>*/}

										{/*
									<Field
										name="patientCountry"
										label="country"
										component={CountryComponent}
										value={patientCountryName}
										onChange={props.handleChange}
									/>
									<FormControlLabel
										name="patientIsInternationalOnly"
										control={<Checkbox name="patientIsInternationalOnly" value={patientIsInternationalOnly} />}
										label="International Only"
										onChange={props.handleChange}
									/>

									<FormControl fullWidth size="small">
										<InputLabel style={{ backgroundColor: 'white' }}>Gender</InputLabel>
										<Select
											name="patientGender"
											value={patientGender}
											label="patientGender"
											onChange={props.handleChange}>
											<MenuItem value="F">Female</MenuItem>
											<MenuItem value="M">Male</MenuItem>
										</Select>
									</FormControl>

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

									<InputLabel>PPC Facility</InputLabel>
									<Select
										name="ppcWebsite"
										value={ppcWebsite}
										onChange={(e) => {
											props.handleChange(e)
											setPpcWebsite(e.target.value)
										}}>
										{ppcWebsiteData?.map((data, index) => {
											return (
												<MenuItem key={index} value={data}>
													{data.replace(/_/g, ' ')}
												</MenuItem>
											)
										})}
									</Select>

									<Field
										name="category"
										label="category"
										component={CategoryComponent}
										value={categoryName}
										onChange={props.handleChange}></Field>
									*/}

										<FormControl fullWidth size="small">
											<InputLabel style={{ backgroundColor: 'white' }}>Tier</InputLabel>
											<Select label="Tier" name="tier" value={tier} onChange={props.handleChange}>
												<MenuItem value="HOT">Hot</MenuItem>
												<MenuItem value="WARM">Warm</MenuItem>
												<MenuItem value="COLD">Cold</MenuItem>
											</Select>
										</FormControl>

										{/*
									<TextField label="Lead id" name="leadId" value={leadId} onChange={props.handleChange} fullWidth />

									*/}

										<FormControl fullWidth size="small">
											<InputLabel>Lead source</InputLabel>
											<Select label="Lead Source" name="leadSource" value={leadSource} onChange={props.handleChange}>
												<MenuItem value="WEB_SEO">WEB SEO</MenuItem>
												<MenuItem value="FB">FB</MenuItem>
												<MenuItem value="GMB">GMB</MenuItem>
												<MenuItem value="DIGITAL">DIGITAL</MenuItem>
												<MenuItem value="Doctor_OnBoarding">Doctor OnBoarding</MenuItem>
												<MenuItem value="Other">Other</MenuItem>
											</Select>
										</FormControl>

										{/*
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
									</FormControl> */}
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
				</Box>
			</Drawer>
		</>
	)
}

FilterComponent.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
}

FilterComponent.defaultProps = {
	open: false,
	onClose: () => {},
}

export default FilterComponent

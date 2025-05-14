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
import SpecializationComponent from '../../components/specializationComponent'
import ServiceComponent from '../../components/serviceComponent'
import CountryComponent from '../../components/countryComponent'
import Stack from '@mui/material/Stack'
import PropTypes from 'prop-types'
import axios from '../../../../shared/axios'
// import { Checkbox } from 'formik-mui'

function FilterComponent(props) {
	const [mainStatusData, setMainStatusData] = useState()
	const [subStatusData, setSubStatusData] = useState()
	const [mainStatus, setMainStatus] = useState()
	const [ppcWebsite, setPpcWebsite] = useState()
	const [ppcWebsiteData, setPpcWebsiteData] = useState()
	const matches = useMediaQuery('(min-width: 600px)')
	const filterItems = useSelector((state) => state.filter)
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

	const patientCountryName = filterItems?.patientCountry?.name ? filterItems?.patientCountry?.name : ''
	const categoryName = filterItems?.category?.name ? filterItems?.category?.name : ''

	const handleSubmit = (values) => {
		props.onSubmit(values)
		props.onClose()
	}

	const fetchMainStatusData = () => {
		axios.get(`sales/leads/statuses`).then((res) => {
			setMainStatusData(res.data.data)
		})
	}

	const fetchPpcWebsiteData = () => {
		axios.get(`sales/leads/ppc-websites`).then((res) => {
			setPpcWebsiteData(res.data.data)
		})
	}

	const handleClearFilter = () => {
		props.handleClearFilter()
	}

	useEffect(() => {
		fetchMainStatusData()
		fetchPpcWebsiteData()
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
								Advanced Filter
							</Typography>
							<Box></Box>
						</Toolbar>
					</AppBar>
				</Box>
				<Formik initialValues={initialValues} onSubmit={handleSubmit}>
					{(props) => {
						const {
							leadGeneratedDateFrom,
							leadGeneratedDateTo,
							leadId,
							mainStatus,
							subStatus,
							enquirerName,
							enquirerPhone,
							patientName,
							patientGender,
							patientCountryName,
							patientIsInternationalOnly,
							ppcWebsite,
							category,
							categoryName,
							specializationName,
							serviceName,
							tier,
							leadSource,
							treatmentIntensity,
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
									<TextField
										name="patientName"
										value={patientName}
										label="Name"
										onChange={props.handleChange}
										fullWidth></TextField>
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

									<Field
										name="specialization"
										label="specialization"
										component={SpecializationComponent}
										value={specializationName}
										onChange={props.handleChange}
									/>
									<Field
										name="service"
										label="service"
										component={ServiceComponent}
										value={serviceName}
										onChange={props.handleChange}
									/>
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
										<InputLabel style={{ backgroundColor: 'white' }}>Lead source</InputLabel>
										<Select label="Lead Source" name="leadSource" value={leadSource} onChange={props.handleChange}>
											<MenuItem value="WEB_SEO">Web SEO</MenuItem>
											<MenuItem value="WEB_SEO_MANUAL">Web SEO Manual</MenuItem>
											<MenuItem value="PPC_MANUAL">PPC Manual</MenuItem>
											<MenuItem value="PPC">PPC</MenuItem>
											<MenuItem value="REFERRAL">Referral</MenuItem>
											<MenuItem value="CLIENT_SEO">Client SEO</MenuItem>
											<MenuItem value="CLIENT_SEO_MANUAL">Client SEO Manual</MenuItem>
											<MenuItem value="CLIENT_PPC">Client PPC</MenuItem>
											<MenuItem value="CLIENT_PPC_MANUAL">Client PPC Manual</MenuItem>
											<MenuItem value="CLIENT_FB">Client FB</MenuItem>
											<MenuItem value="CLIENT_GMB">Client GMB</MenuItem>
											<MenuItem value="CLIENT_SEO_MANUAL">Client SEO Manual</MenuItem>
											<MenuItem value="CLIENT_PPC">Client PPC</MenuItem>
											<MenuItem value="CLIENT_PPC_MANUAL">Client PPC Manual</MenuItem>
											<MenuItem value="CLIENT_FB">Client FB</MenuItem>
											<MenuItem value="PARTNER_SEO">Partner SEO</MenuItem>
											<MenuItem value="PARTNER_SEO_MANUAL">Partner SEO Manual</MenuItem>
											<MenuItem value="PARTNER_PPC">Partner PPC</MenuItem>
											<MenuItem value="PARTNER_PPC_MANUAL">Partner PPC Manual</MenuItem>
											<MenuItem value="PARTNER_GMB">Partner GMB</MenuItem>
											<MenuItem value="PARTNER_CALL">Partner Call</MenuItem>
											<MenuItem value="PARTNER_DOM_FB">Partner Domestic FB</MenuItem>
											<MenuItem value="PARTNER_INT_FB">Partner International FB</MenuItem>
											<MenuItem value="PARTNER_MANUAL">Partner Manual</MenuItem>
										</Select>
									</FormControl>
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

FilterComponent.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
}

FilterComponent.defaultProps = {
	open: false,
	onClose: () => {},
}

export default FilterComponent

/* eslint-disable no-unused-vars */
// React
import { useEffect, useState } from 'react'
// MUI Components
import { Box, Modal, Typography, Select, MenuItem, Button, Grid, TextField, FormControl, InputLabel, Autocomplete } from '@mui/material'
//Redux
import { useSelector } from 'react-redux'
import { Source } from '@mui/icons-material'

// import { useState } from 'react'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	width: '60%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	p: 4,
}

export default function ArrivalSheetFilterModal(props) {
	const open = props.open
	const onClose = props.onClose
	// const isAdmin = props.isAdmin
	const advisorList = props.advisorList
	// const arrivalSheetFilter = props.arrivalSheetFilter
	// const [advisors, setAdvisors] = useState([])
	const facilityList = props.facilityList
	const countryList = props.countryList
	const arrivalSheetFilter = props.arrivalSheetFilter

	const [leadID, setLeadID] = useState(null)
	const [patientName, setPatientName] = useState(null)
	// const [treatmentHospital, setTreatmentHospital] = useState(null)
	// const [patientCountry, setPatientCountry] = useState(null)
	const [arrivalFromDate, setarrivalFromDate] = useState(null)
	const [arrivalToDate, setarrivalToDate] = useState(null)
	// const [leadArrivalType, setLeadArrivalType] = useState(null)
	const [leadStatus, setLeadStatus] = useState(null)
	// const [secondaryAdvisorID, setSecondaryAdvisorID] = useState(null)
	const [fieldPerson, setFieldPerson] = useState(null)
	const [leadSource, setLeadSource] = useState(null)
	const [leadType, setLeadType] = useState(null)
	const [visaExpiryarrivalFromDate, setVisaExpiryarrivalFromDate] = useState(null)
	const [visaExpiryarrivalToDate, setVisaExpiryarrivalToDate] = useState(null)
	const [advisors, setAdvisors] = useState(null)
	const [facility, setFacility] = useState(null)
	const [country, setCountry] = useState(null)
	const [fromDate, setFromDate] = useState(null)
	const [toDate, setToDate] = useState(null)

	const applyFilter = () => {
		let advisorID = null
		if (advisors) {
			advisorID = advisors.id
		}

		let facilityID = null
		if (facility) {
			facilityID = facility.id
		}

		let patientCountryID = null
		if (country) {
			patientCountryID = country.id
		}

		const payload = {
			arrival_date_from: arrivalFromDate,
			arrival_date_to: arrivalToDate,
			arrival_type: leadType,
			status: leadStatus,
			facility_id: facilityID,
			field_person_name: fieldPerson,
			lead_id: leadID || null,
			patient_country_id: patientCountryID,
			patient_name: patientName,
			visa_expiry_date_from: visaExpiryarrivalFromDate,
			visa_expiry_date_to: visaExpiryarrivalToDate,
			emp_ids: advisorID,
			source_url: leadSource,
			lead_date_from: fromDate,
			lead_date_to: toDate,
		}
		props.applyFilter(payload)
	}
	const clearFilter = () => {
		props.clearFilter()
	}

	useEffect(() => {
		setLeadID(arrivalSheetFilter.lead_id)
		setPatientName(arrivalSheetFilter.patient_name)
		setFacility(() => {
			const facilityName = facilityList.filter((facility) => {
				return facility.id === arrivalSheetFilter.facility_id
			})
			return facilityName[0]
		})
		setCountry(() => {
			const countryName = countryList.filter((country) => {
				return country.id === arrivalSheetFilter.patient_country_id
			})
			return countryName[0]
		})
		setAdvisors(() => {
			const advisorName = advisorList.filter((advisor) => {
				return advisor.id === arrivalSheetFilter.emp_ids
			})
			return advisorName[0]
		})
		setarrivalFromDate(arrivalSheetFilter.arrival_date_from)
		setarrivalToDate(arrivalSheetFilter.arrival_date_to)
		setLeadType(arrivalSheetFilter.arrival_type)
		setLeadStatus(arrivalSheetFilter.status)
		setLeadSource(arrivalSheetFilter.source_url)
		setFieldPerson(arrivalSheetFilter.field_person_name)
		setVisaExpiryarrivalFromDate(arrivalSheetFilter.visa_expiry_date_from)
		setVisaExpiryarrivalToDate(arrivalSheetFilter.visa_expiry_date_to)
		setFromDate(arrivalSheetFilter.lead_date_from)
		setToDate(arrivalSheetFilter.lead_date_to)
	}, [open, arrivalSheetFilter])

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style} display="flex" flexDirection="column" alignItems="center">
				<Typography variant="h6" mb={4}>
					Arrival Sheet Filters
				</Typography>
				<Grid container mb={4} spacing={2}>
					<Grid item xs={12} md={6}>
						<TextField
							value={fromDate}
							size="small"
							name="FromDate"
							label="From"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setFromDate(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							value={toDate}
							size="small"
							name="toDate"
							label="to"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setToDate(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							value={arrivalFromDate}
							size="small"
							name="arrivalFromDate"
							label="Arrival From"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setarrivalFromDate(event.target.value)}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							value={arrivalToDate}
							size="small"
							name="arrivalToDate"
							label="Arrival To"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setarrivalToDate(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							value={visaExpiryarrivalFromDate}
							size="small"
							name="visaExpiryarrivalFromDate"
							label="Visa Expiry From"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setVisaExpiryarrivalFromDate(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							value={visaExpiryarrivalToDate}
							size="small"
							name="visaExpiryarrivalToDate"
							label="Visa Expiry To"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setVisaExpiryarrivalToDate(event.target.value)}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<TextField
							label="Lead ID"
							value={leadID}
							id="outlined-size-small"
							// type="number"
							size="small"
							onChange={(event) => {
								setLeadID(event.target.value)
							}}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Patient Name"
							value={patientName}
							id="outlined-size-small"
							size="small"
							onChange={(event) => {
								setPatientName(event.target.value)
							}}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							size="small"
							value={facility}
							options={facilityList}
							onChange={(event, value) => setFacility(value)}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => <TextField {...params} label="Hospitals" />}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth size="small">
							<InputLabel style={{ backgroundColor: 'white' }}>Lead Type</InputLabel>
							<Select
								value={leadType === null ? 'ALL' : leadType}
								label="Lead Type"
								name="leadType"
								onChange={(event) => (event.target.value === 'ALL' ? setLeadType(null) : setLeadType(event.target.value))}>
								<MenuItem value="ALL">All</MenuItem>
								<MenuItem value="FRESH">Fresh</MenuItem>
								<MenuItem value="REPEAT">Repeat</MenuItem>
								<MenuItem value="REFFERAL">Refferal</MenuItem>
								<MenuItem value="REPEAT-REFFERAL">Repeat-Refferal</MenuItem>
								<MenuItem value="ATTENDANT">Attendant</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth size="small">
							<InputLabel style={{ backgroundColor: 'white' }}>Status</InputLabel>
							<Select
								value={leadStatus}
								label="Status"
								name="leadStatus"
								onChange={(event) => setLeadStatus(event.target.value)}>
								<MenuItem value="IP">IP</MenuItem>
								<MenuItem value="OP">OP</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Field Person"
							id="outlined-size-small"
							value={fieldPerson}
							size="small"
							onChange={(event) => {
								setFieldPerson(event.target.value)
							}}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							label="Source"
							value={leadSource}
							id="outlined-size-small"
							size="small"
							onChange={(event) => {
								setLeadSource(event.target.value)
							}}
							fullWidth
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							size="small"
							value={country}
							options={countryList}
							onChange={(event, value) => setCountry(value)}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => <TextField {...params} label="Patient Country" />}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							size="small"
							value={advisors}
							options={advisorList}
							onChange={(event, value) => setAdvisors(value)}
							getOptionLabel={(option) => option.full_name}
							renderInput={(params) => <TextField {...params} label="Advisors" />}
						/>
					</Grid>
				</Grid>
				<Box display="flex" justifyContent="end" gap={4} sx={{ width: '100%' }}>
					<Button
						variant="contained"
						color="error"
						sx={{ paddingX: 4, textTransform: 'none', fontWeight: 510 }}
						onClick={clearFilter}>
						Clear
					</Button>
					<Button variant="contained" sx={{ paddingX: 4, textTransform: 'none', fontWeight: 510 }} onClick={applyFilter}>
						Apply
					</Button>
				</Box>

				{/* <Select value={tier} onChange={(event) => handleTierChange(event)} sx={{ width: '100%', marginBottom: 5 }}>
					<MenuItem value="Cold">Cold</MenuItem>
					<MenuItem value="Warm">Warm</MenuItem>
					<MenuItem value="Hot">Hot</MenuItem>
				</Select> */}

				{/* <Button variant="contained" onClick={updateTier}>
					Save
				</Button> */}
			</Box>
		</Modal>
	)
}

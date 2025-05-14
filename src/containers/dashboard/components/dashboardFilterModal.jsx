/* eslint-disable no-unused-vars */
// React
import { useEffect, useState } from 'react'
// MUI Components
import {
	Box,
	Modal,
	Typography,
	Select,
	MenuItem,
	Button,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Autocomplete,
	Checkbox,
	FormControlLabel,
} from '@mui/material'

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

export default function DashboardFilterModal(props) {
	const open = props.open
	const [isModalOpen, setIsModalOpen] = useState(false)
	const onClose = props.onClose
	const advisorList = props.advisorList
	const isAdmin = props.isAdmin
	const dashboardFilter = props.dashboardFilter
	const [fromDate, setFromDate] = useState(null)
	const [toDate, setToDate] = useState(null)
	const [leadSource, setLeadSource] = useState(null)
	const [treatmentCountry, setTreatmentCountry] = useState(null)
	const [advisors, setAdvisors] = useState([])
	const [international, setInternational] = useState(false)

	const applyFilter = () => {
		let advisorIDs = ''
		advisors.forEach((element, index) => {
			advisorIDs += element.id
			if (index !== advisors.length - 1) {
				advisorIDs += ','
			}
		})
		const payload = {
			lead_date_from: fromDate,
			lead_date_to: toDate,
			lead_source: leadSource,
			treatment_country: treatmentCountry,
			emp_ids: advisorIDs,
			only_international_leads: international,
		}
		props.applyFilter(payload)
		setFromDate(null)
		setToDate(null)
		setLeadSource(null)
		setTreatmentCountry(null)
		setAdvisors([])
	}
	const clearFilter = () => {
		props.clearFilter()
	}
	useEffect(() => {
		setFromDate(dashboardFilter.lead_date_from)
		setToDate(dashboardFilter.lead_date_to)
		setLeadSource(dashboardFilter.lead_source)
		setTreatmentCountry(dashboardFilter.treatment_country)
		// setAdvisors(dashboardFilter.emp_id || [])
		setInternational(dashboardFilter.only_international_leads)
		setIsModalOpen(open)
	}, [open])

	return (
		<Modal open={isModalOpen} onClose={onClose}>
			<Box sx={style} display="flex" flexDirection="column" alignItems="center">
				<Typography variant="h6" mb={4}>
					Dashboard Filters
				</Typography>
				<Grid container mb={4} spacing={2}>
					<Grid item xs={12} md={6}>
						<TextField
							value={fromDate}
							size="small"
							name="fromDate"
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
							label="To"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							onChange={(event) => setToDate(event.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth size="small">
							<InputLabel style={{ backgroundColor: 'white' }}>Lead source</InputLabel>
							<Select
								value={leadSource}
								label="Lead Source"
								name="leadSource"
								onChange={(event) => setLeadSource(event.target.value)}>
								<MenuItem value="WEB_SEO">Web SEO</MenuItem>
								<MenuItem value="WEB_SEO_MANUAL">Web SEO Manual</MenuItem>
								<MenuItem value="PPC_MANUAL">PPC Manual</MenuItem>
								<MenuItem value="PPC">PPC</MenuItem>
								<MenuItem value="REFERRAL">Referral</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl fullWidth size="small">
							<InputLabel>Country of Treatment</InputLabel>
							<Select
								value={treatmentCountry}
								label="Country of Treatment"
								name="treatmentCountry"
								onChange={(event) => setTreatmentCountry(event.target.value)}>
								<MenuItem value="India">India</MenuItem>
								<MenuItem value="Turkey">Turkey</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					{isAdmin ? (
						<Grid item xs={12} md={6}>
							<Autocomplete
								multiple
								size="small"
								options={advisorList}
								onChange={(event, value) => setAdvisors(value)}
								getOptionLabel={(option) => option.full_name}
								renderInput={(params) => <TextField {...params} label="Advisors" />}
							/>
						</Grid>
					) : (
						''
					)}
					<Grid item xs={12} md={6}>
						<FormControlLabel
							control={<Checkbox checked={international} />}
							label="International"
							onChange={(event, value) => {
								setInternational(value)
							}}
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

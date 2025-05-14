/* eslint-disable no-unused-vars*/
/* eslint-disable no-useless-escape*/
import React, { useEffect, useState } from 'react'
import {
	Box,
	Typography,
	Autocomplete,
	Checkbox,
	Button,
	TextField,
	Grid,
	IconButton,
	InputAdornment,
	FormGroup,
	FormControlLabel,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material'
import axios from '../../../shared/axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
// MUI Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
// Global Components
import CircularLoader from '../../../components/common/loader/circularLoader'
import { useSelector } from 'react-redux'
export default function PartnerLeadAddPage() {
	const user = useSelector((state) => state.user)
	const navigate = useNavigate()
	const { lead_id } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	// Input Elements
	const [name, setName] = useState(null)
	const [phone, setPhone] = useState(null)
	const [email, setEmail] = useState(null)
	const [state, setState] = useState(null)
	const [city, setCity] = useState(null)
	const [message, setMessage] = useState(null)
	const [specialization, setSpecialization] = useState(null)
	const [fromDate, setFromDate] = useState(null)
	const [toDate, setToDate] = useState(null)
	const [amount, setAmount] = useState(null)
	const [linkExchange, setLinkExchange] = useState(false)
	const [backlink, setBacklink] = useState(null)
	const [doctorID, setDoctorID] = useState(null)
	const [widget, setWidget] = useState(false)
	const [pagesSold, setPagesSold] = useState([
		{
			url: null,
		},
	])
	const [source, setSource] = useState(null)
	// Dropdown Values
	const [statesList, setStatesList] = useState([])
	const [citiesList, setCitiesList] = useState([])
	const [specializationList, setSpecializationList] = useState([])
	// Fetch Data
	const fetchPartnerLeadEditData = () => {
		const url = `/sales/leads/doctor-leads/${lead_id}`
		axios.get(url).then((res) => {
			setName(res.data.data.doctor.name)
			setPhone(res.data.data.doctor.phone)
			setEmail(res.data.data.doctor.email)
			setState(res.data.data.state)
			setCity(res.data.data.city)
			setSpecialization(res.data.data.specialization)
			setFromDate(res.data.data.listing_duration_from_date)
			setToDate(res.data.data.listing_duration_to_date)
			setAmount(res.data.data.amount)
			setLinkExchange(res.data.data.link_exchange === 1 ? true : false)
			setBacklink(res.data.data.back_link)
			setDoctorID(res.data.data.doctor_profile_id)
			setWidget(res.data.data.iframe === 1)
			setPagesSold(res.data.data.pages_sold)
			setMessage(res.data.data.additional_information.message)
			setSource(res.data.data.additional_information.source)
			setIsLoading(false)
		})
	}
	const fetchStatesList = () => {
		axios.get(`search/state?country_id=101&name`).then((res) => {
			setStatesList(res.data.data)
		})
	}
	const fetchCitiesList = () => {
		axios.get(`search/city?country_id=101&state_id=${state.id}&name`).then((res) => {
			setCitiesList(res.data.data)
		})
	}

	const fetchSpecializationlist = () => {
		axios.get('/search/specialization?name=').then((res) => {
			setSpecializationList(res.data.data)
		})
	}
	// Use Effects
	useEffect(() => {
		fetchStatesList()
		fetchSpecializationlist()
		if (lead_id) {
			fetchPartnerLeadEditData()
		} else {
			setIsLoading(false)
		}
	}, [])
	useEffect(() => {
		if (state) {
			fetchCitiesList()
		}
	}, [state])

	// Event Handler Functions
	const handleURLChange = (value, index) => {
		const values = [...pagesSold]
		values[index].url = value
		setPagesSold(values)
	}
	const addURLCard = () => {
		setPagesSold([...pagesSold, { url: '' }])
	}
	const deleteURLCard = (index) => {
		const values = pagesSold.filter((pagesSoldObj, i) => {
			return index != i
		})
		setPagesSold(values)
	}
	// Validation Functions
	const validateEmail = (emailString) => {
		return String(emailString)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	}
	const validateURL = (urlString) => {
		var res = urlString.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
		if (res == null) return false
		else return true
	}
	const hasOnlyNumbers = (str) => {
		return /^\+?\d+$/.test(str)
	}
	const nameValidation = (str) => {
		return /^[a-zA-Z ]{2,30}$/.test(str) // * Name field will only accept alphabets and space character. There should be a minimum of 2 characters and a maximum of 30 characters
	}
	const pagesSoldValidation = () => {
		let isPagesSoldValidate = true
		for (let i = 0; i < pagesSold.length; i++) {
			if (pagesSold[i].url && pagesSold[i].url.charAt(0) !== '/') {
				return false
			}
		}
		return true
	}
	// Submit Function
	const handleSubmit = () => {
		if (!name) {
			toast.error('Name is required', {
				position: 'bottom-left',
			})
		} else if (!nameValidation(name)) {
			toast.error('Name cannot contain digits or special characters', {
				position: 'bottom-left',
			})
		}
		// else if (!email) {
		// 	toast.error('Email is required', {
		// 		position: 'bottom-left',
		// 	})
		// }
		else if (email && !validateEmail(email)) {
			toast.error('Please enter a valid email', {
				position: 'bottom-left',
			})
		} else if (!phone) {
			toast.error('Phone Number is required', {
				position: 'bottom-left',
			})
		} else if (!hasOnlyNumbers(phone)) {
			toast.error('Please enter a valid phone number', {
				position: 'bottom-left',
			})
		} else if (!city) {
			toast.error('City is required', {
				position: 'bottom-left',
			})
		}
		// else if (!specialization) {
		// 	toast.error('Specialization is required', {
		// 		position: 'bottom-left',
		// 	})
		// } else if (!fromDate) {
		// 	toast.error('From Date is required', {
		// 		position: 'bottom-left',
		// 	})
		// } else if (!toDate) {
		// 	toast.error('To Date is required', {
		// 		position: 'bottom-left',
		// 	})
		// } else if (!amount) {
		// 	toast.error('Amount is required', {
		// 		position: 'bottom-left',
		// 	})
		// }
		else if (amount && !hasOnlyNumbers(amount)) {
			toast.error('The amount should contain only digits', {
				position: 'bottom-left',
			})
		} else if (linkExchange && !backlink) {
			toast.error('Backlink is required', {
				position: 'bottom-left',
			})
		} else if (linkExchange && !validateURL(backlink)) {
			toast.error('Please enter a valid backlink', {
				position: 'bottom-left',
			})
		} else if (doctorID && !hasOnlyNumbers(doctorID)) {
			toast.error('Please enter a valid doctor id', {
				position: 'bottom-left',
			})
		}
		// else if (pagesSold.length === 0) {
		// 	toast.error('There should be atleast one URL', {
		// 		position: 'bottom-left',
		// 	})
		// }
		else if (pagesSold.length > 0 && !pagesSoldValidation()) {
			toast.error('The URL should begin with /', {
				position: 'bottom-left',
			})
		} else if (!source) {
			toast.error('Source is required', {
				position: 'bottom-left',
			})
		}
		// else if (!message) {
		// 	toast.error('Message is required', {
		// 		position: 'bottom-left',
		// 	})
		// }
		else {
			const payload = {
				name: name,
				email: email,
				phone: phone,
				city_id: city.id,
				message: message,
				specialization_id: specialization?.id,
				pages_sold: pagesSold,
				listing_duration_from_date: fromDate,
				listing_duration_to_date: toDate,
				amount: amount,
				link_exchange: linkExchange ? 1 : 0,
				back_link: backlink,
				source: source,
				iframe: widget ? 1 : 0,
				doctor_profile_id: doctorID,
			}
			if (location.pathname.includes('/edit')) {
				axios
					.put(`sales/leads/doctor-leads/${lead_id}`, payload)
					.then((res) => {
						toast.success('Successfully Submitted', {
							position: 'bottom-left',
						})
						setTimeout(() => {
							navigate(`/business-partner/doctor/${lead_id}`)
						}, 2000)
					})
					.catch((error) => {
						toast.error('Error', {
							position: 'bottom-left',
						})
					})
			} else {
				axios
					.post('sales/leads/doctor-leads', payload)
					.then((res) => {
						toast.success('Successfully Submitted', {
							position: 'bottom-left',
						})
						setTimeout(() => {
							navigate(`/business-partner/doctor/${res.data?.data}`)
						}, 2000)
					})
					.catch((error) => {
						toast.error('Error', {
							position: 'bottom-left',
						})
					})
			}
		}
	}
	return (
		<>
			<Box display="flex" width="100%" justifyContent="center">
				{isLoading ? (
					<CircularLoader />
				) : (
					<Box display="flex" width="45%" flexDirection="column" justifyContent="center" gap={2} py={2}>
						<Typography variant="h5">Add Doctor Details</Typography>
						<TextField label="Name*" value={name} onChange={(e) => setName(e.target.value)} />
						<TextField label="Phone*" value={phone} onChange={(e) => setPhone(e.target.value)} />
						<TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Autocomplete
							name="state"
							options={statesList}
							getOptionLabel={(option) => option.name}
							value={state ? state : null}
							onChange={(event, value) => {
								setState(value)
							}}
							renderInput={(props) => {
								return <TextField {...props} label="State*" fullWidth />
							}}
							renderOption={(props, option) => {
								return <li {...props}>{option.name}</li>
							}}
						/>
						<Autocomplete
							id="partnerCity"
							onChange={(event, value) => {
								setCity(value)
							}}
							options={citiesList}
							disabled={!state}
							value={city}
							getOptionLabel={(option) => option?.name}
							renderOption={(props, option) => (
								<Box component="li" {...props}>
									{option.name}
								</Box>
							)}
							renderInput={(params) => <TextField {...params} label="City*" margin="normal" variant="outlined" fullWidth />}
						/>
						<Autocomplete
							id="partnerSpecialization"
							options={specializationList}
							getOptionLabel={(option) => option.name}
							value={specialization}
							onChange={(event, value) => {
								setSpecialization(value)
							}}
							renderOption={(props, option) => (
								<Box component="li" {...props}>
									{option?.name}
								</Box>
							)}
							renderInput={(params) => (
								<TextField {...params} label="Specialization" margin="normal" variant="outlined" fullWidth />
							)}
						/>
						{/* Listing Duration */}
						<Typography variant="h6">Listing Duration</Typography>
						<Grid container spacing={4}>
							<Grid item xs={6}>
								<TextField
									label="From Date"
									type="date"
									InputLabelProps={{
										shrink: true,
									}}
									value={fromDate}
									onChange={(e) => setFromDate(e.target.value)}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label="To Date"
									type="date"
									InputLabelProps={{
										shrink: true,
									}}
									value={toDate}
									onChange={(e) => setToDate(e.target.value)}
									fullWidth
								/>
							</Grid>
						</Grid>

						<TextField
							label="Amount"
							sx={{ mb: 2 }}
							value={amount}
							InputProps={{
								startAdornment: <InputAdornment position="start">₹</InputAdornment>,
							}}
							onChange={(e) => setAmount(e.target.value)}
						/>
						<Box display="flex" justifyContent="space-between">
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											checked={linkExchange}
											onChange={(event, value) => {
												setLinkExchange(value)
											}}
										/>
									}
									label="Link Exchange"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={widget}
											onChange={(event, value) => {
												setWidget(value)
											}}
										/>
									}
									label="Widget"
								/>
							</FormGroup>
							<TextField
								label="Doctor Profile ID"
								sx={{
									'& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
										display: 'none',
									},
									'& input[type=number]': {
										MozAppearance: 'textfield',
									},
								}}
								value={doctorID}
								onChange={(e) => setDoctorID(e.target.value)}
							/>
						</Box>
						{linkExchange && <TextField label="Backlink" value={backlink} onChange={(e) => setBacklink(e.target.value)} />}
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Typography variant="h6">Pages Sold</Typography>
							<IconButton color="primary" sx={{ boxShadow: 2 }} onClick={addURLCard}>
								<AddIcon />
							</IconButton>
						</Box>
						{pagesSold.map((pagesSoldObj, index) => (
							<Grid container key={index} alignItems="center">
								<Grid item xs={11}>
									<TextField
										label="Page URL"
										value={pagesSoldObj.url}
										InputProps={{
											startAdornment: <InputAdornment position="start">www.clinicspots.com</InputAdornment>,
										}}
										onChange={(e) => handleURLChange(e.target.value, index)}
										fullWidth
									/>
								</Grid>
								<Grid item xs={1}>
									<IconButton mx={4} size="large">
										<DeleteIcon
											fontSize="large"
											color="error"
											onClick={() => {
												deleteURLCard(index)
											}}
										/>
									</IconButton>
								</Grid>
							</Grid>
						))}
						{pagesSold.length === 0 && (
							<Typography color="red" fontWeight="medium">
								Please enter at least one Listing URL
							</Typography>
						)}
						<FormControl fullWidth>
							<InputLabel id="lead-source-label">Lead Source*</InputLabel>
							<Select
								labelId="lead-source-label"
								id="lead-source-select"
								label="Lead Source*"
								value={source}
								onChange={(event) => {
									setSource(event.target.value)
								}}>
								<MenuItem value="WEB_SEO">WEB SEO</MenuItem>
								<MenuItem value="FB">FB</MenuItem>
								<MenuItem value="GMB">GMB</MenuItem>
								<MenuItem value="DIGITAL">DIGITAL</MenuItem>
								<MenuItem value="Doctor_OnBoarding">Doctor OnBoarding</MenuItem>
								<MenuItem value="Other">Other</MenuItem>
							</Select>
						</FormControl>
						<TextField label="Message" multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
						<Button variant="contained" size="large" onClick={handleSubmit}>
							Submit
						</Button>
					</Box>
				)}
			</Box>
		</>
	)
}

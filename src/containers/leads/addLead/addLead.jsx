/* eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { Box, Typography, FormHelperText, CardActions, Divider, IconButton, InputAdornment } from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '../../../components/common/textField/textField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Validations } from '../../../shared/validations'
import * as Yup from 'yup'
import Checkbox from '@mui/material/Checkbox'
import SubmitLoadingButton from '../../../components/common/submitLoadingButton/submitLoadingButton'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import axios from '../../../shared/axios'
import { toast } from 'react-toastify'
import Card from '@mui/material/Card'
import { Grid } from '@mui/material'
import CategoryComponent from '../components/categoryComponent'
import FacilityComponents from '../components/facilityComponent'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CountryComponent from '../components/countryComponent'
import CityComponent from '../components/cityComponent'
import FileUploadComponent from './components/fileUploadComponent'
import StateComponent from '../components/stateComponent'
import { ContactMeans } from '../../../utils/contactMeans'
import { useSelector } from 'react-redux'

const getRequestBodyFromFormData = (values) => {
	const medical_reports = values.medicalReports.map((element) => element.id || element)
	const travel = values.travelFiles.map((element) => element.id || element)
	const bills = values.bills.map((element) => element.id || element)
	const others = values.otherFiles.map((element) => element.id || element)
	const attendeeTravelFiles = values.attendeeTravelFiles.map((element) => element.id || element)
	const attendeeOtherFiles = values.attendeeOtherFiles.map((element) => element.id || element)
	const pageTitle = getPageTitle(values.leadSource, values.ppcWebsite, values.client, values.partner)
	if (location.pathname.includes('/edit')) {
		return {
			patient_data: {
				name: values.patientName,
				gender: values.patientGender,
				city_id: values.patientCity,
				state_id: values.patientState,
				country_id: values.patientCountry,
				birth_date: values.patientDob || null,
			},
			lead_data: {
				enquirer_relationship: values.enquirerRelationship || null,
				message: values.message || null,
				enquirer_country_id: values.enquirerCountry,
				preferred_contact_means: values.preferredContactMeans,
				category_id: values.category,
				facility_id: values.facility || null,
				partner_name: values.partnerName || null,
				lead_source:
					values.leadSource === 'CLIENT'
						? values.clientLeadSource
						: values.leadSource === 'PARTNER'
						? values.partnerLeadSource
						: values.leadSource,
				page_title: pageTitle,
				treatment_intensity: values.treatmentIntensity,
				actual_invoice: Number(values.actualInvoice) || null,
				hotel_type: values.hotelType || null,
				registration_number: values.registrationNumber || null,
				estimated_invoice: Number(values.estimatedInvoice) || null,
				hotel_name: values.hotelName || null,
				visa_expiry_at: values.visaExpiryAt || null,
				arrival_at: values.arrivalAt || null,
				field_person_name: values.fieldPersonName || null,
				passport_number: values.passportNumber || null,
				arrival_type: values.arrivalType || null,
			},
			media_data: {
				patient: {
					travel,
					medical_reports,
					bills,
					others,
				},
				patient_attendee: {
					travel: attendeeTravelFiles,
					others: attendeeOtherFiles,
				},
			},
		}
	} else {
		return {
			patient_data: {
				name: values.patientName,
				gender: values.patientGender,
				city_id: values.patientCity || null,
				state_id: values.patientState || null,
				country_id: values.patientCountry,
				birth_date: values.patientDob || null,
			},
			lead_data: {
				enquirer_name: values.enquirerName,
				enquirer_email: values.enquirerEmail || null,
				enquirer_phone: values.enquirerPhone,
				enquirer_relationship: values.enquirerRelationship || null,
				message: values.message || null,
				enquirer_country_id: values.enquirerCountry,
				preferred_contact_means: values.preferredContactMeans,
				category_id: values.category,
				facility_id: values.facility || null,
				partner_name: values.partnerName || null,
				lead_source:
					values.leadSource === 'CLIENT'
						? values.clientLeadSource
						: values.leadSource === 'PARTNER'
						? values.partnerLeadSource
						: values.leadSource,
				page_title: pageTitle,
				treatment_intensity: values.treatmentIntensity,
				arrival_type: values.arrivalType || null,
			},
			media_data: {
				patient: {
					travel,
					medical_reports,
					bills,
					others,
				},
				patient_attendee: {
					travel: attendeeTravelFiles,
					others: attendeeOtherFiles,
				},
			},
		}
	}
}

const getPageTitle = (leadSource, ppcWebsite, client, partner) => {
	if (leadSource === 'PPC_MANUAL') {
		return ppcWebsite
	} else if (leadSource === 'CLIENT') {
		return client
	} else if (leadSource === 'PARTNER') {
		return partner
	}
	return null
}

function TravelFiles(props) {
	return <FileUploadComponent {...props} fileType="travel" />
}

function MedicalReports(props) {
	return <FileUploadComponent {...props} fileType="medical_reports" />
}

function Bills(props) {
	return <FileUploadComponent {...props} fileType="bills" />
}

function OtherFiles(props) {
	return <FileUploadComponent {...props} fileType="others" />
}

const initialValues = {
	enquirerName: '',
	enquirerEmail: '',
	enquirerPhone: '',
	enquirerCountry: '',
	enquirerCountryName: '',
	enquirerRelationship: '',
	preferredContactMeans: '',

	patientName: '',
	patientGender: '',
	patientDob: '',
	patientCity: '',
	patientCityName: '',
	patientCountry: '',
	patientCountryName: '',
	patientState: '',
	patientStateName: '',

	actualInvoice: '' || null,
	registrationNumber: '' || null,
	estimatedInvoice: '' || null,
	hotelName: '' || null,
	visaExpiryAt: '' || null,
	arrivalAt: '' || null,
	fieldPersonName: '' || null,
	passportNumber: '' || null,
	arrivalType: '' || null,
	message: '',
	partnerName: '',
	hotelType: '',
	leadSource: '',
	clientLeadSource: '',
	partnerLeadSource: '',
	client: null,
	partner: null,
	category: null,
	categoryName: '',
	facility: '',
	facilityName: '',
	treatmentIntensity: null,

	travelFiles: [],
	medicalReports: [],
	bills: [],
	otherFiles: [],

	attendeeTravelFiles: [],
	attendeeOtherFiles: [],
}

function AddLead(props) {
	const useLoc = useLocation()
	const navigate = useNavigate()
	const user = useSelector((state) => state.user)
	const { lead_id } = useParams()
	const [errorMessage, setErrorMessage] = useState(null)
	const [open, setOpen] = useState(false)
	const [loading, toggleLoading] = useState(false)
	const [data, setData] = useState(initialValues)
	const [ppcWebsiteData, setPpcWebsiteData] = useState()
	const [clientData, setClientData] = useState([])
	const [partnerData, setPartnerData] = useState([])
	const [checkBoxChecked, setCheckBoxChecked] = useState(false)
	const [hotelTypeList, setHotelTypeList] = useState([])

	const schema = Yup.object({
		enquirerName: Validations.name,
		// enquirerEmail: Validations.email,
		enquirerPhone: Validations.phoneNumber,
		enquirerCountry: Validations.required,
		preferredContactMeans: Validations.required,

		patientName: Validations.name,
		patientGender: Validations.required,
		patientDob: Validations.dateOfBirth,
		patientCountry: Validations.required,
		// patientCity: Validations.required,
		// patientState: Validations.required,
		arrivalType: Validations.required,
		// partner: Validations.required,
		// client: Validations.required,

		leadSource: Validations.required,
		// category: Validations.required,
		// treatmentIntensity: Validations.required,
	})

	const redirectHandler = (path) => {
		navigate(path)
	}

	const handleRedirectPrimaryButton = () => {
		setOpen(false)
		if (user.type.is_client) {
			redirectHandler('/client-leads')
		} else if (user.type.is_mt) {
			redirectHandler('/mt-leads')
		} else if (user.type.is_partner) {
			redirectHandler('/offline/leads')
		} else redirectHandler('/leads')
	}

	const handleRedirectSecondaryButton = () => {
		setOpen(false)
		redirectHandler('/lead/add')
	}

	const handleSubmit = async (values, props) => {
		if (!values.patientGender) {
			setErrorMessage(true)
			return
		} else {
			setErrorMessage(false)
		}
		toggleLoading(true)
		if (!lead_id) {
			await axios
				.post(`/sales/leads/add`, getRequestBodyFromFormData(values))
				.then((res) => {
					if (res?.status === 201) {
						setOpen(true)
						toggleLoading(false)
						props.resetForm({ values: initialValues })
					}
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
					toggleLoading(false)
				})
		} else {
			const updatedValues = { ...values }
			await axios
				.put(`sales/leads/${lead_id}/edit`, getRequestBodyFromFormData(updatedValues))
				.then((res) => {
					if (res?.status === 200) {
						setOpen(true)
						toggleLoading(false)
						props.resetForm({ values: initialValues })
					}
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
					toggleLoading(false)
				})
		}
	}
	const getHotelTypeList = () => {
		axios
			.get('/sales/leads/hotel')
			.then((res) => setHotelTypeList(res.data.data))
			.catch((error) => {
				toast.error(`${error.response.data.data.message}`, {
					position: 'bottom-left',
				})
			})
	}
	useEffect(() => {
		getHotelTypeList()
	}, [])

	const fetchEditData = () => {
		if (lead_id) {
			axios
				.get(`/sales/leads/${lead_id}/show`)
				.then((res) => {
					setData({
						enquirerName: res.data.data.enquirer.name,
						enquirerEmail: res.data.data.enquirer.email,
						enquirerPhone: res.data.data.enquirer.phone,
						enquirerCountry: res.data.data.enquirer.country.id,
						enquirerCountryName: res.data.data.enquirer.country.name,
						enquirerRelationship: res.data.data.enquirer.relationship,
						preferredContactMeans: res.data.data.enquirer.preferred_contact_means,

						patientGender: res.data.data.patient.gender,
						patientName: res.data.data.patient.name,
						patientDob: res.data.data.patient.date_of_birth,
						patientCityName: res.data.data.patient.city.name,
						patientCity: res.data.data.patient.city.id,
						patientState: res.data.data.patient.state.id,
						patientStateName: res.data.data.patient.state.name,
						patientCountry: res.data.data.patient.country.id,
						patientCountryName: res.data.data.patient.country.name,

						message: res.data.data.additional_information.message,
						partnerName: res.data.data.additional_information.partner_name,
						registrationNumber: res.data.data.registration_number,
						actualInvoice: res.data.data.actual_invoice,
						hotelType: res.data.data.hotel_type,
						estimatedInvoice: res.data.data.estimated_invoice,
						hotelName: res.data.data.hotel_name,
						visaExpiryAt: res.data.data.visa_expiry_at,
						arrivalAt: res.data.data.arrival_at,
						fieldPersonName: res.data.data.field_person_name,
						passportNumber: res.data.data.passport_number,
						arrivalType: res.data.data.arrival_type,
						leadSource: res.data.data.additional_information.lead_source.startsWith('CLIENT')
							? 'CLIENT'
							: res.data.data.additional_information.lead_source.startsWith('PARTNER')
							? 'PARTNER'
							: res.data.data.additional_information.lead_source,
						clientLeadSource: res.data.data.additional_information.lead_source.startsWith('CLIENT')
							? res.data.data.additional_information.lead_source
							: null,
						partnerLeadSource: res.data.data.additional_information.lead_source.startsWith('PARTNER')
							? res.data.data.additional_information.lead_source
							: null,
						client: res.data.data.additional_information.lead_source.startsWith('CLIENT') ? res.data.data.page_title : null,
						partner: res.data.data.additional_information.lead_source.startsWith('PARTNER') ? res.data.data.page_title : null,
						// add ppcWebsite and client here
						category: res.data.data.additional_information.category.id || null,
						categoryName: res.data.data.additional_information.category.name,
						facility: res.data.data.additional_information.facility.id,
						facilityName: res.data.data.additional_information.facility.name,
						treatmentIntensity: res.data.data.additional_information.treatment_intensity,
						travelFiles: res.data.data.media.patient.travel || [],
						medicalReports: res.data.data.media.patient.medical_reports || [],
						bills: res.data.data.media.patient.bills || [],
						otherFiles: res.data.data.media.patient.others || [],
						attendeeTravelFiles: res.data.data.media.patient_attendee.travel || [],
						attendeeOtherFiles: res.data.data.media.patient_attendee.others || [],
					})
				})
				.catch((err) => {
					toast.error(err.response?.data?.data?.message, {
						position: 'bottom-left',
					})
				})
		} else {
			setData(initialValues)
		}
	}

	const fetchPpcWebsiteData = () => {
		axios.get(`sales/leads/ppc-websites`).then((res) => {
			setPpcWebsiteData(res.data.data)
		})
	}
	const fetchClientData = () => {
		axios.get('sales/leads/client-websites').then((res) => {
			setClientData(res.data.data)
		})
	}
	const fetchPartnerData = () => {
		axios.get('sales/leads/partner-websites').then((res) => {
			setPartnerData(res.data.data)
		})
	}

	useEffect(() => {
		fetchEditData()
		fetchPpcWebsiteData()
		fetchClientData()
		fetchPartnerData()
	}, [lead_id])
	const handleSameAsPatient = (setFieldValue, patientCountry, patientCountryName, patientName) => {
		setCheckBoxChecked((previousState) => !previousState)
		if (checkBoxChecked) {
			setFieldValue('enquirerName', null)
			setFieldValue('enquirerCountryName', null)
			setFieldValue('enquirerCountry', null)
		} else {
			setFieldValue('enquirerName', patientName)
			setFieldValue('enquirerCountryName', patientCountryName)
			setFieldValue('enquirerCountry', patientCountry)
		}
	}

	const getDesiredPartnerLeadSource = (partner) => {
		if (partner === 'Om Navjeevan') {
			return [
				{ value: 'PARTNER_SEO', label: 'Partner SEO' },
				{ value: 'PARTNER_SEO_MANUAL', label: 'Partner SEO Manual' },
				{ value: 'PARTNER_PPC', label: 'Partner PPC' },
				{ value: 'PARTNER_PPC_MANUAL', label: 'Partner PPC Manual' },
				{ value: 'PARTNER_GMB', label: 'Partner GMB' },
				{ value: 'PARTNER_CALL', label: 'Partner Call' },
				{ value: 'PARTNER_DOM_FB', label: 'Partner Domestic FB' },
			].map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))
		} else {
			return [
				{ value: 'PARTNER_INT_FB', label: 'Partner International FB' },
				{ value: 'PARTNER_MANUAL', label: 'Partner Manual' },
			].map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))
		}
	}

	const getDesiredLeadSource = (pageType) => {
		if (user.type.is_client) {
			return <MenuItem value="CLIENT">Client</MenuItem>
		} else if (user.type.is_partner) {
			return <MenuItem value="PARTNER">Partner</MenuItem>
		} else if (user.type.is_mt) {
			return [
				{ value: 'WEB_SEO', label: 'Web SEO' },
				{ value: 'WEB_SEO_MANUAL', label: 'Web SEO Manual' },
				{ value: 'PPC', label: 'PPC' },
				{ value: 'PPC_MANUAL', label: 'PPC Manual' },
				{ value: 'REFERRAL', label: 'Referral' },
				{ value: 'FB', label: 'FB' },
			].map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))
		} else {
			return [
				{ value: 'WEB_SEO', label: 'Web SEO' },
				{ value: 'WEB_SEO_MANUAL', label: 'Web SEO Manual' },
				{ value: 'PPC', label: 'PPC' },
				{ value: 'PPC_MANUAL', label: 'PPC Manual' },
				{ value: 'REFERRAL', label: 'Referral' },
				{ value: 'FB', label: 'FB' },
				{ value: 'PARTNER', label: 'Partner' },
				{ value: 'CLIENT', label: 'Client' },
			].map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))
		}
	}

	return (
		<Formik enableReinitialize initialValues={data} validationSchema={schema} onSubmit={handleSubmit} validateOnBlur={true}>
			{(props) => {
				const {
					enquirerName,
					enquirerEmail,
					enquirerPhone,
					message,
					enquirerCountryName,
					patientCountry,
					enquirerRelationship,
					patientDob,
					preferredContactMeans,
					patientName,
					partnerName,
					hotelType,
					actualInvoice,
					registrationNumber,
					estimatedInvoice,
					hotelName,
					visaExpiryAt,
					arrivalAt,
					fieldPersonName,
					passportNumber,
					arrivalType,
					leadSource,
					clientLeadSource,
					partnerLeadSource,
					ppcWebsite,
					client,
					partner,
					treatmentIntensity,
					categoryName,
					facilityName,
					patientGender,
					patientCountryName,
					patientCityName,
					patientStateName,
				} = props.values

				const { setFieldValue } = props

				return (
					<>
						<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
							<Box sx={{ width: '1000px' }}>
								<Form>
									<Grid container spacing={2}>
										<Grid item xs={12} md={6} style={{ paddingLeft: '1px' }}>
											<Card
												raised={true}
												style={{
													padding: '30px',
												}}>
												<Typography variant="h6" sx={{ marginBottom: '2px' }}>
													Patient Information
												</Typography>
												<Divider
													sx={{
														borderBottomWidth: 5,
														borderColor: '#0089D6',
														width: '50px',
													}}
												/>
												{/* Patient Name */}
												<TextField
													sx={{ marginTop: '4px' }}
													label="Name"
													name="patientName"
													value={patientName || ''}
													onChange={(event) => {
														props.handleChange(event)
														if (checkBoxChecked) {
															setFieldValue('enquirerName', event.target.value)
														}
													}}
													onBlur={props.handleBlur}
													helperText={<ErrorMessage name="patientName" />}
													error={props.errors.patientName && props.touched.patientName}
													fullWidth
													required
												/>

												<FormControl>
													<FormLabel>Gender*</FormLabel>
													<RadioGroup
														value={patientGender || ''}
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														name="patientGender"
														row>
														<FormControlLabel value="F" control={<Radio />} label="Female" />
														<FormControlLabel value="M" control={<Radio />} label="Male" />
													</RadioGroup>
													{props.errors.patientGender && (
														<FormHelperText
															sx={{
																color: '#bf3333',
																marginLeft: '16px',
															}}>
															Please choose a gender
														</FormHelperText>
													)}
												</FormControl>
												<Box sx={{ pt: 2 }}>
													<Field
														name="patientCountry"
														label="Country"
														component={CountryComponent}
														value={patientCountryName || ''}
														onBlur={props.onBlur}
														shouldCopy={checkBoxChecked}
														option="patientCountryName"
													/>
												</Box>
												<Box sx={{ pt: 2 }}>
													<Field
														name="patientState"
														label="State"
														component={StateComponent}
														value={patientStateName || ''}
														onChange={props.handleChange}
														onBlur={props.onBlur}
													/>
												</Box>
												<Box sx={{ pt: 2, pb: 1 }}>
													<Field
														name="patientCity"
														label="City"
														component={CityComponent}
														value={patientCityName || ''}
														fullWidth
														onChange={props.handleChange}
														onBlur={props.onBlur}
													/>
												</Box>
												<TextField
													name="patientDob"
													label="Date Of Birth"
													type="date"
													InputLabelProps={{
														shrink: true,
													}}
													fullWidth
													value={patientDob || ''}
													onChange={props.handleChange}
													onBlur={props.handleBlur}
													helperText={<ErrorMessage name="patientDob" />}
													error={props.errors.patientDob && props.touched.patientDob}
												/>
											</Card>
											<Card
												raised={true}
												style={{
													padding: '30px',
													marginTop: '10px',
												}}>
												<Typography variant="h6">Enquirer Information</Typography>
												<Divider
													sx={{
														borderBottomWidth: 5,
														borderColor: '#0089D6',
														width: '50px',
														marginBottom: 2,
													}}
												/>
												{!lead_id && (
													<FormControlLabel
														style={{ float: 'right' }}
														control={
															<Checkbox
																checked={checkBoxChecked}
																onChange={() => {
																	handleSameAsPatient(
																		setFieldValue,
																		patientCountry,
																		patientCountryName,
																		patientName
																	)
																}}
															/>
														}
														label="Same as patient"
													/>
												)}
												{/* Enquirer Name */}
												{!lead_id && (
													<TextField
														label="Name"
														name="enquirerName"
														value={enquirerName || initialValues.enquirerName}
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														helperText={<ErrorMessage name="enquirerName" />}
														error={props.errors.enquirerName && props.touched.enquirerName}
														fullWidth
														required
													/>
												)}
												{lead_id && <TextField label="Name" name="enquirerName" value={enquirerName} fullWidth />}

												{/* Enquirer Email */}

												{!lead_id && (
													<TextField
														label="Email"
														name="enquirerEmail"
														value={enquirerEmail || ''}
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														helperText={<ErrorMessage name="enquirerEmail" />}
														error={props.errors.enquirerEmail && props.touched.enquirerEmail}
														fullWidth
													/>
												)}
												{lead_id && user.userId !== 72 && (
													<TextField
														label="Email"
														name="enquirerEmail"
														value={
															enquirerEmail
																? user.isAuditor
																	? `${enquirerEmail.slice(0, 3)}********`
																	: null
																: enquirerEmail
														}
														fullWidth
													/>
												)}

												{/* Enquirer Phone */}
												{!lead_id && (
													<TextField
														label="Phone Number"
														name="enquirerPhone"
														value={enquirerPhone || ''}
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														helperText={<ErrorMessage name="enquirerPhone" />}
														error={props.errors.enquirerPhone && props.touched.enquirerPhone}
														fullWidth
														required
													/>
												)}
												{lead_id && user.userId !== 72 && (
													<TextField
														label="Phone Number"
														name="enquirerPhone"
														value={
															enquirerPhone
																? user.isAuditor
																	? `${enquirerPhone.slice(0, 3)}*******`
																	: null
																: enquirerPhone
														}
														fullWidth
													/>
												)}

												<TextField
													label="Relationship with patient"
													name="enquirerRelationship"
													value={enquirerRelationship || ''}
													onChange={props.handleChange}
													fullWidth
												/>
												<Box sx={{ pt: 1 }}>
													<Field
														name="enquirerCountry"
														label="country"
														component={CountryComponent}
														value={enquirerCountryName || initialValues.enquirerCountry}
														onChange={props.handleChange}
														onBlur={props.onBlur}
														option="enquirerCountryName"
													/>
												</Box>
												<FormControl fullWidth size="small" sx={{ mt: 2 }}>
													<InputLabel>Contact Means*</InputLabel>
													<Select
														name="preferredContactMeans"
														value={preferredContactMeans || ''}
														label="Contact Means"
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														error={Boolean(
															props.errors.preferredContactMeans && props.touched.preferredContactMeans
														)}>
														<MenuItem value={ContactMeans.WHATSAPP}>{ContactMeans.WHATSAPP}</MenuItem>
														<MenuItem value={ContactMeans.CALL}>{ContactMeans.CALL}</MenuItem>
														<MenuItem value={ContactMeans.EMAIL}>{ContactMeans.EMAIL}</MenuItem>
													</Select>
													{props.errors.preferredContactMeans && props.touched.preferredContactMeans ? (
														<FormHelperText
															sx={{
																color: '#bf3333',
																marginLeft: '16px',
															}}>
															{props.touched.preferredContactMeans && props.errors.preferredContactMeans}
														</FormHelperText>
													) : null}
												</FormControl>
											</Card>
											<Card
												raised={true}
												style={{
													padding: '30px',
													marginTop: '10px',
												}}>
												<Typography variant="h6">Additional Information</Typography>
												<Divider
													sx={{
														borderBottomWidth: 5,
														borderColor: '#0089D6',
														width: '50px',
														marginBottom: 2,
													}}
												/>
												{/* Message */}
												<TextField
													name="message"
													label="Message"
													fullWidth
													multiline
													rows={5}
													value={message || ''}
													onChange={props.handleChange}
												/>
												{/* Lead Arrival Type */}
												<Box sx={{ pt: 2 }}>
													<Grid item xs={12} md={6}>
														<FormControl
															fullWidth
															size="small"
															style={{ width: '447px' }}
															sx={{ mt: 2 }}
															required>
															<InputLabel>Arrival Type</InputLabel>
															<Select
																name="arrivalType"
																value={arrivalType || ''}
																label="Arrival Type"
																onChange={props.handleChange}
																onBlur={props.handleBlur}>
																<MenuItem value="FRESH">Fresh</MenuItem>
																<MenuItem value="REPEAT">Repeat</MenuItem>
																<MenuItem value="REFERRAL">Referral</MenuItem>
																<MenuItem value="REPEAT REFERRAL">Repeat-Referral</MenuItem>
																<MenuItem value="ATTENDANT">Attendant</MenuItem>
															</Select>
															{props.errors.arrivalType && props.touched.arrivalType ? (
																<FormHelperText
																	sx={{
																		color: '#bf3333',
																		marginLeft: '16px',
																	}}>
																	{props.touched.arrivalType && props.errors.arrivalType}
																</FormHelperText>
															) : null}
														</FormControl>
													</Grid>
												</Box>
												{/* Category */}
												<Box sx={{ pt: 2 }}>
													<Field
														name="category"
														label="Category"
														component={CategoryComponent}
														value={categoryName || ''}
														onChange={props.handleChange}
														onBlur={props.onBlur}
													/>
												</Box>
												{/* Facility Name */}
												<Box sx={{ pt: 2 }}>
													<Field
														name="facility"
														label="Facility"
														component={FacilityComponents}
														value={facilityName || ''}
														onChange={props.handleChange}
														onBlur={props.onBlur}
													/>
												</Box>
												{/* Partner Name */}
												<TextField
													label="Partner Name"
													name="partnerName"
													value={partnerName || ''}
													onChange={props.handleChange}
													fullWidth
												/>
												{location.pathname.includes('/edit') && (
													<>
														{/* Registration Number */}
														<TextField
															label="Registration Number"
															name="registrationNumber"
															value={registrationNumber || ''}
															onChange={props.handleChange}
															fullWidth
														/>
														{/* Actual Invoice */}
														<TextField
															label="Actual Invoice"
															name="actualInvoice"
															value={actualInvoice || ''}
															onChange={props.handleChange}
															fullWidth
														/>
														{/* Estimated Invoice */}
														<TextField
															label="Estimated Invoice"
															name="estimatedInvoice"
															value={estimatedInvoice || ''}
															onChange={props.handleChange}
															fullWidth
														/>
														{/* Arrival At */}
														<TextField
															label="Arrival At"
															name="arrivalAt"
															value={arrivalAt || ''}
															type="date"
															InputLabelProps={{
																shrink: true,
															}}
															onChange={props.handleChange}
															fullWidth
														/>
														{/* Field Person Name */}
														<TextField
															label="Field Person Name"
															name="fieldPersonName"
															value={fieldPersonName || ''}
															onChange={props.handleChange}
															fullWidth
														/>
														{/* Passport Number */}
														<TextField
															label="Passport Number"
															name="passportNumber"
															value={passportNumber || ''}
															onChange={props.handleChange}
															fullWidth
														/>
														{/* Hotel Name */}
														<TextField
															label="Hotel Name"
															name="hotelName"
															value={hotelName || ''}
															onChange={props.handleChange}
															fullWidth
														/>
														<FormControl sx={{ mt: 1, mb: 1 }} fullWidth size="small">
															<InputLabel id="hotelType">Hotel Type</InputLabel>
															<Select
																name="hotelType"
																labelId="hotelType"
																id="demo-select-small"
																value={hotelType}
																label="Hotel Type"
																onChange={props.handleChange}
																fullWidth>
																{hotelTypeList.map((type) => (
																	<MenuItem key={type} value={type}>
																		{type.replaceAll('_', ' ')}
																	</MenuItem>
																))}
															</Select>
														</FormControl>
														{/* Visa Expiry At */}
														<TextField
															label="Visa Expiry Date"
															name="visaExpiryAt"
															value={visaExpiryAt || ''}
															type="date"
															InputLabelProps={{
																shrink: true,
															}}
															onChange={props.handleChange}
															fullWidth
														/>
													</>
												)}

												{/* Lead Source */}
												<FormControl fullWidth size="small" sx={{ mt: 2 }}>
													<InputLabel>Lead Source*</InputLabel>
													<Select
														name="leadSource"
														value={leadSource || ''}
														label="Lead Source"
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														error={props.errors.leadSource && props.touched.leadSource}>
														{getDesiredLeadSource(useLoc.search)}
														{/* <MenuItem value="WEB_SEO">Web SEO</MenuItem>
														<MenuItem value="WEB_SEO_MANUAL">Web SEO Manual</MenuItem>
														<MenuItem value="PPC">PPC</MenuItem>
														<MenuItem value="PPC_MANUAL">PPC Manual</MenuItem>
														<MenuItem value="REFERRAL">Referral</MenuItem>
														<MenuItem value="FB">FB</MenuItem>
														<MenuItem value="PARTNER">Partner</MenuItem>
														<MenuItem value="CLIENT">Client</MenuItem> */}
													</Select>
													{props.errors.leadSource && props.touched.leadSource ? (
														<FormHelperText
															sx={{
																color: '#bf3333',
																marginLeft: '16px',
															}}>
															{props.touched.leadSource && props.errors.leadSource}
														</FormHelperText>
													) : null}
												</FormControl>
												{/* Client */}
												{leadSource === 'CLIENT' && (
													<FormControl fullWidth size="small" sx={{ mt: 2 }}>
														<InputLabel>Client*</InputLabel>
														<Select
															name="client"
															label="Client"
															value={client}
															onChange={props.handleChange}
															onBlur={props.handleBlur}>
															{clientData?.map((data, index) => {
																return (
																	<MenuItem key={index} value={data}>
																		{data.replace(/_/g, ' ')}
																	</MenuItem>
																)
															})}
														</Select>
													</FormControl>
												)}

												{/* Client Lead Source */}
												{leadSource === 'CLIENT' && client && (
													<FormControl fullWidth size="small" sx={{ mt: 2 }}>
														<InputLabel>Client Lead Source*</InputLabel>
														<Select
															name="clientLeadSource"
															value={clientLeadSource || ''}
															label="Client Lead Source"
															onChange={props.handleChange}
															onBlur={props.handleBlur}
															error={props.errors.clientLeadSource && props.touched.clientLeadSource}>
															<MenuItem value="CLIENT_SEO">SEO</MenuItem>
															<MenuItem value="CLIENT_SEO_MANUAL">SEO Manual</MenuItem>
															<MenuItem value="CLIENT_PPC">PPC</MenuItem>
															<MenuItem value="CLIENT_PPC_MANUAL">PPC Manual</MenuItem>
															<MenuItem value="CLIENT_FB">FB</MenuItem>
															<MenuItem value="CLIENT_GMB">GMB</MenuItem>
														</Select>
													</FormControl>
												)}
												{/* Partner */}
												{leadSource === 'PARTNER' && (
													<FormControl fullWidth size="small" sx={{ mt: 2 }}>
														<InputLabel>Partner*</InputLabel>
														<Select
															name="partner"
															label="Partner"
															value={partner}
															onChange={props.handleChange}
															onBlur={props.handleBlur}>
															{partnerData?.map((data, index) => {
																return (
																	<MenuItem key={index} value={data}>
																		{data.replace(/_/g, ' ')}
																	</MenuItem>
																)
															})}
														</Select>
													</FormControl>
												)}
												{/* Partner Lead Source */}
												{leadSource === 'PARTNER' && partner && (
													<FormControl fullWidth size="small" sx={{ mt: 2 }}>
														<InputLabel>Partner Lead Source*</InputLabel>
														<Select
															name="partnerLeadSource"
															value={partnerLeadSource || ''}
															label="Partner Lead Source"
															onChange={props.handleChange}
															onBlur={props.handleBlur}
															error={props.errors.partnerLeadSource && props.touched.partnerLeadSource}>
															{getDesiredPartnerLeadSource(partner)}
														</Select>
													</FormControl>
												)}
												{/* PPC Website */}
												{leadSource === 'PPC_MANUAL' && (
													<FormControl fullWidth size="small" sx={{ mt: 2 }}>
														<InputLabel>PPC Website*</InputLabel>
														<Select
															name="ppcWebsite"
															label="PPC Website"
															value={ppcWebsite}
															onChange={props.handleChange}
															onBlur={props.handleBlur}>
															{ppcWebsiteData?.map((data, index) => {
																return (
																	<MenuItem key={index} value={data}>
																		{data.replace(/_/g, ' ')}
																	</MenuItem>
																)
															})}
														</Select>
													</FormControl>
												)}
												{/* Treatment Intensity */}
												<FormControl fullWidth size="small" sx={{ mt: 2 }}>
													<InputLabel>Treatment Intensity</InputLabel>
													<Select
														name="treatmentIntensity"
														value={treatmentIntensity || ''}
														label="Treatment Intensity"
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														error={Boolean(
															props.errors.treatmentIntensity && props.touched.treatmentIntensity
														)}>
														<MenuItem value="LOW">LOW</MenuItem>
														<MenuItem value="MEDIUM">MEDIUM</MenuItem>
														<MenuItem value="HIGH">HIGH</MenuItem>
													</Select>
													{props.errors.treatmentIntensity && props.touched.treatmentIntensity ? (
														<FormHelperText
															sx={{
																color: '#bf3333',
																marginLeft: '16px',
															}}>
															{props.touched.treatmentIntensity && props.errors.treatmentIntensity}
														</FormHelperText>
													) : null}
												</FormControl>
											</Card>
										</Grid>
										<Grid item xs={12} md={6}>
											<Card
												raised={true}
												style={{
													padding: '30px',
												}}>
												<Typography variant="h6">Patient Documents</Typography>
												<Divider
													sx={{
														borderBottomWidth: 5,
														borderColor: '#0089D6',
														width: '50px',
														marginBottom: 2,
													}}
												/>
												<InputLabel>Medical Reports</InputLabel>
												<Field name="medicalReports" component={MedicalReports} />
												<InputLabel>Bills</InputLabel>
												<Field name="bills" component={Bills} />
												<InputLabel>Travel</InputLabel>
												<Field name="travelFiles" component={TravelFiles} />
												<InputLabel>Others</InputLabel>
												<Field name="otherFiles" component={OtherFiles} />
											</Card>
											<Card
												raised={true}
												style={{
													padding: '30px',
													marginTop: '10px',
												}}>
												<Typography variant="h6">Attendee Documents</Typography>
												<Divider
													sx={{
														borderBottomWidth: 5,
														borderColor: '#0089D6',
														width: '50px',
														marginBottom: 2,
													}}
												/>
												<InputLabel>Travel</InputLabel>
												<Field name="attendeeTravelFiles" component={TravelFiles} />
												<InputLabel>Others</InputLabel>
												<Field name="attendeeOtherFiles" component={OtherFiles} />
											</Card>
										</Grid>

										<Grid item xs={12} md={12}>
											<CardActions style={{ justifyContent: 'center', marginTop: '20px' }}>
												<SubmitLoadingButton
													description={lead_id ? 'Lead updated successfully' : 'Lead added sucessfully'}
													open={open}
													handleRedirectPrimaryButton={handleRedirectPrimaryButton}
													handleRedirectSecondaryButton={handleRedirectSecondaryButton}
													primaryButton="My leads"
													secondaryButton="+ Add new lead"
													loading={loading}
												/>
											</CardActions>
										</Grid>
									</Grid>
								</Form>
							</Box>
						</Box>
					</>
				)
			}}
		</Formik>
	)
}

export default AddLead

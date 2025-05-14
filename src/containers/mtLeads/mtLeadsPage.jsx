/* eslint-disable no-unused-vars*/
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import axios from '../../shared/axios'
import { toast } from 'react-toastify'
import { IconButton, Box, Tabs, Tab, Grid, useMediaQuery, Typography, Chip, Button, Tooltip } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation'
import FacebookLeadsFilterComponent from '../facebookLeads/components/facebookLeadsFilterComponent'
import { useSelector } from 'react-redux'
import SalesEmpComponent from '../leads/myLeads/components/salesEmpComponent'
import PartnerComponent from '../leads/myLeads/components/partnerComponent'
import usePagination from '../../components/pagination'
import CircularLoader from '../../components/common/loader/circularLoader'
import RefreshIcon from '@mui/icons-material/Refresh'
import LeadListingComponent from '../leads/myLeads/components/leadListingComponent'
import noData from '../../assets/no-data.svg'
import EventIcon from '@mui/icons-material/Event'
import _ from 'lodash'
import TransferMultipleLeadsModalPopup from '../leads/myLeads/components/transferMultipleLeadsModalPopup'
import {
	setFacebookLeadsLeadGeneratedDateFrom,
	setFacebookLeadsLeadGeneratedDateTo,
	setFacebookLeadsMainStatus,
	setFacebookLeadsSubStatus,
	setFacebookLeadsEnquirerName,
	setFacebookLeadsEnquirerPhone,
	setFacebookLeadsPatientName,
	setFacebookLeadsPatientCountry,
	setFacebookLeadsPatientIsInternationalOnly,
	setFacebookLeadsPatientGender,
	setFacebookLeadsPatientDob,
	setFacebookLeadsPatientState,
	setFacebookLeadsCategory,
	setFacebookLeadsSpecialization,
	setFacebookLeadsService,
	setFacebookLeadsTier,
	setFacebookLeadsLeadId,
	setFacebookLeadsLeadSource,
	setFacebookLeadsTreatmentIntensity,
	resetFacebookLeadsFilter,
	setFacebookLeadsPPCWebsite,
} from '../../slices/facebookLeadsFilterSlice'
import { useDispatch } from 'react-redux'

export default function MtLeadsPage() {
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const dispatch = useDispatch()
	const queryKeyMapping = {
		leadGeneratedDateFrom: 'lead_date_from',
		leadGeneratedDateTo: 'lead_date_to',

		mainStatus: 'status',
		subStatus: 'sub_status',

		enquirerName: 'enquirer_name',
		enquirerEmail: 'enquirer_email',
		enquirerPhone: 'enquirer_phone',
		enquirerCountry: 'enquirer_country_id',
		preferredLanguage: 'preferred_language',
		contactMeans: 'preferred_contact_means',

		patientName: 'patient_name',
		patientGender: 'patient_gender',
		patientDob: 'patient_birth_date',
		patientAddress: 'patient_address',
		patientPostalCode: 'patient_postal_code',
		patientCountry: 'patient_country_id',
		patientIsInternationalOnly: 'only_international_leads',

		ppcWebsite: 'ppc_hospital_name',
		category: 'category_id',
		specialization: 'specialization_id',
		service: 'service_id',
		tier: 'lead_tier',
		leadId: 'lead_id',
		leadSource: 'lead_source',
		treatmentIntensity: 'treatment_intensity',
	}
	const matches = useMediaQuery('(min-width: 600px)')
	const user = useSelector((state) => state.user)
	const [leadListingResponse, setLeadListingResponse] = useState(null)
	const [leadListingData, setLeadListingData] = useState([])
	const [selectedSalesEmpId, setSelectedSalesEmpId] = useState()
	const [selectedPartnerId, setSelectedPartnerId] = useState()
	const [isFilterVisible, setIsFilterVisible] = useState(false)
	const [paginationData, setPaginationData] = useState()
	// const [totalLeads, setTotalLeads] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()
	// const [query] = useState();
	const initialSearchParams = new URLSearchParams(location.search)
	const [queryParams, setQueryParams] = useSearchParams()
	const leadListingType = initialSearchParams.get('type') || 'fresh'
	// Redux
	const filterChips = useSelector((state) => state.facebookLeadsFilterReducer.facebookLeadsFilter)
	const [countryList, setCountryList] = useState([])
	const [categoryList, setCategoryList] = useState([])
	const [specializationList, setSpecializationList] = useState([])
	const [serviceList, setServiceList] = useState([])

	// const [, setParams] = useState();
	const leadListingTabArr = ['all', 'fresh', 'working', 'stale']
	let allPage = 1
	let freshPage = 1
	let workingPage = 1
	let stalePage = 1
	let initialTabNumber = 0
	if (leadListingType === 'all') {
		allPage = parseInt(initialSearchParams.get('page'), 10) || 1
		initialTabNumber = 0
	}
	if (leadListingType === 'fresh') {
		freshPage = parseInt(initialSearchParams.get('page'), 10) || 1
		initialTabNumber = 1
	}
	if (leadListingType === 'working') {
		workingPage = parseInt(initialSearchParams.get('page'), 10) || 1
		initialTabNumber = 2
	}
	if (leadListingType === 'stale') {
		stalePage = parseInt(initialSearchParams.get('page'), 10) || 1
		initialTabNumber = 3
	}

	const [allLeadPage, setAllLeadPage] = useState(allPage)
	const [freshLeadPage, setFreshLeadPage] = useState(freshPage)
	const [workingLeadPage, setWorkingLeadPage] = useState(workingPage)
	const [staleLeadPage, setStaleLeadPage] = useState(stalePage)
	const [leadListingTabIndex, setLeadListingTabNumber] = useState(initialTabNumber)
	const [transferMultipleLeadsArray, setTransferMultipleLeadsArray] = useState([])
	const [openTransferMultipleLeadsModal, setOpenTransferMultipleLeadsModal] = useState(false)
	const [isLeadSelected, setIsLeadSelected] = useState(false)
	const [noOfFilters, setNoOfFilters] = useState(0)

	function handleTransferMultipleLeadsArray(arr) {
		setTransferMultipleLeadsArray(arr)
	}

	const getQueryObject = (queryRawObject) => {
		// TODO: Remove this key mapping
		let queryObjectToBeMapped = _.pickBy(queryRawObject, (value) => value !== '')
		let replacedKeys = Object.keys(queryObjectToBeMapped)
			.filter((key) => key)
			.map((key) => {
				const newKey = queryKeyMapping[key] || null
				// Dates
				// Lead Date From
				if (newKey === 'lead_date_from') {
					const tempObj = {
						placeholder: 'From',
						queryParameter: 'lead_date_from',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsLeadGeneratedDateFrom(tempObj))
				}
				// Lead Date To
				if (newKey === 'lead_date_to') {
					const tempObj = {
						placeholder: 'To',
						queryParameter: 'lead_date_to',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsLeadGeneratedDateTo(tempObj))
				}

				// Status
				// Main Status
				if (newKey === 'status') {
					const tempObj = {
						placeholder: 'Status',
						queryParameter: 'status',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsMainStatus(tempObj))
				}
				// Sub Status
				if (newKey === 'sub_status') {
					const tempObj = {
						placeholder: 'Sub Status',
						queryParameter: 'sub_status',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsSubStatus(tempObj))
				}

				// Enquirer Information
				// Enquirer Name
				if (newKey === 'enquirer_name') {
					const tempObj = {
						placeholder: 'Enquirer Name',
						queryParameter: 'enquirer_name',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsEnquirerName(tempObj))
				}
				// Enquirer Phone
				if (newKey === 'enquirer_phone') {
					const tempObj = {
						placeholder: 'Enquirer Phone',
						queryParameter: 'enquirer_phone',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsEnquirerPhone(tempObj))
				}

				// Patient Information
				// Patient Name
				if (newKey === 'patient_name') {
					const tempObj = {
						placeholder: 'Patient Name',
						queryParameter: 'patient_name',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsPatientName(tempObj))
				}
				// Patient Gender
				if (newKey === 'patient_gender') {
					const tempObj = {
						placeholder: 'Patient Gender',
						queryParameter: 'patient_gender',
						value: queryObjectToBeMapped[key],
						name: queryObjectToBeMapped[key] === 'M' ? 'Male' : 'Female',
					}
					dispatch(setFacebookLeadsPatientGender(tempObj))
				}
				// Patient DOB
				if (newKey === 'patient_birth_date') {
					const tempObj = {
						placeholder: 'Patient DOB',
						queryParameter: 'patient_birth_date',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsPatientDob(tempObj))
				}
				// Patient Country ID & Patient Country Name
				if (newKey === 'patient_country_id') {
					const tempObj = {
						placeholder: 'Patient Country',
						queryParameter: 'patient_country_id',
						value: queryObjectToBeMapped[key],
						name: getCountryName(queryObjectToBeMapped[key]),
					}
					dispatch(setFacebookLeadsPatientCountry(tempObj))
				}
				// Patient Is International Only
				if (newKey === 'only_international_leads') {
					const tempObj = {
						placeholder: 'Only International Leads',
						queryParameter: 'only_international_leads',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsPatientIsInternationalOnly(tempObj))
				}

				// Additional Information
				// PPC Website
				if (newKey === 'ppc_hospital_name') {
					const tempObj = {
						placeholder: 'PPC Facility',
						queryParameter: 'ppc_hospital_name',
						value: queryObjectToBeMapped[key],
						name: queryObjectToBeMapped[key]?.replaceAll('_', ' '),
					}
					dispatch(setFacebookLeadsPPCWebsite(tempObj))
				}
				// Category
				if (newKey === 'category_id') {
					const tempObj = {
						placeholder: 'Category',
						queryParameter: 'category_id',
						value: queryObjectToBeMapped[key],
						name: getCategoryName(queryObjectToBeMapped[key]),
					}
					dispatch(setFacebookLeadsCategory(tempObj))
				}
				// Specialization
				if (newKey === 'specialization_id') {
					const tempObj = {
						placeholder: 'Specialization',
						queryParameter: 'specialization_id',
						value: queryObjectToBeMapped[key],
						name: getSpecializationName(queryObjectToBeMapped[key]),
					}
					dispatch(setFacebookLeadsSpecialization(tempObj))
				}
				// Service
				if (newKey === 'service_id') {
					const tempObj = {
						placeholder: 'Service',
						queryParameter: 'service_id',
						value: queryObjectToBeMapped[key],
						name: getServiceName(queryObjectToBeMapped[key]),
					}
					dispatch(setFacebookLeadsService(tempObj))
				}
				// Tier
				if (newKey === 'lead_tier') {
					const tempObj = {
						placeholder: 'Tier',
						queryParameter: 'lead_tier',
						value: queryObjectToBeMapped[key],
						name: _.startCase(_.toLower(queryObjectToBeMapped[key])),
					}
					dispatch(setFacebookLeadsTier(tempObj))
				}
				// Lead ID
				if (newKey === 'lead_id') {
					const tempObj = {
						placeholder: 'Lead ID',
						queryParameter: 'lead_id',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsLeadId(tempObj))
				}
				// Lead Source

				if (newKey === 'lead_source') {
					const tempObj = {
						placeholder: 'Lead Source',
						queryParameter: 'lead_source',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsLeadSource(tempObj))
				}

				// Treatment Intensity
				if (newKey === 'treatment_intensity') {
					const tempObj = {
						placeholder: 'Treatment Intensity',
						queryParameter: 'treatment_intensity',
						value: queryObjectToBeMapped[key],
					}
					dispatch(setFacebookLeadsTreatmentIntensity(tempObj))
				}
				return { [newKey]: queryObjectToBeMapped[key] }
			})
		const queryObj = {
			page: 1,
			type: leadListingType,
			...replacedKeys.reduce((a, b) => Object.assign({}, a, b)),
		}
		return queryObj
	}

	const handleFilterSubmit = (filteringObj) => {
		const trialFilterParams = { page: 1, type: leadListingType }
		for (const filterChipKey of Object.keys(filterChips)) {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj.value) {
				trialFilterParams[filterChipObj.queryParameter] = filterChipObj.value
			}
		}
		const queryParamsObj = getQueryObject(filteringObj)
		setAllLeadPage(1)
		setFreshLeadPage(1)
		setWorkingLeadPage(1)
		setStaleLeadPage(1)
		if (!_.isEmpty(queryParamsObj)) {
			for (const key in queryParamsObj) {
				if (!queryParamsObj[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(queryParamsObj, key)) {
					queryParams.set(key, queryParamsObj[key])
				}
			}
			setQueryParams(queryParams)
			// fetchLeadListingData()
		}
	}

	const handleClearFilter = () => {
		setAllLeadPage(1)
		setFreshLeadPage(1)
		setWorkingLeadPage(1)
		setStaleLeadPage(1)
		setIsFilterVisible(false)
		//* trial starts here
		Object.keys(filterChips).forEach((filterChipKey) => {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj.value) {
				const queryKey = queryKeyMapping[filterChipKey]
				queryParams.delete(queryKey)
			}
		})
		//* trial ends here
		// Deleting all the query keys and adding only page and page type query string
		//* This is only looping through the queryKeyMapping object
		// for (const key in queryKeyMapping) {
		// 	if (Object.hasOwnProperty.call(queryKeyMapping, key) && filterChips[key]?.value) {
		// 		const queryKey = queryKeyMapping[key]
		// 		queryParams.delete(queryKey)
		// 	}
		// }
		queryParams.set('page', 1)
		queryParams.set('type', leadListingType)
		setQueryParams(queryParams)
		dispatch(resetFacebookLeadsFilter())
		// fetchLeadListingData()
	}

	const handleDeleteFilterChip = (filterKey, filterObj) => {
		setAllLeadPage(1)
		setFreshLeadPage(1)
		setWorkingLeadPage(1)
		setStaleLeadPage(1)
		const queryKey = queryKeyMapping[filterKey]
		queryParams.delete(queryKey)
		queryParams.set('page', 1)
		setQueryParams(queryParams)
		let tempObj = { queryParameter: filterObj.queryParameter, value: null }

		// Dates
		// Lead Date From
		if (filterKey === 'leadGeneratedDateFrom') {
			dispatch(setFacebookLeadsLeadGeneratedDateFrom(tempObj))
		}
		// Lead Date To
		if (filterKey === 'leadGeneratedDateTo') {
			dispatch(setFacebookLeadsLeadGeneratedDateTo(tempObj))
		}

		// Status
		// Main Status
		if (filterKey === 'mainStatus') {
			dispatch(setFacebookLeadsMainStatus(tempObj))
		}
		// Sub Status
		if (filterKey === 'subStatus') {
			dispatch(setFacebookLeadsSubStatus(tempObj))
		}

		// Enquirer Information
		// Enquirer Name
		if (filterKey === 'enquirerName') {
			dispatch(setFacebookLeadsEnquirerName(tempObj))
		}
		// Enquirer Phone
		if (filterKey === 'enquirerPhone') {
			dispatch(setFacebookLeadsEnquirerPhone(tempObj))
		}

		// Patient Information
		// Patient Name
		if (filterKey === 'patientName') {
			dispatch(setFacebookLeadsPatientName(tempObj))
		}
		// Patient Gender
		if (filterKey === 'patientGender') {
			dispatch(setFacebookLeadsPatientGender(tempObj))
		}
		// Patient DOB
		if (filterKey === 'patientDob') {
			dispatch(setFacebookLeadsPatientDob(tempObj))
		}
		// Patient Country ID & Patient Country Name
		if (filterKey === 'patientCountry') {
			// dispatch(setFacebookLeadsPatientCountryName(tempObj))
			dispatch(setFacebookLeadsPatientCountry(tempObj))
		}
		// Patient Is International Only
		if (filterKey === 'patientIsInternationalOnly') {
			dispatch(setFacebookLeadsPatientIsInternationalOnly(tempObj))
		}

		// Additional Information
		// PPC Facility
		if (filterKey === 'ppcWebsite') {
			dispatch(setFacebookLeadsPPCWebsite(tempObj))
		}
		// Category
		if (filterKey === 'category') {
			dispatch(setFacebookLeadsCategory(tempObj))
		}
		// Specialization
		if (filterKey === 'specialization') {
			dispatch(setFacebookLeadsSpecialization(tempObj))
		}
		// Service
		if (filterKey === 'service') {
			dispatch(setFacebookLeadsService(tempObj))
		}
		// Tier
		if (filterKey === 'tier') {
			dispatch(setFacebookLeadsTier(tempObj))
		}
		// Lead ID
		if (filterKey === 'leadId') {
			dispatch(setFacebookLeadsLeadId(tempObj))
		}
		// Lead Source
		if (filterKey === 'leadSource') {
			dispatch(setFacebookLeadsLeadSource(tempObj))
		}
		// Treatment Intensity
		if (filterKey === 'treatmentIntensity') {
			dispatch(setFacebookLeadsTreatmentIntensity(tempObj))
		}
	}

	const handleSalesEmpChange = (salesEmpId) => {
		setSelectedSalesEmpId(salesEmpId)
	}

	const handleLeadListingTabChange = (_event, newTabIndex) => {
		setLeadListingTabNumber(newTabIndex)
		if (newTabIndex === 0) {
			navigate(`/mt-leads?type=all&page=${allLeadPage}`)
		} else if (newTabIndex === 1) {
			navigate(`/mt-leads?type=fresh&page=${freshLeadPage}`)
		} else if (newTabIndex === 2) {
			navigate(`/mt-leads?type=working&page=${workingLeadPage}`)
		} else if (newTabIndex === 3) {
			navigate(`/mt-leads?type=stale&page=${staleLeadPage}`)
		}
	}

	// Fetch Data
	const fetchLeadListingData = useCallback(() => {
		setIsLoading(true)
		setNoOfFilters(0)
		setLeadListingData([])

		let filterNumber = 0
		const trialFilterParams = { type: leadListingType }
		for (const filterChipKey of Object.keys(filterChips)) {
			const filterChipObj = filterChips[filterChipKey]
			if (filterChipObj && filterChipObj.value) {
				trialFilterParams[filterChipObj.queryParameter] = filterChipObj.value
				filterNumber++
			}
		}
		if (!_.isEmpty(trialFilterParams)) {
			for (const key in trialFilterParams) {
				if (!trialFilterParams[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(trialFilterParams, key)) {
					queryParams.set(key, trialFilterParams[key])
				}
			}

			if (filterChips.leadSource.value === null) {
				queryParams.set('lead_source', 'WEB_SEO,WEB_SEO_MANUAL,PPC_MANUAL,PPC,REFERRAL,FB')
			}
			setQueryParams(queryParams)
		}
		setNoOfFilters(filterNumber)
		let url
		let salesLeadURLPath = 'sales/leads/sale-emp?'
		if (user.isAdmin || user.isAuditor) {
			// All Leads - Admin
			if (leadListingTabIndex === 0) {
				url =
					salesLeadURLPath +
					(selectedSalesEmpId ? `&emp_id=${selectedSalesEmpId}&` : '&') +
					(queryParams ? `${queryParams}` : `&page=${allLeadPage}`)
			}
			// Fresh Leads
			if (leadListingTabIndex === 1) {
				url =
					salesLeadURLPath +
					(selectedSalesEmpId ? `&emp_id=${selectedSalesEmpId}&` : '&') +
					(queryParams ? `${queryParams}` : `&page=${freshLeadPage}`)
			}
			// Working Leads
			else if (leadListingTabIndex === 2) {
				url =
					salesLeadURLPath +
					(selectedSalesEmpId ? `&emp_id=${selectedSalesEmpId}&` : '&') +
					(queryParams ? `${queryParams}` : `&page=${workingLeadPage}`)
			}
			// Stale Leads - Admin
			if (leadListingTabIndex === 3) {
				url =
					salesLeadURLPath +
					(selectedSalesEmpId ? `&emp_id=${selectedSalesEmpId}&` : '&') +
					(queryParams ? `${queryParams}` : `&page=${staleLeadPage}`)
			}
		} else {
			// All Leads - Non-admin
			if (leadListingTabIndex === 0) {
				// url = `sales/leads/sale-emp/${user.userId}` + (queryParams ? `&${queryParams}` : `&page=${allLeadPage}`)
				url = salesLeadURLPath + `&emp_id=${user.userId}` + (queryParams ? `&${queryParams}` : `&page=${allLeadPage}`)
			}
			// Fresh Leads - Non-admin
			if (leadListingTabIndex === 1) {
				url = salesLeadURLPath + `&emp_id=${user.userId}` + (queryParams ? `&${queryParams}` : `&page=${allLeadPage}`)
			}
			// Working Leads - Non-admin
			else if (leadListingTabIndex === 2) {
				url = salesLeadURLPath + `&emp_id=${user.userId}` + (queryParams ? `&${queryParams}` : `&page=${allLeadPage}`)
			}
			// Stale Leads - Non-admin
			if (leadListingTabIndex === 3) {
				url = salesLeadURLPath + `&emp_id=${user.userId}` + (queryParams ? `&${queryParams}` : `&page=${allLeadPage}`)
			}
		}
		axios
			.get(url)
			.then((res) => {
				// setLeadListingData(res.data.data.data)
				// setPaginationData(res.data.data.meta)
				// setIsLoading(false)
				setLeadListingResponse(res.data.data)
			})
			.catch((error) => {
				toast.error(error.response?.data.data.message, {
					position: 'bottom-left',
				})
				setIsLoading(false)
			})
	}, [queryParams, leadListingTabIndex, allLeadPage, freshLeadPage, selectedSalesEmpId, user.isAdmin, user.userId])

	useEffect(() => {
		if (leadListingTabIndex === 0) {
			navigate(`/mt-leads/leads?${queryParams}`)
		}
		fetchLeadListingData()
	}, [queryParams, leadListingTabIndex, selectedSalesEmpId, allLeadPage, freshLeadPage, workingLeadPage, staleLeadPage, navigate])
	useEffect(() => {
		if (leadListingResponse != null) {
			if (leadListingTabArr[leadListingTabIndex] === leadListingResponse.type) {
				setLeadListingData(leadListingResponse.data)
				setPaginationData(leadListingResponse.meta)
				setIsLoading(false)
			}
		}
	}, [leadListingResponse])
	const getCategoryList = () => {
		axios
			.get(`search/category?name`)
			.then((res) => {
				setCategoryList(res.data.data)
			})
			.catch((err) => {
				toast.error(err.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	const getSpecializationList = () => {
		axios
			.get(`search/specialization?name`)
			.then((res) => {
				setSpecializationList(res.data.data)
			})
			.catch((err) => {
				toast.error(err.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	const getServiceList = () => {
		axios
			.get(`search/service?name`)
			.then((res) => {
				setServiceList(res.data.data)
			})
			.catch((err) => {
				toast.error(err.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	const getCategoryName = (categoryId) => {
		return _.filter(categoryList, ['id', categoryId])[0].name
	}
	const getSpecializationName = (specializationId) => {
		return _.filter(specializationList, ['id', specializationId])[0].name
	}
	const getServiceName = (serviceId) => {
		return _.filter(serviceList, ['id', serviceId])[0].name
	}
	const getCountryList = () => {
		axios.get(`search/country?name`).then((res) => {
			setCountryList(res.data.data)
		})
	}
	const getCountryName = (countryId) => {
		return _.filter(countryList, ['id', countryId])[0].name
	}
	useEffect(() => {
		getCategoryList()
		getSpecializationList()
		getServiceList()
		getCountryList()
	}, [])
	useEffect(() => {
		if (transferMultipleLeadsArray.length > 0) {
			setIsLeadSelected(true)
		} else {
			setIsLeadSelected(false)
		}
	}, [transferMultipleLeadsArray])

	const handleOpenTransferMultipleLeadsModal = () => {
		setOpenTransferMultipleLeadsModal(true)
	}
	const handleCloseTransferMultipleLeadsModal = () => {
		setOpenTransferMultipleLeadsModal(false)
	}
	const handleFilterOpen = () => {
		setIsFilterVisible(true)
	}
	const handleFilterClose = () => {
		setIsFilterVisible(false)
	}
	const handleRefresh = () => {
		fetchLeadListingData()
	}

	const perPage = paginationData?.per_page
	const Pagination = usePagination(leadListingData, perPage)

	const handleAllLeadPageChange = (_event, pageNumber) => {
		setAllLeadPage(pageNumber)
		Pagination.jump(pageNumber)
		queryParams.set('page', pageNumber)
		setQueryParams(queryParams)
		fetchLeadListingData()
	}

	const handleFreshLeadPageChange = (_event, pageNumber) => {
		setFreshLeadPage(pageNumber)
		Pagination.jump(pageNumber)
		queryParams.set('page', pageNumber)
		setQueryParams(queryParams)
		fetchLeadListingData()
	}

	const handleWorkingLeadPageChange = (_event, pageNumber) => {
		setWorkingLeadPage(pageNumber)
		Pagination.jump(pageNumber)
		queryParams.set('page', pageNumber)
		setQueryParams(queryParams)
		fetchLeadListingData()
	}
	const handleStaleLeadPageChange = (_event, pageNumber) => {
		setStaleLeadPage(pageNumber)
		Pagination.jump(pageNumber)
		queryParams.set('page', pageNumber)
		setQueryParams(queryParams)
		fetchLeadListingData()
	}
	const handlePartnerChange = (partnerId) => {
		setSelectedPartnerId(partnerId)
	}

	return (
		<>
			<Box
				sx={{
					width: '95%',
					margin: 'auto',
				}}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: matches ? 'row' : 'column',
						alignItems: 'center',
					}}>
					{/* Tabs */}
					<Box
						sx={{
							borderColor: 'divider',
							display: 'flex',
							gap: 2,
							alignItems: 'center',
							justifyContent: matches ? undefined : 'space-between',
							width: matches ? '0.5' : 1,
						}}>
						<Tabs
							value={leadListingTabIndex}
							onChange={handleLeadListingTabChange}
							aria-label="basic tabs example"
							variant="scrollable"
							scrollButtons={!matches}>
							<Tab label={'All'} />
							<Tab label={'Fresh'} />
							<Tab label={'Working'} />
							<Tab label={'Stale'} />
						</Tabs>
					</Box>

					<Box
						display="flex"
						sx={{
							width: matches ? '0.5' : 1,
							marginY: matches ? '' : 3,
							flexDirection: matches ? 'row' : 'column',
							justifyContent: 'flex-end',
							gap: 2,
						}}>
						{/* Sales Employee and Partner Dropdown */}
						{/* {leadListingTabIndex === 3 && <PartnerComponent handlePartnerChange={handlePartnerChange} />} */}
						{(user.isAdmin || user.isAuditor) && <SalesEmpComponent handleSalesEmpChange={handleSalesEmpChange} />}

						{/* Buttons */}
						<Box display="flex" sx={{ gap: 2, justifyContent: matches ? '' : 'space-evenly' }}>
							{user.isAdmin && isLeadSelected && (
								<Tooltip arrow title="Transfer Multiple Leads">
									<IconButton
										color="inherit"
										aria-label="menu"
										style={{ padding: '0px' }}
										onClick={handleOpenTransferMultipleLeadsModal}>
										<TransferWithinAStationIcon />
									</IconButton>
								</Tooltip>
							)}
							<TransferMultipleLeadsModalPopup
								transferMultipleLeadsArray={transferMultipleLeadsArray}
								open={openTransferMultipleLeadsModal}
								onClose={() => {
									handleCloseTransferMultipleLeadsModal()
								}}
							/>
							{isAllowed('view_partner_followup') && (
								<Tooltip arrow title="View Follow Ups">
									<IconButton
										color="inherit"
										aria-label="menu"
										style={{ padding: '0px' }}
										onClick={() => {
											// navigate(`/follow-ups?followup_from_date=${getTodaysDate()}&followup_to_date=${getTodaysDate()}`)
											navigate(`/follow-ups`)
										}}>
										<EventIcon />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip arrow title="Refresh Leads">
								<IconButton color="inherit" style={{ padding: '0px' }} onClick={handleRefresh}>
									<RefreshIcon />
								</IconButton>
							</Tooltip>

							<Tooltip arrow title="Open Filters">
								<IconButton color="inherit" aria-label="menu" style={{ padding: '0px' }} onClick={handleFilterOpen}>
									<FilterAltIcon />
								</IconButton>
							</Tooltip>
							<FacebookLeadsFilterComponent
								handleClearFilter={handleClearFilter}
								open={isFilterVisible}
								onClose={handleFilterClose}
								onSubmit={handleFilterSubmit}
							/>
						</Box>
					</Box>
				</Box>

				{/* TabPanel start */}

				<Box display="flex" alignItems="center" gap={2} mt={2}>
					{leadListingTabIndex === 0 &&
						!filterChips.leadGeneratedDateFrom['value'] &&
						!filterChips.leadGeneratedDateTo['value'] && <Chip label="Last 2 Months" />}
					{noOfFilters > 0 && (
						<Box>
							{Object.keys(filterChips).map((filterChipKey) => {
								const filterChipObj = filterChips[filterChipKey]
								let filterChipValue = filterChipObj?.value
								if (filterChipValue && filterChipKey != '_persist') {
									if (filterChipObj?.name) {
										return (
											<Chip
												key={filterChipKey}
												label={`${filterChipObj.placeholder}: ${filterChipObj.name}`}
												onDelete={() => handleDeleteFilterChip(filterChipKey, filterChipObj)}
												sx={{ mr: 2 }}
											/>
										)
									}
									return (
										<Chip
											key={filterChipKey}
											label={`${filterChipObj.placeholder}: ${filterChipValue}`}
											onDelete={() => handleDeleteFilterChip(filterChipKey, filterChipObj)}
											sx={{ mr: 2 }}
										/>
									)
								} else return null
							})}

							<Button variant="outlined" color="error" onClick={handleClearFilter}>
								Clear Filter
							</Button>
						</Box>
					)}
				</Box>
				{/* All Leads */}
				<Box value={leadListingTabIndex} index={0}>
					<Box role="tabpanel" hidden={leadListingTabIndex !== 0} id={`simple-tabpanel-${0}`} aria-labelledby={`simple-tab-${0}`}>
						{isLoading ? (
							<CircularLoader />
						) : leadListingData.length === 0 ? (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									minHeight: '60vh',
									alignItems: 'center',
								}}>
								<Box>
									<img src={noData} alt="no documents" height={100} width={100} />
									<Typography style={{ textAlign: 'center' }}>No leads found</Typography>
								</Box>
							</Box>
						) : (
							leadListingTabIndex === 0 && (
								<LeadListingComponent
									handleClearFilter={handleClearFilter}
									handleDeleteFilterChip={handleDeleteFilterChip}
									tabName="all"
									query={queryParams.toString()}
									paginationData={paginationData}
									data={leadListingData}
									leadPage={allLeadPage}
									handleLeadPageChange={handleAllLeadPageChange}
									transferMultipleLeadsArray={transferMultipleLeadsArray}
									handleTransferMultipleLeadsArray={handleTransferMultipleLeadsArray}
									selectedSalesEmpId={selectedSalesEmpId}
								/>
							)
						)}
					</Box>
				</Box>
				{/* Fresh Leads */}
				<Box value={leadListingTabIndex} index={1}>
					<Box role="tabpanel" hidden={leadListingTabIndex !== 1} id={`simple-tabpanel-${1}`} aria-labelledby={`simple-tab-${1}`}>
						{isLoading ? (
							<CircularLoader />
						) : leadListingData.length === 0 ? (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									minHeight: '60vh',
									alignItems: 'center',
								}}>
								<Box>
									<img src={noData} alt="no documents" height={100} width={100} />
									<Typography style={{ textAlign: 'center' }}>No leads found</Typography>
								</Box>
							</Box>
						) : (
							leadListingTabIndex === 1 && (
								<LeadListingComponent
									handleClearFilter={handleClearFilter}
									handleDeleteFilterChip={handleDeleteFilterChip}
									tabName="fresh"
									query={queryParams.toString()}
									paginationData={paginationData}
									data={leadListingData}
									leadPage={freshLeadPage}
									handleLeadPageChange={handleFreshLeadPageChange}
									transferMultipleLeadsArray={transferMultipleLeadsArray}
									handleTransferMultipleLeadsArray={handleTransferMultipleLeadsArray}
									selectedSalesEmpId={selectedSalesEmpId}
								/>
							)
						)}
					</Box>
				</Box>
				{/* Working Leads */}
				<Box value={leadListingTabIndex} index={2}>
					<Box role="tabpanel" hidden={leadListingTabIndex !== 2} id={`simple-tabpanel-${2}`} aria-labelledby={`simple-tab-${2}`}>
						{isLoading ? (
							<CircularLoader />
						) : leadListingData.length === 0 ? (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									minHeight: '60vh',
									alignItems: 'center',
								}}>
								<Box>
									<img src={noData} alt="no documents" height={100} width={100} />
									<Typography style={{ textAlign: 'center' }}>No leads found</Typography>
								</Box>
							</Box>
						) : (
							leadListingTabIndex === 2 && (
								<LeadListingComponent
									handleClearFilter={handleClearFilter}
									handleDeleteFilterChip={handleDeleteFilterChip}
									tabName="working"
									query={queryParams.toString()}
									paginationData={paginationData}
									data={leadListingData}
									leadPage={workingLeadPage}
									handleLeadPageChange={handleWorkingLeadPageChange}
									transferMultipleLeadsArray={transferMultipleLeadsArray}
									handleTransferMultipleLeadsArray={handleTransferMultipleLeadsArray}
									selectedSalesEmpId={selectedSalesEmpId}
								/>
							)
						)}
					</Box>
				</Box>
				{/* Stale Leads */}
				<Box value={leadListingTabIndex} index={3}>
					<Box role="tabpanel" hidden={leadListingTabIndex !== 3} id={`simple-tabpanel-${3}`} aria-labelledby={`simple-tab-${3}`}>
						{isLoading ? (
							<CircularLoader />
						) : leadListingData.length === 0 ? (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									minHeight: '60vh',
									alignItems: 'center',
								}}>
								<Box>
									<img src={noData} alt="no documents" height={100} width={100} />
									<Typography style={{ textAlign: 'center' }}>No leads found</Typography>
								</Box>
							</Box>
						) : (
							leadListingTabIndex === 3 && (
								<LeadListingComponent
									handleClearFilter={handleClearFilter}
									handleDeleteFilterChip={handleDeleteFilterChip}
									tabName="stale"
									query={queryParams.toString()}
									paginationData={paginationData}
									data={leadListingData}
									leadPage={staleLeadPage}
									handleLeadPageChange={handleStaleLeadPageChange}
									transferMultipleLeadsArray={transferMultipleLeadsArray}
									handleTransferMultipleLeadsArray={handleTransferMultipleLeadsArray}
									selectedSalesEmpId={selectedSalesEmpId}
								/>
							)
						)}
					</Box>
				</Box>
				{/* TabPanel ends  */}
			</Box>
		</>
	)
}

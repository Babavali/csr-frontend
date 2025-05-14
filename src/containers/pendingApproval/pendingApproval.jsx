/* eslint-disable  no-unused-vars */
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import axios from '../../shared/axios'
import { toast } from 'react-toastify'
import { IconButton, Box, Divider, Tabs, Tab, Grid, useMediaQuery, Typography, Chip } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation'
import { useSelector } from 'react-redux'
import RefreshIcon from '@mui/icons-material/Refresh'
import EventIcon from '@mui/icons-material/Event'
import _ from 'lodash'
import usePagination from '../../components/pagination'
import CircularLoader from '../../components/common/loader/circularLoader'
import noData from '../../assets/no-data.svg'
import PendingApprovalListing from './components/pendingApprovalListing'
import FilterComponent from '../leads/myLeads/components/filterComponent'
import SalesEmpComponent from '../leads/myLeads/components/salesEmpComponent'
export default function PendingApproval() {
	const queryKeyMapping = {
		leadGeneratedDateFrom: 'lead_date_from',
		leadGeneratedDateTo: 'lead_date_to',

		mainStatus: 'status',
		subStatus: 'sub_status',

		enquirerName: 'enquirer_name',
		enquirerEmail: 'enquirer_email',
		enquirerPhoneNumber: 'enquirer_phone',
		enquirerCountry: 'enquirer_country_id',
		preferredLanguage: 'preferred_language',
		contactMeans: 'preferred_contact_means',

		patientName: 'patient_name',
		patientGender: 'patient_gender',
		patientDob: 'patient_birth_date',
		patientAddress: 'patient_address',
		patientPostalCode: 'patient_postal_code',
		patientCountry: 'patient_country_id',

		category: 'category_id',
		leadId: 'lead_id',
		leadSource: 'lead_source',
		treatmentIntensity: 'treatment_intensity',
	}
	const matches = useMediaQuery('(min-width: 600px)')
	const user = useSelector((state) => state.user)
	const [leadData, setLeadListingData] = useState([])
	const [selectedSalesEmpId, setSelectedSalesEmpId] = useState()
	const [selectedPartnerId, setSelectedPartnerId] = useState()
	const [isFilterVisible, setIsFilterVisible] = useState(false)
	const [paginationData, setPaginationData] = useState()
	const [totalLeads, setTotalLeads] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()
	// const [query] = useState();
	const initialSearchParams = new URLSearchParams(location.search)
	const [queryParams, setQueryParams] = useSearchParams()
	// const [, setParams] = useState();
	let pendingApprovalPage = 1

	pendingApprovalPage = parseInt(initialSearchParams.get('page'), 10) || 1

	const [pendingApprovalLeadPage, setPendingApprovalLeadPage] = useState(pendingApprovalPage)
	const [leadListingTabIndex, setLeadListingTabNumber] = useState(0)
	const [transferMultipleLeadsArray, setTransferMultipleLeadsArray] = useState([])
	const [openTransferMultipleLeadsModal, setOpenTransferMultipleLeadsModal] = useState(false)
	function handleTransferMultipleLeadsArray(arr) {
		setTransferMultipleLeadsArray(arr)
	}

	const getTodaysDate = () => {
		const date = new Date()
		return date.toISOString().split('T')[0]
	}

	const getQueryObject = (queryRawObject) => {
		// TODO: Remove this key mapping
		let queryObjectToBeMapped = _.pickBy(queryRawObject, (value) => value !== '')
		let replacedKeys = Object.keys(queryObjectToBeMapped)
			.filter((key) => key)
			.map((key) => {
				const newKey = queryKeyMapping[key] || key
				return { [newKey]: queryObjectToBeMapped[key] }
			})
		const queryObj = {
			page: 1,
			...replacedKeys.reduce((a, b) => Object.assign({}, a, b)),
		}
		return queryObj
	}

	const handleFilterSubmit = (filteringObj) => {
		const queryParamsObj = getQueryObject(filteringObj)
		setPendingApprovalLeadPage(1)
		if (!_.isEmpty(queryParamsObj)) {
			for (const key in queryParamsObj) {
				if (!queryParamsObj[key] || key === 'undefined') continue
				if (Object.hasOwnProperty.call(queryParamsObj, key)) {
					queryParams.set(key, queryParamsObj[key])
				}
			}
			setQueryParams(queryParams)
			fetchLeadListingData()
		}
	}

	const handleClearFilter = () => {
		setPendingApprovalLeadPage(1)
		setIsFilterVisible(false)
		// Deleting all the query keys and adding only page and page type query string
		for (const key in queryKeyMapping) {
			if (Object.hasOwnProperty.call(queryKeyMapping, key)) {
				const queryKey = queryKeyMapping[key]
				queryParams.delete(queryKey)
			}
		}
		queryParams.set('page', 1)
		setQueryParams(queryParams)
		fetchLeadListingData()
	}

	const handlePartnerChange = (partnerId) => {
		setSelectedPartnerId(partnerId)
	}

	const handleSalesEmpChange = (salesEmpId) => {
		setSelectedSalesEmpId(salesEmpId)
	}

	const fetchLeadListingData = useCallback(() => {
		setIsLoading(true)
		let url =
			'sales/leads/pending-approval' +
			// (selectedSalesEmpId ? `/${selectedSalesEmpId}` : ``) +
			(selectedSalesEmpId ? `?emp_id=${selectedSalesEmpId}&` : '?') +
			(queryParams ? `${queryParams}` : `page=${pendingApprovalLeadPage}`)
		axios
			.get(url)
			.then((res) => {
				setLeadListingData(res.data.data.data)
				setPaginationData(res.data.data.meta)
				setTotalLeads(res.data.data.meta.total)
				setIsLoading(false)
			})
			.catch((error) => {
				toast.error(error.response?.data.data.message, {
					position: 'bottom-left',
				})
				setIsLoading(false)
			})
	}, [
		queryParams,
		leadListingTabIndex,
		pendingApprovalLeadPage,
		selectedPartnerId,
		selectedSalesEmpId,
		user.isAdmin,
		user.isAuditor,
		user.userId,
	])

	useEffect(() => {
		fetchLeadListingData()
	}, [queryParams, fetchLeadListingData, leadListingTabIndex, selectedPartnerId, selectedSalesEmpId, pendingApprovalLeadPage, navigate])
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
	const Pagination = usePagination(leadData, perPage)

	const handlePendingApprovalLeadPageChange = (_event, pageNumber) => {
		setPendingApprovalLeadPage(pageNumber)
		Pagination.jump(pageNumber)
		queryParams.set('page', pageNumber)
		setQueryParams(queryParams)
		fetchLeadListingData()
	}

	return (
		<>
			<Box
				sx={{
					width: '95%',
					margin: 'auto',
				}}>
				<Grid item md={6} xs={12} lg={6}>
					<Box
						sx={{
							display: 'flex',
							gap: 2,
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}>
						<SalesEmpComponent handleSalesEmpChange={handleSalesEmpChange} />

						<IconButton color="inherit" style={{ padding: '0px' }} onClick={handleRefresh}>
							<RefreshIcon />
						</IconButton>
						{/* <IconButton color="inherit" aria-label="menu" style={{ padding: '0px' }} onClick={handleFilterOpen}>
							<FilterAltIcon />
						</IconButton>

						<FilterComponent
							handleClearFilter={handleClearFilter}
							open={isFilterVisible}
							onClose={handleFilterClose}
							onSubmit={handleFilterSubmit}
						/> */}
					</Box>
				</Grid>
				{/* TabPanel start */}
				<Box mt={4}>
					{isLoading ? (
						<CircularLoader />
					) : leadData.length === 0 ? (
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
						<PendingApprovalListing
							matches={matches}
							query={queryParams.toString()}
							paginationData={paginationData}
							data={leadData}
							leadPage={pendingApprovalLeadPage}
							handleLeadPageChange={handlePendingApprovalLeadPageChange}
							transferMultipleLeadsArray={transferMultipleLeadsArray}
							handleTransferMultipleLeadsArray={handleTransferMultipleLeadsArray}
						/>
					)}
				</Box>
				{/* TabPanel ends  */}
				{/* Cards */}
			</Box>
		</>
	)
}

/* eslint-disable no-unused-vars */
// React
import { useEffect, useState } from 'react'
// Packages
import axios from '../../shared/axios'
import { toast } from 'react-toastify'
// MUI Components
import { Box, Button, Chip, Divider, Tooltip, Typography, useMediaQuery } from '@mui/material'
// MUI Icons
import PersonIcon from '@mui/icons-material/Person'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
// Global Components
import CircularLoader from '../../components/common/loader/circularLoader'
// Local Components
import DashboardSummary from './components/dashboardSummary'
import DashboardAdvisorTable from './components/dashboardAdvisorTable'
import DashboardUserTable from './components/dashboardUserTable'
import DashboardURLTable from './components/dashboardURLTable'
import DashboardFilterModal from './components/dashboardFilterModal'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setDashboardFilter, resetDashboardFilter } from '../../slices/dashboardFilterSlice'
import wavingHandImage from '../../assets/Dashboard/waving_hand.gif'

export default function DashboardPage() {
	const dispatch = useDispatch()
	const dashboardFilter = useSelector((state) => state.dashboardFilterReducer.dashboardFilter)
	const matches = useMediaQuery('(min-width: 600px)')
	const user = useSelector((state) => state.user)
	const [isLoading, setIsLoading] = useState(false)
	const [dashboardSummaryData, setDashboardSummaryData] = useState([])
	const [advisorData, setAdvisorData] = useState([])
	const [advisorList, setAdvisorList] = useState([])
	const [urlData, setUrlData] = useState([])
	const [isUrlDataLoading, setIsUrlDataLoading] = useState(false)
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [filterCount, setFilterCount] = useState(0)

	const getAdvisorData = () => {
		setIsLoading(true)
		setIsUrlDataLoading(true)
		let count = 0
		Object.entries(dashboardFilter).forEach(([key, value]) => {
			if (value) {
				count++
			}
		})
		setFilterCount(count)

		if (user.isAdmin || user.isAuditor) {
			axios
				.get('sales/leads/all-tiers-lead-count', {
					params: { dashboardFilter },
				})
				.then((res) => {
					setDashboardSummaryData(res.data.data)
				})
				.catch((error) => {
					toast.error(error.response?.data.data.message, {
						position: 'bottom-left',
					})
				})
			axios
				.get('sales/leads/admin-dashboard', {
					params: dashboardFilter,
				})
				.then((res) => {
					setAdvisorData(res.data.data)
					setIsLoading(false)
				})
				.catch((err) => {
					setIsLoading(false)
				})
			axios
				.get('sales/leads/web-seo-url-breakdown', {
					params: dashboardFilter,
				})
				.then((res) => {
					setUrlData(res.data.data)
					setIsUrlDataLoading(false)
				})
		} else {
			axios
				.get('sales/leads/all-tiers-lead-count', {
					params: { ...dashboardFilter, emp_id: user.userId },
				})
				.then((res) => {
					setDashboardSummaryData(res.data.data)
				})
				.catch((error) => {
					toast.error(error.response?.data.data.message, {
						position: 'bottom-left',
					})
				})
			axios
				.get('sales/leads/admin-dashboard', {
					params: { ...dashboardFilter, emp_id: user.userId },
				})
				.then((res) => {
					setAdvisorData(res.data.data)
					setIsLoading(false)
				})
				.catch((err) => {
					setIsLoading(false)
				})
			setIsLoading(false)
		}
	}

	const handleURLTablePageChange = (page) => {
		setIsUrlDataLoading(true)
		axios
			.get('sales/leads/web-seo-url-breakdown', {
				params: { ...dashboardFilter, page: page },
			})
			.then((res) => {
				setUrlData(res.data.data)
				setIsUrlDataLoading(false)
			})
	}
	useEffect(getAdvisorData, [dashboardFilter])

	const fetchAdvisorList = () => {
		axios.get(`sales/employee/sale-emp/search?name=`).then((response) => {
			setAdvisorList(response.data.data)
		})
	}
	useEffect(fetchAdvisorList, [])

	// Filter Start
	const applyFilter = (filterObj) => {
		setIsFilterOpen(false)
		dispatch(setDashboardFilter(filterObj))
	}
	const clearFilter = () => {
		setIsFilterOpen(false)
		dispatch(resetDashboardFilter())
	}
	// Filter End

	// Event Handlers
	const handleOpenFilterModal = () => {
		setIsFilterOpen(true)
	}
	const handleCloseFilterModal = () => {
		setIsFilterOpen(false)
	}
	const getFilterPlaceholder = (key) => {
		if (key === 'lead_date_from') {
			return 'From'
		} else if (key === 'lead_date_to') {
			return 'To'
		} else if (key === 'only_international_leads') {
			return 'International'
		} else if (key === 'lead_source') {
			return 'Lead Source'
		} else if (key === 'treatment_country') {
			return 'Country'
		} else if (key === 'emp_ids') {
			return 'Advisor'
		}
	}
	const getFilterValue = (key, value) => {
		if (key === 'emp_ids') {
			const advisorArr = value.split(',')
			let advisorString = ''
			advisorArr.forEach((advisorID, index) => {
				advisorString += advisorList.filter((advisorObj) => advisorObj.id == advisorID)[0]?.full_name
				if (index !== advisorArr.length - 1) {
					advisorString += ', '
				}
			})
			return advisorString
		}
		return value
	}
	const deleteFilterChip = (filterKey) => {
		dispatch(setDashboardFilter({ ...dashboardFilter, [filterKey]: null }))
	}
	return (
		<Box width="100%" display="flex" flexDirection="column" justifyContent="center" gap={2} py={4} px={matches ? 7 : 2}>
			{isLoading ? (
				<CircularLoader />
			) : (
				<Box>
					{/* Username and Filter */}
					<Box>
						<Box display="flex" justifyContent="space-between" mb={1}>
							{/* Username */}
							<Box display="flex" alignItems="center">
								{/* <PersonIcon color="primary" fontSize="large" sx={{ mr: 2 }} /> */}
								<Typography variant="h5" color="#3F3F3F" sx={{ mr: 2 }}>
									Welcome Back {user.userName}
								</Typography>
								<img src={wavingHandImage} height="35px" width="35px" alt="Hot" />
							</Box>
							{/* Filter */}
							<Tooltip title="Filters" arrow>
								<Button variant="contained" size="small" sx={{ borderRadius: '50%', minWidth: 0, padding: '8px' }}>
									<FilterAltIcon onClick={handleOpenFilterModal} />
								</Button>
							</Tooltip>
						</Box>
						<Divider sx={{ mb: 2 }} />
					</Box>
					<Box mb={2}>
						{Object.keys(dashboardFilter).map((filterKey, index) => {
							if (dashboardFilter[filterKey]) {
								return (
									<Chip
										key={index}
										label={`${getFilterPlaceholder(filterKey)}: ${getFilterValue(
											filterKey,
											dashboardFilter[filterKey]
										)}`}
										onDelete={() => {
											deleteFilterChip(filterKey)
										}}
										sx={{ mr: 2 }}
									/>
								)
							}
						})}
						{filterCount > 0 && (
							<Button variant="outlined" color="error" onClick={clearFilter}>
								Clear Filter
							</Button>
						)}
					</Box>
					<DashboardSummary matches={matches} user={user} dashboardSummaryData={dashboardSummaryData} />
					{user.isAdmin || user.isAuditor ? (
						<DashboardAdvisorTable
							userId={user.userId}
							advisorData={advisorData}
							dashboardFilter={dashboardFilter}
							sx={{ marginBottom: 10 }}
						/>
					) : (
						<DashboardUserTable advisorData={advisorData} sx={{ marginBottom: 10 }} />
					)}
					{user.isAdmin || user.isAuditor ? (
						<DashboardURLTable
							urlData={urlData}
							dashboardFilter={dashboardFilter}
							isUrlDataLoading={isUrlDataLoading}
							handlePageChange={handleURLTablePageChange}
						/>
					) : (
						''
					)}
				</Box>
			)}
			{/* Filter Modal */}
			<DashboardFilterModal
				open={isFilterOpen}
				isAdmin={user.isAdmin}
				isAuditor={user.isAuditor}
				dashboardFilter={dashboardFilter}
				advisorList={advisorList}
				applyFilter={applyFilter}
				clearFilter={clearFilter}
				onClose={handleCloseFilterModal}
			/>
		</Box>
	)
}

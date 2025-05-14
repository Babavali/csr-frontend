/* eslint-disable no-unused-vars */

// Packages
import axios from '../../shared/axios'
// import { toast } from 'react-toastify'
// MUI Components
import { Box, Button, Chip, Divider, Tooltip, Typography, useMediaQuery } from '@mui/material'
// MUI Icons
// import PersonIcon from '@mui/icons-material/Person'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
// Global Components
import CircularLoader from '../../components/common/loader/circularLoader'
// Local Components
import ArrivalSheet from './components/arrivalSheetTable'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import wavingHandImage from '../../assets/Dashboard/waving_hand.gif'
//React Components
import { useState, useEffect } from 'react'
//ArrivalSheetFilterModal
import ArrivalSheetFilterModal from './components/arrivalSheetFilterModal'

import { setArrivalSheetFilter, resetArrivalSheetFilter } from '../../slices/arrivalSheetFilterSlice'
//toast
import { toast } from 'react-toastify'

const ArrivalSheetPage = () => {
	const dispatch = useDispatch()
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [filterCount, setFilterCount] = useState(0)
	const arrivalSheetFilter = useSelector((state) => state.arrivalSheetFilterReducer.arrivalSheetFilter)
	const [isLoading, setIsLoading] = useState(false)
	const [isArrivalSheetDataLoading, setIsArrivalSheetDataLoading] = useState(true)
	const [arrivalSheetData, setArrivalSheetData] = useState([])
	const [advisorList, setAdvisorList] = useState([])
	const matches = useMediaQuery('(min-width: 600px)')
	const [facilityList, setFacilityList] = useState([])
	const [countryList, setCountryList] = useState([])
	const [currentPage, setCurrentPage] = useState(1)

	const getArrivalSheetData = () => {
		setIsLoading(true)
		setIsArrivalSheetDataLoading(true)
		let count = 0
		Object.entries(arrivalSheetFilter).forEach(([key, value]) => {
			if (value) {
				count++
			}
		})
		setFilterCount(count)
		axios.get('sales/leads/arrival-sheet', { params: { ...arrivalSheetFilter, page: currentPage } }).then((res) => {
			setArrivalSheetData(res.data.data)
			setCurrentPage(res.data.data.meta.page)
			setIsArrivalSheetDataLoading(false)
		})
		setIsLoading(false)
	}

	const fetchAdvisorList = () => {
		axios.get(`sales/employee/sale-emp/search?name=`).then((response) => {
			setAdvisorList(response.data.data)
		})
	}
	const fetchFacilityList = () => {
		axios.get(`/search/facility?name=`).then((response) => {
			setFacilityList(response.data.data)
		})
	}
	useEffect(() => {
		getArrivalSheetData()
	}, [currentPage, arrivalSheetFilter, filterCount])

	const getCountryList = () => {
		axios.get(`search/country?name`).then((res) => {
			setCountryList(res.data.data)
		})
	}

	useEffect(() => {
		getCountryList()
		fetchAdvisorList()
		fetchFacilityList()
	}, [])

	// Event Handlers
	const handleOpenFilterModal = () => {
		setIsFilterOpen(true)
	}
	const handleCloseFilterModal = () => {
		setIsFilterOpen(false)
	}

	const applyFilter = (filterObj) => {
		setIsFilterOpen(false)
		dispatch(setArrivalSheetFilter(filterObj))
	}

	const clearFilter = () => {
		setIsFilterOpen(false)
		dispatch(resetArrivalSheetFilter())
	}

	const getFilterPlaceholder = (key) => {
		if (key === 'arrival_date_from') {
			return 'Arrival From'
		} else if (key === 'arrival_date_to') {
			return 'Arrival To'
		} else if (key === 'lead_id') {
			return 'Lead ID'
		} else if (key === 'source_url') {
			return 'Lead Source'
		} else if (key === 'patient_country_id') {
			return 'Country'
		} else if (key === 'emp_ids') {
			return 'Advisor(s)'
		} else if (key === 'patient_name') {
			return 'Patient'
		} else if (key === 'arrival_type') {
			return 'Arrival Type'
		} else if (key === 'status') {
			return 'Status'
		} else if (key === 'field_person_name') {
			return 'Field Person'
		} else if (key === 'visa_expiry_date_from') {
			return 'Visa Expiry From'
		} else if (key === 'visa_expiry_date_to') {
			return 'Visa Expiry To'
		} else if (key === 'facility_id') {
			return 'Hospital'
		} else if (key === 'lead_date_from') {
			return 'From'
		} else if (key === 'lead_date_to') {
			return 'To'
		}
	}
	const getFilterValue = (key, value) => {
		if (key === 'emp_ids') {
			// if (value.length > 1) {
			// 	const advisorArr = value.split(',')
			// 	let advisorString = ''
			// 	advisorArr.forEach((advisorID, index) => {
			// 		advisorString += advisorList.filter((advisorObj) => advisorObj.id == advisorID)[0]?.full_name
			// 		if (index !== advisorArr.length - 1) {
			// 			advisorString += ', '
			// 		}
			// 	})
			// 	return advisorString

			const advisorString = advisorList.filter((advisorObj) => advisorObj.id == value)[0]?.full_name
			return advisorString
		}
		if (key === 'facility_id') {
			return facilityList.filter((facility) => facility.id == value)[0]?.name
		}
		if (key == 'patient_country_id') {
			return countryList.filter((country) => country.id == value)[0]?.name
		}
		return value
	}
	const deleteFilterChip = (filterKey) => {
		dispatch(setArrivalSheetFilter({ ...arrivalSheetFilter, [filterKey]: null }))
	}

	return (
		<Box width="100%" display="flex" flexDirection="column" justifyContent="center" gap={2} py={4} px={matches ? 7 : 2}>
			{/* {JSON.stringify(arrivalSheetFilter)} */}
			{isLoading ? (
				<CircularLoader />
			) : (
				<Box>
					{/* Username and Filter */}
					<Box mb={2}>
						{Object.keys(arrivalSheetFilter).map((filterKey, index) => {
							if (arrivalSheetFilter[filterKey]) {
								return (
									<Chip
										key={index}
										label={`${getFilterPlaceholder(filterKey)}: ${getFilterValue(
											filterKey,
											arrivalSheetFilter[filterKey]
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

					{!isLoading && (
						<ArrivalSheet
							arrivalSheetData={arrivalSheetData}
							isArrivalSheetDataLoading={isArrivalSheetDataLoading}
							handlePageChange={(page) => setCurrentPage(page)}
							handleOpenFilterModal={handleOpenFilterModal}
							arrivalSheetFilter={arrivalSheetFilter}
						/>
					)}
				</Box>
			)}
			<ArrivalSheetFilterModal
				open={isFilterOpen}
				arrivalSheetFilter={arrivalSheetFilter}
				advisorList={advisorList}
				facilityList={facilityList}
				countryList={countryList}
				applyFilter={applyFilter}
				clearFilter={clearFilter}
				onClose={handleCloseFilterModal}
			/>
		</Box>
	)
}

export default ArrivalSheetPage

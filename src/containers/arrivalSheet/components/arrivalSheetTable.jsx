/*eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
//axios
import axios from '../../../shared/axios'
//Material UI
import {
	Box,
	Checkbox,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	tableCellClasses,
	Pagination,
	Chip,
	Button,
	Divider,
} from '@mui/material'
//FilterIcon
import FilterAltIcon from '@mui/icons-material/FilterAlt'
//@emotion styled Components
import styled from '@emotion/styled'
//Global Components
import CircularLoader from '../../../components/common/loader/circularLoader'
import DownloadIcon from '@mui/icons-material/Download'
import userDetailsSlice from '../../../slices/userDetailsSlice'
import { useSelector } from 'react-redux'

const ArrivalSheet = ({ arrivalSheetData, isArrivalSheetLoading, handlePageChange, handleOpenFilterModal, arrivalSheetFilter }) => {
	const paginationData = arrivalSheetData?.meta
	const page = paginationData?.page
	// const perPage = paginationData.per_page
	const pageCount = paginationData?.page_count
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}

	const TableRowStyled = styled(TableRow)`
		&:nth-of-type(odd) {
		}
		&:nth-of-type(even) {
			background-color: #f8f9fa;
		}
		& > td {
		}
	`

	const tempIsCheckedArr = []
	for (let i = 0; i < 25; i++) {
		tempIsCheckedArr.push(false)
	}
	const [selectedLeadArr, setSelectedLeadArr] = useState([])

	const [isCheckedArr, setIsCheckedArr] = useState(tempIsCheckedArr)

	const selectLeadHandler = (event, lead, index) => {
		let isChecked = event.target.checked
		setSelectedLeadArr((prevSelectedLeadArr) => {
			if (isChecked) {
				setIsCheckedArr((prevIsCheckedArr) => {
					const newArr = [...prevIsCheckedArr]
					newArr[index] = true
					return newArr
				})
				return [...prevSelectedLeadArr, lead]
			} else {
				setIsCheckedArr((prevIsCheckedArr) => {
					const newArr = [...prevIsCheckedArr]
					newArr[index] = false
					return newArr
				})
				return prevSelectedLeadArr.filter((selectedLead) => selectedLead.id !== lead.id)
			}
		})
	}

	const selectAllLeadsHandler = (event) => {
		let tempArr = []
		let tempIsCheckedArr = []
		const isChecked = event.target.checked
		if (isChecked) {
			arrivalSheetData?.data.forEach((lead) => {
				tempArr.push(lead)
				tempIsCheckedArr.push(true)
			})
		}

		setSelectedLeadArr(tempArr)
		setIsCheckedArr(tempIsCheckedArr)
	}

	const getArrivalChipColor = (arrivalType) => {
		if (arrivalType === 'FRESH') {
			return '#13AD5B'
		} else if (arrivalType === 'REPEAT') {
			return '#F6DB4C'
		} else if (arrivalType === 'REFERRAL') {
			return '#7337F2'
		} else if (arrivalType === 'REPEAT REFERRAL') {
			return '#F29B34'
		} else return '#3667E3'
	}

	// CSV Start
	const headers = {
		patient_name: 'Patient Name',
		patient_country: 'Country',
		id: 'Lead ID',
		facility_name: 'Hospital',
		arrival_at: 'Arrival Date',
		arrival_type: 'Lead Type',
		registration_number: 'Reg. Number',
		created_at: 'Created Date',
		current_status: 'Status',
		primary_emp: 'Primary Advisor',
		advisor_emp: 'Secondary Advisor',
		field_person_name: 'Field Person Name',
		source_url: 'Source',
		estimated_invoice: 'Estimate Invoice',
		actual_invoice: 'Actual Invoice',
		hotel_name: 'Hotel Name',
		hotel_type: 'Hotel Type',
		visa_expiry_at: 'Visa Expiry Date',
		passport_number: 'Passport Number',
		is_shared: 'Shared',
	}
	const [arrivalCSVData, setArrivalCSVData] = useState([])
	const handleDownloadAsCSV = async () => {
		await axios.get('sales/leads/arrival-sheet/csv', { params: arrivalSheetFilter }).then((res) => {
			setArrivalCSVData(res.data.data)
		})
	}
	useEffect(() => {
		if (arrivalCSVData.length > 0) {
			startCSVDownload()
		}
	}, [arrivalCSVData])

	const startCSVDownload = () => {
		const arrivalCSVDataArr = arrivalCSVData.map((arrivalObj) => {
			return {
				patient_name: arrivalObj.patient_name,
				patient_country: arrivalObj.patient_country,
				id: arrivalObj.id,
				facility_name: arrivalObj.facility_name,
				arrival_at: arrivalObj.arrival_at,
				arrival_type: arrivalObj.arrival_type,
				registration_number: arrivalObj.registration_number,
				created_at: arrivalObj.created_at,
				current_status: arrivalObj.current_status,
				primary_emp: arrivalObj.primary_emp,
				advisor_emp: arrivalObj.advisor_emp,
				field_person_name: arrivalObj.field_person_name,
				source_url: arrivalObj.source_url,
				estimated_invoice: arrivalObj.estimated_invoice,
				actual_invoice: arrivalObj.actual_invoice,
				hotel_name: arrivalObj.hotel_name,
				hotel_type: arrivalObj.hotel_type,
				visa_expiry_at: arrivalObj.visa_expiry_at,
				passport_number: arrivalObj.passport_number,
				is_shared: arrivalObj.is_shared,
			}
		})
		const fileTitle = `arrivalSheetData`
		exportCSVFile(headers, arrivalCSVDataArr, fileTitle)
	}
	function exportCSVFile(headers, items, fileTitle) {
		if (headers) {
			items.unshift(headers)
		}
		//Convert Object to JSON
		let jsonObject = JSON.stringify(items)
		let csv = convertToCSV(jsonObject)
		let exportedFilenmae = fileTitle + '.csv' || 'export.csv'
		let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, exportedFilenmae)
		} else {
			let link = document.createElement('a')
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				let url = URL.createObjectURL(blob)
				link.setAttribute('href', url)
				link.setAttribute('download', exportedFilenmae)
				link.style.visibility = 'hidden'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			}
		}
	}
	function convertToCSV(objArray) {
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
		let str = ''

		for (let i = 0; i < array.length; i++) {
			let line = ''
			for (let index in array[i]) {
				if (line != '') line += ','

				line += array[i][index]
			}

			str += line + '\r\n'
		}

		return str
	}
	// CSV End
	return (
		<>
			<Box sx={{ mb: 6 }}></Box>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h5" sx={{ mb: 2, color: '#505050', fontWeight: 550 }}>
					Arrival Sheet
				</Typography>
				<Box display="flex" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
					{/* CSVDownload */}
					{!user.isAuditor && user.userId !== 82 && isAllowed('get_partner_leads_csv') && (
						<Tooltip arrow title="Export as CSV" onClick={handleDownloadAsCSV}>
							<IconButton color="success" size="large">
								<DownloadIcon />
							</IconButton>
						</Tooltip>
					)}

					{/* Filter */}
					<Tooltip title="Filters" arrow>
						<Button variant="contained" size="small" sx={{ borderRadius: '50%', minWidth: 0, padding: '8px' }}>
							<FilterAltIcon onClick={handleOpenFilterModal} />
						</Button>
					</Tooltip>
				</Box>
			</Box>
			{isArrivalSheetLoading ? (
				<CircularLoader />
			) : (
				<>
					<TableContainer sx={{ maxWidth: '96vw', margin: 'auto' }}>
						<Table
							stickyHeader
							aria-label="Table"
							sx={{
								[`& .${tableCellClasses.root}`]: {
									textAlign: 'center',
									border: '1px solid lightgray',
									maxWidth: '200px',
									wordWrap: 'break-word',
								},
							}}>
							<TableHead sx={{ backgroundColor: '#818181' }}>
								<TableRow>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										<Checkbox onClick={(event) => selectAllLeadsHandler(event)} />
									</TableCell>

									<TableCell
										sx={{
											fontWeight: 'bold',
											whiteSpace: 'nowrap',
											background: 'white',
											boxShadow: '0px 0px 5px #D8D8D8',
										}}
										rowSpan={2}>
										Lead ID
									</TableCell>

									<TableCell
										sx={{
											fontWeight: 'bold',
											whiteSpace: 'nowrap',
											position: 'sticky',
											left: -1,
											zIndex: 3,
										}}
										rowSpan={2}>
										Patient Name
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Hospital
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Hotel Name
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Hotel Type
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Country
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Arrival Date
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Lead Type
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Reg.Number
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Created Date
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Status
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} colSpan={2}>
										Advisor
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Field Person Name
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Source
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} colSpan={2}>
										Invoice
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Visa Expiry Date
									</TableCell>
									<TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} rowSpan={2}>
										Passport Number
									</TableCell>
								</TableRow>
								<TableRow
									sx={{
										[`& .${tableCellClasses.root}`]: {
											lineHeight: 1,
										},
									}}>
									{/* Primary Advisor */}
									<TableCell size="small" sx={{ color: '#FFBE0B' }}>
										Primary
									</TableCell>
									{/* Secondary Advisor */}
									<TableCell size="small" sx={{ color: '#6383D4' }}>
										Secondary
									</TableCell>
									{/* Invoice Estimate */}
									<TableCell size="small" sx={{ color: '#6383D4' }}>
										Estimate
									</TableCell>
									{/* Invoice Actual */}
									<TableCell size="small" sx={{ color: '#FFBE0B' }}>
										Actual
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{arrivalSheetData?.data?.map((lead, index) => (
									<TableRowStyled key={lead.id}>
										<TableCell>
											<Checkbox
												sx={{
													fontWeight: 'bold',
													whiteSpace: 'nowrap',
													position: 'sticky',
													left: -1,
													background: 'white',
													zIndex: 3,
												}}
												onClick={(event) => selectLeadHandler(event, lead, index)}
												checked={isCheckedArr[index]}
											/>
										</TableCell>
										<TableCell>{lead.id}</TableCell>
										<TableCell
											sx={{ whiteSpace: 'normal', position: 'sticky', left: -1, background: 'white', zIndex: 3 }}>
											<Typography variant="body1" fontWeight="700" color="#818181">
												{lead.patient_name ? lead.patient_name : '---'}
												{lead.is_shared === 'true' && (
													<Chip
														sx={{
															bgcolor: 'white',
															border: '1px solid',
															borderRadius: '20px',
															borderColor: '#87B7E7',
															color: '#87B7E7',
														}}
														label={'Shared'}
													/>
												)}
											</Typography>
										</TableCell>
										<TableCell>{lead.facility_name ? lead.facility_name : '---'}</TableCell>
										<TableCell>{lead.hotel_name ? lead.hotel_name : '---'}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap' }}>
											{lead.hotel_type ? lead.hotel_type.replaceAll('_', ' ') : '---'}
										</TableCell>
										<TableCell>{lead.patient_country ? lead.patient_country : '---'}</TableCell>
										<TableCell>{lead.arrival_at ? lead.arrival_at : '---'}</TableCell>
										<TableCell>
											{lead.arrival_type ? (
												<Chip
													sx={{
														bgcolor: getArrivalChipColor(lead.arrival_type),
														borderRadius: '20px',
														height: '22px',
														color: '#FFFFFF',
														width: '160px',
														maxHeight: '20px',
													}}
													label={lead.arrival_type ? lead.arrival_type : '---'}
												/>
											) : (
												<Chip sx={{ width: '160px', maxHeight: '20px' }} label="---" />
											)}
										</TableCell>
										<TableCell>{lead.registration_number ? lead.registration_number : '---'}</TableCell>
										<TableCell>{lead.created_at ? lead.created_at : '---'}</TableCell>
										<TableCell>
											<Chip
												sx={{
													bgcolor: '#DCE3F5',
													border: '2px solid black',
													borderRadius: '20px',
													borderColor: '#4F73CF',
													height: '22px',
													color: '#4F73CF',
												}}
												label={lead.current_status ? lead.current_status : '---'}
											/>
										</TableCell>
										<TableCell>{lead.primary_emp ? lead.primary_emp : '---'}</TableCell>
										<TableCell>{lead.advisor_emp ? lead.advisor_emp : '---'}</TableCell>
										<TableCell>{lead.field_person_name ? lead.field_person_name : '---'}</TableCell>
										<TableCell>{lead.source_url ? lead.source_url : '---'}</TableCell>
										<TableCell>{lead.estimated_invoice ? lead.estimated_invoice : '---'}</TableCell>
										<TableCell>{lead.actual_invoice ? lead.actual_invoice : '---'}</TableCell>
										<TableCell>{lead.visa_expiry_at ? lead.visa_expiry_at : '---'}</TableCell>
										<TableCell>{lead.passport_number ? lead.passport_number : '---'}</TableCell>
									</TableRowStyled>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Box display="flex" justifyContent="center" my={2}>
						{page && (
							<Pagination
								count={pageCount}
								color="primary"
								page={page}
								onChange={(event, value) => handlePageChange(value)}
								shape="rounded"
							/>
						)}
					</Box>
				</>
			)}
		</>
	)
}

export default ArrivalSheet

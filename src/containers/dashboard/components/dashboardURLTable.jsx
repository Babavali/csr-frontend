/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from '../../../shared/axios'
import styled from '@emotion/styled'
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Pagination,
	tableCellClasses,
	IconButton,
	Tooltip,
} from '@mui/material'
// Global Components
import CircularLoader from '../../../components/common/loader/circularLoader'
import DownloadIcon from '@mui/icons-material/Download'

import { tierChipColor } from '../../../mixins/chipColor'
import userDetailsSlice from '../../../slices/userDetailsSlice'
import { useSelector } from 'react-redux'

export default function DashboardURLTable(props) {
	const TableRowStyled = styled(TableRow)`
		&:nth-of-type(odd) {
		}
		&:nth-of-type(even) {
			background-color: #fdf4ff;
		}
		& > td {
		}
	`
	const isUrlDataLoading = props.isUrlDataLoading
	const urlData = props.urlData.data
	const paginationData = props.urlData.meta
	const handlePageChange = props.handlePageChange
	const dashboardFilter = props.dashboardFilter
	const page = paginationData?.page
	const perPage = paginationData?.per_page
	const pageCount = paginationData?.page_count
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}

	// CSV Start
	const headers = {
		url: 'URL',
		total: 'Lead Count',
		domestic: 'Domestic Leads',
		international: 'International Leads',
		hot: 'Hot',
		warm: 'Warm',
		cold: 'Cold',
		valid: 'Valid',
		invalid: 'Invalid',
		ip: 'IP',
		op: 'OP',
		ip_percentage: 'IP Percentage',
		op_percentage: 'OP Percentage',
		patients_arrived: 'Arrived',
		video_calls_done: 'Video Calls',
		estimated_revenue: 'Estimated Revenue',
		actual_revenue: 'Actual Revenue',
	}
	const [urlCSVData, setUrlCSVData] = useState([])
	const handleDownloadAsCSV = async () => {
		await axios
			.get('sales/leads/web-seo-url-breakdown/csv', {
				params: dashboardFilter,
			})
			.then((res) => {
				setUrlCSVData(res.data.data)
			})
	}
	useEffect(() => {
		if (urlCSVData.length > 0) {
			startCSVDownload()
		}
	}, [urlCSVData])
	const startCSVDownload = () => {
		const urlCSVDataArr = []
		urlCSVData.forEach((URLObj) => {
			urlCSVDataArr.push({
				url: URLObj.url,
				total: URLObj.total,
				domestic: URLObj.domestic,
				international: URLObj.international,
				hot: URLObj.hot,
				warm: URLObj.warm,
				cold: URLObj.cold,
				valid: URLObj.valid,
				invalid: URLObj.invalid,
				ip: URLObj.ip,
				op: URLObj.op,
				ip_percentage: URLObj.ip_percentage,
				op_percentage: URLObj.op_percentage,
				patients_arrived: URLObj.patients_arrived,
				video_calls_done: URLObj.video_calls_done,
				estimated_revenue: URLObj.estimated_revenue,
				actual_revenue: URLObj.actual_revenue,
			})
		})
		const fileTitle = `URLBreakdown`
		exportCSVFile(headers, urlCSVDataArr, fileTitle)
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
			<Box mb="6"></Box>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h5" sx={{ mb: 2, color: '#505050', fontWeight: 550 }}>
					URL Breakdown
				</Typography>
				{!user.isAuditor && isAllowed('get_partner_leads_csv') && user.userId !== 82 && (
					<Tooltip arrow title="Export as CSV" onClick={handleDownloadAsCSV}>
						<IconButton color="success" size="large">
							<DownloadIcon />
						</IconButton>
					</Tooltip>
				)}
			</Box>
			{isUrlDataLoading ? (
				<CircularLoader />
			) : (
				<>
					<TableContainer>
						<Table
							sx={{
								[`& .${tableCellClasses.root}`]: {
									textAlign: 'center',
									border: '1px solid lightgray',
									maxWidth: '200px',
									wordWrap: 'break-word',
								},
							}}>
							<TableHead
								sx={{
									backgroundColor: '#FCE5FF',
									[`& .${tableCellClasses.root}`]: {
										color: '#7c3aed',
										fontWeight: 550,
									},
								}}>
								<TableRow>
									<TableCell
										rowSpan={2}
										sx={{
											minWidth: '200px',
											left: -1,
											boxShadow: '0px 0px 3px lightgray',
											zIndex: 1,
										}}>
										URL
									</TableCell>
									<TableCell rowSpan={2}>Lead Count</TableCell>
									<TableCell colSpan={2}>Lead Origin</TableCell>
									<TableCell colSpan={3}>Lead Tier</TableCell>
									<TableCell colSpan={2}>Validity</TableCell>
									<TableCell colSpan={4}>Treatment Types</TableCell>
									<TableCell rowSpan={2}>Arrivals</TableCell>
									<TableCell rowSpan={2}>Video Calls</TableCell>
									<TableCell colSpan={2}>Revenue (₹)</TableCell>
								</TableRow>
								<TableRow
									sx={{
										[`& .${tableCellClasses.root}`]: {
											lineHeight: 1,
										},
									}}>
									{/* Lead Origin */}
									<TableCell size="small">Domestic</TableCell>
									<TableCell size="small">International</TableCell>
									{/* Lead Tier */}
									<TableCell size="small" sx={{ color: tierChipColor('Hot') }}>
										Hot
									</TableCell>
									<TableCell size="small" sx={{ color: tierChipColor('Warm') }}>
										Warm
									</TableCell>
									<TableCell size="small" sx={{ color: tierChipColor('Cold') }}>
										Cold
									</TableCell>
									{/* Validity */}
									<TableCell size="small" sx={{ color: 'green' }}>
										Valid
									</TableCell>
									<TableCell size="small" sx={{ color: 'red' }}>
										Invalid
									</TableCell>
									{/* Treatment Types */}
									<TableCell size="small">IP</TableCell>
									<TableCell size="small">OP</TableCell>
									<TableCell size="small">IP %</TableCell>
									<TableCell size="small">OP %</TableCell>
									{/* Revenue */}
									<TableCell size="small">Estimated</TableCell>
									<TableCell size="small">Actual</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{urlData?.map((urlObj, index) => {
									return (
										<>
											<TableRowStyled key={urlObj.url}>
												{/* Advisor Name */}
												<TableCell
													sx={{
														position: 'sticky',
														left: -1,
														backgroundColor: index % 2 === 0 ? 'white' : '#fdf4ff',
														boxShadow: '0px 0px 3px lightgray',
														zIndex: 1,
													}}>
													{urlObj.url}
												</TableCell>
												{/* Lead Count */}
												<TableCell>{urlObj.total}</TableCell>
												{/* Lead Origin */}
												<TableCell>{urlObj.domestic}</TableCell>
												<TableCell>{urlObj.international}</TableCell>
												{/* Lead Tier */}
												<TableCell>{urlObj.hot}</TableCell>
												<TableCell>{urlObj.warm}</TableCell>
												<TableCell>{urlObj.cold}</TableCell>
												{/* Validity */}
												<TableCell>{urlObj.valid}</TableCell>
												<TableCell>{urlObj.invalid}</TableCell>
												{/* Treatement Types */}
												<TableCell>{urlObj.ip}</TableCell>
												<TableCell>{urlObj.op}</TableCell>
												<TableCell>{urlObj.ip_percentage}</TableCell>
												<TableCell>{urlObj.op_percentage}</TableCell>
												{/* Total Arrival */}
												<TableCell>{urlObj.patients_arrived}</TableCell>
												{/* Video Calls */}
												<TableCell>{urlObj.video_calls_done}</TableCell>
												{/* Revenue */}
												<TableCell>{urlObj.estimated_revenue}</TableCell>
												<TableCell>{urlObj.actual_revenue}</TableCell>
											</TableRowStyled>
										</>
									)
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<Box display="flex" justifyContent="center" my={2}>
						<Pagination
							count={pageCount}
							color="primary"
							page={page}
							onChange={(event, value) => handlePageChange(value)}
							shape="rounded"
						/>
					</Box>
				</>
			)}
		</>
	)
}

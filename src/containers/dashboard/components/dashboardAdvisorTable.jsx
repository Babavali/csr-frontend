/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from '../../../shared/axios'
import {
	Box,
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
} from '@mui/material'
import { tierChipColor } from '../../../mixins/chipColor'
import DownloadIcon from '@mui/icons-material/Download'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
export default function DashboardAdvisorTable(props) {
	const userId = props.userId
	const advisorData = props.advisorData
	const dashboardFilter = props.dashboardFilter
	const [focusedAdvisor, setFocusedAdvisor] = useState(0)
	const focusAdvisor = (advisorID) => {
		if (focusedAdvisor !== advisorID) {
			setFocusedAdvisor(advisorID)
		} else {
			setFocusedAdvisor(-1)
		}
	}
	// CSV Start
	const headers = {
		sales_emp_id: 'Advisor ID',
		sales_emp_name: 'Advisor Name',
		url: 'URL',
		ppc: 'PPC Lead Count',
		ppc_manual: 'PPC Manual Lead Count',
		seo: 'SEO Lead Count',
		seo_manual: 'SEO Manual Lead Count',
		referral: 'Referral',
		total: 'Total Lead Count',
		domestic: 'Domestic Leads',
		international: 'International Leads',
		hot: 'Hot',
		warm: 'Warm',
		cold: 'Cold',
		valid: 'Valid',
		invalid: 'Invalid',
		close: 'Close',
		ip: 'IP',
		op: 'OP',
		ip_percentage: 'IP Percentage',
		op_percentage: 'OP Percentage',
		patients_arrived: 'Arrived',
		video_calls_done: 'Video Calls',
		estimated_revenue: 'Estimated Revenue',
		actual_revenue: 'Actual Revenue',
	}
	const [advisorCSVData, setAdvisorCSVData] = useState([])
	const handleDownloadAsCSV = async () => {
		await axios
			.get('sales/leads/admin-dashboard', {
				params: dashboardFilter,
			})
			.then((res) => {
				setAdvisorCSVData(res.data.data)
			})
	}
	useEffect(() => {
		if (advisorCSVData.length > 0) {
			startCSVDownload()
		}
	}, [advisorCSVData])
	const startCSVDownload = () => {
		const advisorCSVDataArr = []
		advisorCSVData.forEach((advisorObj) => {
			advisorCSVDataArr.push({
				sales_emp_id: advisorObj.sales_emp_id,
				sales_emp_name: advisorObj.sales_emp_name,
				url: 'Overall',
				ppc: advisorObj.ppc,
				ppc_manual: advisorObj.ppc_manual,
				seo: advisorObj.seo,
				seo_manual: advisorObj.seo_manual,
				referral: advisorObj.referral,
				total: advisorObj.total,
				domestic: advisorObj.domestic,
				international: advisorObj.international,
				hot: advisorObj.hot,
				warm: advisorObj.warm,
				cold: advisorObj.cold,
				valid: advisorObj.valid,
				invalid: advisorObj.invalid,
				close: advisorObj.close,
				ip: advisorObj.ip,
				op: advisorObj.op,
				ip_percentage: advisorObj.ip_percentage,
				op_percentage: advisorObj.op_percentage,
				patients_arrived: advisorObj.patients_arrived,
				video_calls_done: advisorObj.video_calls_done,
				estimated_revenue: advisorObj.estimated_revenue,
				actual_revenue: advisorObj.actual_revenue,
			})
			advisorObj.ppc_url_breakdown.forEach((ppcObj) => {
				advisorCSVDataArr.push({
					sales_emp_id: advisorObj.sales_emp_id,
					sales_emp_name: advisorObj.sales_emp_name,
					url: ppcObj.url,
					ppc: ppcObj.ppc,
					ppc_manual: ppcObj.ppc_manual,
					seo: '0',
					seo_manual: '0',
					referral: '0',
					total: ppcObj.total,
					domestic: ppcObj.domestic,
					international: ppcObj.international,
					hot: ppcObj.hot,
					warm: ppcObj.warm,
					cold: ppcObj.cold,
					valid: ppcObj.valid,
					invalid: ppcObj.invalid,
					close: ppcObj.close,
					ip: ppcObj.ip,
					op: ppcObj.op,
					ip_percentage: ppcObj.ip_percentage,
					op_percentage: ppcObj.op_percentage,
					patients_arrived: ppcObj.patients_arrived,
					video_calls_done: ppcObj.video_calls_done,
					estimated_revenue: ppcObj.estimated_revenue,
					actual_revenue: ppcObj.actual_revenue,
				})
			})
		})
		const fileTitle = `advisorData`
		exportCSVFile(headers, advisorCSVDataArr, fileTitle)
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
			<Box sx={{ mb: 6 }}>
				<Box display="flex" justifyContent="space-between">
					<Typography variant="h5" sx={{ mb: 2, color: '#505050', fontWeight: 550 }}>
						Advisor Data
					</Typography>
					{userId !== 82 && (
						<Tooltip arrow title="Export as CSV" onClick={handleDownloadAsCSV}>
							<IconButton color="success" size="large">
								<DownloadIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
				<TableContainer sx={{ overflow: 'auto', height: '80vh' }}>
					<Table
						sx={{
							[`& .${tableCellClasses.root}`]: {
								textAlign: 'center',
								border: '1px solid lightgray',
								maxWidth: '200px',
								wordWrap: 'break-word',
							},
							borderCollapse: 'unset',
						}}>
						<TableHead
							sx={{
								[`& .${tableCellClasses.root}`]: {
									fontWeight: '510',
								},
							}}>
							<TableRow
								sx={{
									[`& .${tableCellClasses.root}`]: {
										position: 'sticky',
										top: 0,
										backgroundColor: 'white',
									},
								}}>
								<TableCell
									rowSpan={2}
									sx={{
										minWidth: '200px',
										left: -1,
										zIndex: 2,
									}}>
									Advisor
								</TableCell>
								<TableCell colSpan={6}>Lead Count</TableCell>
								<TableCell colSpan={2}>Lead Origin</TableCell>
								<TableCell colSpan={3}>Lead Tier</TableCell>
								<TableCell colSpan={3}>Validity</TableCell>
								<TableCell colSpan={4}>Treatment Types</TableCell>
								<TableCell rowSpan={2}>Arrived</TableCell>
								<TableCell rowSpan={2}>Video Calls</TableCell>
								<TableCell colSpan={2}>Revenue (₹)</TableCell>
							</TableRow>
							<TableRow
								sx={{
									[`& .${tableCellClasses.root}`]: {
										lineHeight: 1,
										position: 'sticky',
										top: 57,
										backgroundColor: 'white',
									},
								}}>
								{/* Lead Count */}
								<TableCell size="small">PPC</TableCell>
								<TableCell size="small">PPC Manual</TableCell>
								<TableCell size="small">SEO</TableCell>
								<TableCell size="small">SEO Manual</TableCell>
								<TableCell size="small">Referral</TableCell>
								<TableCell size="small">Total</TableCell>
								{/* Lead Origin */}
								<TableCell size="small">Domestic</TableCell>
								<TableCell size="small">International</TableCell>
								{/* Lead Tier */}
								<TableCell sx={{ color: tierChipColor('Hot') }} size="small">
									Hot
								</TableCell>
								<TableCell sx={{ color: tierChipColor('Warm') }} size="small">
									Warm
								</TableCell>
								<TableCell sx={{ color: tierChipColor('Cold') }} size="small">
									Cold
								</TableCell>
								{/* Validity */}
								<TableCell sx={{ color: 'green' }} size="small">
									Valid
								</TableCell>
								<TableCell sx={{ color: 'red' }} size="small">
									Invalid
								</TableCell>
								<TableCell size="small">Close</TableCell>
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
							{advisorData.map((advisor) => {
								return (
									<>
										<TableRow
											key={advisor.sales_emp_id}
											sx={{ cursor: 'pointer' }}
											onClick={() => focusAdvisor(advisor.sales_emp_id)}>
											{/* Advisor Name */}
											<TableCell
												sx={{
													position: 'sticky',
													left: -1,
													backgroundColor: 'white',
												}}>
												<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
													<span style={{ mr: 2 }}>{advisor.sales_emp_name}</span>
													{advisor.ppc_url_breakdown.length ? (
														advisor.sales_emp_id === focusedAdvisor ? (
															<KeyboardArrowUpIcon fontSize="small" />
														) : (
															<KeyboardArrowDownIcon fontSize="small" />
														)
													) : (
														''
													)}
												</Box>
											</TableCell>
											{/* Lead Count */}
											<TableCell>{advisor.ppc}</TableCell>
											<TableCell>{advisor.ppc_manual}</TableCell>
											<TableCell>{advisor.seo}</TableCell>
											<TableCell>{advisor.seo_manual}</TableCell>
											<TableCell>{advisor.referral}</TableCell>
											<TableCell>{advisor.total}</TableCell>
											{/* Lead Origin */}
											<TableCell>{advisor.domestic}</TableCell>
											<TableCell>{advisor.international}</TableCell>
											{/* Lead Tier */}
											<TableCell>{advisor.hot}</TableCell>
											<TableCell>{advisor.warm}</TableCell>
											<TableCell>{advisor.cold}</TableCell>
											{/* Validity */}
											<TableCell>{advisor.valid}</TableCell>
											<TableCell>{advisor.invalid}</TableCell>
											<TableCell>{advisor.close}</TableCell>
											{/* Treatement Types */}
											<TableCell>{advisor.ip}</TableCell>
											<TableCell>{advisor.op}</TableCell>
											<TableCell>{advisor.ip_percentage}</TableCell>
											<TableCell>{advisor.op_percentage}</TableCell>
											{/* Total Arrival */}
											<TableCell>{advisor.patients_arrived}</TableCell>
											{/* Video Calls */}
											<TableCell>{advisor.video_calls_done}</TableCell>
											{/* Revenue */}
											<TableCell>{advisor.estimated_revenue}</TableCell>
											<TableCell>{advisor.actual_revenue}</TableCell>
										</TableRow>
										{advisor.ppc_url_breakdown.map((ppc, index) => {
											return (
												<TableRow
													key={`${advisor.sales_emp_name}-ppc-${index}`}
													sx={{
														backgroundColor: '#fdf5c9',
														display: advisor.sales_emp_id === focusedAdvisor ? '' : 'none',
													}}>
													{/* Advisor Name */}
													<TableCell
														sx={{
															position: 'sticky',
															left: -1,
															backgroundColor: '#fdf5c9',
															boxShadow: '0px 0px 3px lightgray',
															zIndex: 1,
														}}>
														{ppc.url}
													</TableCell>
													{/* Lead Count */}
													<TableCell>{ppc.ppc}</TableCell>
													<TableCell>{ppc.ppc_manual}</TableCell>
													<TableCell>---</TableCell>
													<TableCell>---</TableCell>
													<TableCell>---</TableCell>
													<TableCell>{ppc.total}</TableCell>
													{/* Lead Origin */}
													<TableCell>{ppc.domestic}</TableCell>
													<TableCell>{ppc.international}</TableCell>
													{/* Lead Tier */}
													<TableCell>{ppc.hot}</TableCell>
													<TableCell>{ppc.warm}</TableCell>
													<TableCell>{ppc.cold}</TableCell>
													{/* Validity */}
													<TableCell>{ppc.valid}</TableCell>
													<TableCell>{ppc.invalid}</TableCell>
													<TableCell>{ppc.close}</TableCell>
													{/* Treatement Types */}
													<TableCell>{ppc.ip}</TableCell>
													<TableCell>{ppc.op}</TableCell>
													<TableCell>{ppc.ip_percentage}%</TableCell>
													<TableCell>{ppc.op_percentage}%</TableCell>
													{/*  Arrival */}
													<TableCell>{ppc.patients_arrived}</TableCell>
													{/* Video Calls */}
													<TableCell>{ppc.video_calls_done}</TableCell>
													{/* Revenue */}
													<TableCell>{ppc.estimated_revenue}</TableCell>
													<TableCell>{ppc.actual_revenue}</TableCell>
												</TableRow>
											)
										})}
									</>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</>
	)
}

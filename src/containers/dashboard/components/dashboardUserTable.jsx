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
export default function DashboardUserTable(props) {
	const advisorData = props.advisorData
	const dashboardFilter = props.dashboardFilter

	return (
		<>
			<Box sx={{ mb: 6 }}>
				<Typography variant="h5" sx={{ mb: 2, color: '#505050', fontWeight: 550 }}>
					Advisor Data
				</Typography>
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
								[`& .${tableCellClasses.root}`]: {
									fontWeight: '510',
								},
							}}>
							<TableRow>
								<TableCell
									rowSpan={2}
									sx={{
										minWidth: '200px',
										position: 'sticky',
										left: -1,
										background: 'white',
										boxShadow: '0px 0px 3px lightgray',
										zIndex: 1,
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
										<TableRow key={advisor.sales_emp_id} sx={{ cursor: 'pointer' }}>
											{/* Advisor Name */}
											<TableCell
												sx={{
													position: 'sticky',
													left: -1,
													background: 'white',
													boxShadow: '0px 0px 3px lightgray',
													zIndex: 1,
												}}>
												{advisor.sales_emp_name}
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
														backgroundColor: '#d1e4f6',
													}}>
													{/* Advisor Name */}
													<TableCell
														sx={{
															position: 'sticky',
															left: -1,
															backgroundColor: '#d1e4f6',
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
													{/* Total Arrival */}
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

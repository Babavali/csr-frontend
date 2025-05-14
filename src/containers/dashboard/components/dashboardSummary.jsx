/*eslint-disable no-unused-vars*/
// Packages
import axios from '../../../shared/axios'
// MUI Components
import { Box, Grid, Typography } from '@mui/material'

// Images
import totalLeadsImage from '../../../assets/Dashboard/totalLeads.png'
import ppcSeoImage from '../../../assets/Dashboard/ppc-seo.png'
import ppcLeadsImage from '../../../assets/Dashboard/ppcLeads.png'
import seoLeadsImage from '../../../assets/Dashboard/seoLeads.png'
import assignedImage from '../../../assets/Dashboard/assigned.png'
import updatedImage from '../../../assets/Dashboard/updated.png'
import hotLeadsImage from '../../../assets/Dashboard/hotLeads.png'
import coldLeadsImage from '../../../assets/Dashboard/coldLeads.png'
import warmLeadsImage from '../../../assets/Dashboard/warmLeads.png'
import invalidLeadsImage from '../../../assets/Dashboard/invalidLeads.png'
import closedLeadsImage from '../../../assets/Dashboard/closedLeads.png'
import lostLeadsImage from '../../../assets/Dashboard/lostLeads.png'
import ipLeadsImage from '../../../assets/Dashboard/ipLeads.png'
import opLeadsImage from '../../../assets/Dashboard/opLeads.png'
import { useEffect } from 'react'
import { useState } from 'react'

export default function DashboardSummary(props) {
	const matches = props.matches
	const user = props.user
	const dashboardSummaryData = props.dashboardSummaryData
	// TODO: In normal user dashboard the PPC/SEO Leads must be put in seperate boxes and the Assigned Box must be removed
	return (
		<Box mb={4}>
			<Grid container spacing={matches ? 4 : 1} sx={{ mb: 1 }}>
				{/* 1st Row */}
				{/* Total Leads */}
				<Grid item md={3} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #FFAB00', paddingX: 2, paddingY: 2, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body1" whiteSpace="nowrap">
								Total Leads
							</Typography>
							<Typography variant="h4">{dashboardSummaryData.total != null ? dashboardSummaryData.total : '---'}</Typography>
						</Box>
						<img src={totalLeadsImage} alt="Total Leads" height={matches ? '60px' : '50px'} width={matches ? '60px' : '50px'} />
					</Box>
				</Grid>

				{/* PPC/SEO - Admin */}
				{/* PPC - Non Admin */}
				<Grid item md={3} xs={6}>
					{(user.isAdmin || user.isAuditor) && (
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							sx={{ border: '1px solid #FFAB00', paddingX: 2, paddingY: 2, borderRadius: '5px' }}>
							<Box>
								<Typography variant="body1" whiteSpace="nowrap">
									PPC/SEO
								</Typography>
								<Typography variant="h4">
									{dashboardSummaryData?.ppc != null ? dashboardSummaryData?.ppc : '--- '}/
									{dashboardSummaryData?.seo != null ? dashboardSummaryData?.seo : ' ---'}
								</Typography>
							</Box>
							<img
								src={ppcSeoImage}
								alt="PPC and SEO Leads"
								height={matches ? '60px' : '50px'}
								width={matches ? '60px' : '50px'}
							/>
						</Box>
					)}

					{(!user.isAdmin || !user.isAuditor) && (
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							sx={{ border: '1px solid #FFAB00', paddingX: 2, paddingY: 2, borderRadius: '5px' }}>
							<Box>
								<Typography variant="body1" whiteSpace="nowrap">
									PPC
								</Typography>
								<Typography variant="h4">
									{dashboardSummaryData?.ppc != null ? dashboardSummaryData?.ppc : '--- '}
								</Typography>
							</Box>
							<img src={ppcLeadsImage} alt="PPC Leads" height={matches ? '60px' : '50px'} width={matches ? '60px' : '50px'} />
						</Box>
					)}
				</Grid>

				{/* Assigned - Admin */}
				{/* SEO - Non Admin */}
				<Grid item md={3} xs={6}>
					{(user.isAdmin || user.isAuditor) && (
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							sx={{ border: '1px solid #FFAB00', paddingX: 2, paddingY: 2, borderRadius: '5px' }}>
							<Box>
								<Typography variant="body1" whiteSpace="nowrap">
									Assigned
								</Typography>
								<Typography variant="h4">
									{dashboardSummaryData?.assigned != null ? dashboardSummaryData?.assigned : '---'}
								</Typography>
							</Box>
							<img
								src={assignedImage}
								alt="Assigned Leads"
								height={matches ? '60px' : '50px'}
								width={matches ? '60px' : '50px'}
							/>
						</Box>
					)}

					{(!user.isAdmin || !user.isAuditor) && (
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							sx={{ border: '1px solid #FFAB00', paddingX: 2, paddingY: 2, borderRadius: '5px' }}>
							<Box>
								<Typography variant="body1" whiteSpace="nowrap">
									SEO
								</Typography>
								<Typography variant="h4">
									{dashboardSummaryData?.seo != null ? dashboardSummaryData?.seo : '---'}
								</Typography>
							</Box>
							<img src={seoLeadsImage} alt="SEO Leads" height={matches ? '60px' : '50px'} width={matches ? '60px' : '50px'} />
						</Box>
					)}
				</Grid>

				{/* Updated */}
				<Grid item md={3} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #FFAB00', paddingX: 2, paddingY: 2, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body1" whiteSpace="nowrap">
								Updated
							</Typography>
							<Typography variant="h4">
								{dashboardSummaryData?.updated != null ? dashboardSummaryData?.updated : '---'}
							</Typography>
						</Box>
						<img src={updatedImage} alt="Updated Leads" height={matches ? '60px' : '50px'} width={matches ? '60px' : '50px'} />
					</Box>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				{/* Hot Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								Hot
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.hot != null ? dashboardSummaryData.hot : '---'}</Typography>
						</Box>
						<img src={hotLeadsImage} height="35px" width="35px" alt="Hot" />
					</Box>
				</Grid>

				{/* Cold Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								Cold
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.cold != null ? dashboardSummaryData.cold : '---'}</Typography>
						</Box>
						<img src={coldLeadsImage} height="35px" width="35px" alt="Cold" />
					</Box>
				</Grid>

				{/* Warm Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								Warm
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.warm != null ? dashboardSummaryData.warm : '---'}</Typography>
						</Box>
						<img src={warmLeadsImage} height="40px" width="40px" alt="Warm" />
					</Box>
				</Grid>

				{/* Invalid Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								Invalid
							</Typography>
							<Typography variant="h5">
								{dashboardSummaryData?.invalid != null ? dashboardSummaryData.invalid : '---'}
							</Typography>
						</Box>
						<img src={invalidLeadsImage} height="35px" width="35px" alt="Invalid" />
					</Box>
				</Grid>

				{/* Closed Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								Closed
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.close != null ? dashboardSummaryData.close : '---'}</Typography>
						</Box>
						<img src={closedLeadsImage} height="35px" width="35px" alt="Closed" />
					</Box>
				</Grid>

				{/* Lost Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								Lost
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.lost != null ? dashboardSummaryData.lost : '---'}</Typography>
						</Box>
						<img src={lostLeadsImage} height="40px" width="40px" alt="Lost" />
					</Box>
				</Grid>

				{/* IP Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								IP
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.ip != null ? dashboardSummaryData.ip : '---'}</Typography>
						</Box>
						<img src={ipLeadsImage} height="40px" width="40px" alt="IP" />
					</Box>
				</Grid>

				{/* OP Leads */}
				<Grid item md={1.5} xs={6}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						sx={{ border: '1px solid #D2D2D2', paddingX: 1.5, paddingY: 1.5, borderRadius: '5px' }}>
						<Box>
							<Typography variant="body2" sx={{ marginBottom: -0.4 }}>
								OP
							</Typography>
							<Typography variant="h5">{dashboardSummaryData?.op != null ? dashboardSummaryData.op : '---'}</Typography>
						</Box>
						<img src={opLeadsImage} height="40px" width="40px" alt="OP" />
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}

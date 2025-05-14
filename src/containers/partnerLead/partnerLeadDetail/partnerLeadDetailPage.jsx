/* eslint-disable  no-unused-vars */
// React
import React, { useCallback, useEffect, useState } from 'react'
// Packages
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../../shared/axios'
import { Box, Divider, Grid, Stack, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import PartnerLeadSummary from './components/partnerLeadSummary'
import PartnerLeadDetailInformation from './components/partnerLeadDetailInformation'
import PartnerLeadDetailActivity from './components/partnerLeadDetailActivity'
import PartnerLeadDetailCallHistory from './components/partnerLeadDetailCallHistory'
import CircularLoader from '../../../components/common/loader/circularLoader'
import noData from '../../../assets/no-data.svg'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
function PreviewLeads() {
	const location = useLocation()
	const pathName = location.pathname
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	const { lead_id } = useParams()
	const [leadData, setLeadData] = useState()
	const navigate = useNavigate()
	const matches = useMediaQuery('(min-width: 600px)')
	const [isLoading, setIsLoading] = useState(true)
	const [activities, setActivities] = useState([])
	const [previewLeadTabIndex, setPreviewLeadTabIndex] = useState(0)
	const [isAuthorised, setIsAuthorised] = useState(false)
	const type = window.location.href.includes('doctor') ? 'doctor' : 'sales'
	const fetchPreviewData = useCallback(async () => {
		let url = ''
		if (window.location.href.includes('doctor')) {
			url = `/sales/leads/doctor-leads/${lead_id}`
		} else if (window.location.href.includes('sales')) {
			url = `/sales/leads/partner-leads/${lead_id}`
		}
		setIsLoading(true)
		await axios
			.get(url)
			.then((res) => {
				setLeadData(res.data.data)
				setIsAuthorised(true)
				setIsLoading(false)
			})
			.catch((err) => {
				setIsLoading(false)
			})
	}, [lead_id, setLeadData])
	// useEffects
	const fetchActivities = async () => {
		let url = ''
		if (window.location.href.includes('doctor')) {
			url = `/sales/leads/doctor-leads/${lead_id}/recent-activity`
		} else if (window.location.href.includes('sales')) {
			url = `/sales/leads/partner-leads/${lead_id}/recent-activity`
		}
		const response = await axios.get(url)
		setActivities(response.data?.data)
	}
	const handlePreviewLeadTabChange = (_event, newTabIndex) => {
		setPreviewLeadTabIndex(newTabIndex)
	}

	useEffect(() => {
		fetchActivities()
	}, [])

	useEffect(() => {
		fetchPreviewData()
	}, [fetchPreviewData])
	const showCallSection = () => {
		// * This is a temporary function, until the call button is displayed to everyone.
		return user.isAdmin || [90, 66, 91].includes(user.userId)
	}

	return (
		<>
			{/* Loading Screen */}
			{isLoading && (
				<Box width="100%">
					<CircularLoader />
				</Box>
			)}
			{/* Lead Details */}
			{!isLoading && isAuthorised && (
				<Box width="100%" display="flex" flexDirection="column" justifyContent="center" gap={2} py={2} px={matches ? 3 : 2}>
					<PartnerLeadSummary type={type} matches={matches} lead_id={lead_id} data={leadData} fetchActivities={fetchActivities} />
					{/* {leadData.additional_information.shared_with && (
						<Box
							p={1}
							sx={{
								backgroundColor: '#f9e9c2',
								border: '1px solid #f1a304',
								borderRadius: '4px',
								paddingX: matches ? 2 : 0.5,
							}}>
							<Typography color="#f1a304" sx={{ fontWeight: 510 }}>
								{leadData.additional_information.shared_with}
							</Typography>
						</Box>
					)} */}

					<Tabs value={previewLeadTabIndex} onChange={handlePreviewLeadTabChange} aria-label="View Lead Tabs">
						<Tab label="Details" />
						<Tab disabled={!isAllowed('get_doctor_recent_activity')} label="Activity" />
						{showCallSection() && <Tab label="Call Logs" />}
					</Tabs>

					{previewLeadTabIndex === 0 && (
						<PartnerLeadDetailInformation type={type} matches={matches} lead_id={lead_id} data={leadData} />
					)}
					{previewLeadTabIndex === 1 && (
						<PartnerLeadDetailActivity
							type={type}
							matches={matches}
							lead_id={lead_id}
							activities={activities}
							fetchActivities={fetchActivities}
						/>
					)}
					{previewLeadTabIndex === 2 && showCallSection() && (
						<PartnerLeadDetailCallHistory type={type} matches={matches} lead_id={lead_id} callLogs={leadData.call_logs} />
					)}
				</Box>
			)}
			{/* Not Authorised */}
			{!isLoading && !isAuthorised && (
				<Box width="100%" height="90vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
					<img src={noData} alt="no documents" height={100} width={100} />
					<Typography variant="h6" mt={4}>
						You are not authorised to see this data.
					</Typography>
				</Box>
			)}
		</>
	)
}

export default PreviewLeads

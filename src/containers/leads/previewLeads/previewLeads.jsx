/* eslint-disable  no-unused-vars */
// React
import React, { useCallback, useEffect, useState } from 'react'
// Packages
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../../shared/axios'
import { Box, Divider, Grid, Stack, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import PreviewLeadSummary from './components/previewLeadSummary'
import PreviewLeadDetails from './components/previewLeadDetails'
import PreviewLeadActivity from './components/previewLeadActivity'
import CircularLoader from '../../../components/common/loader/circularLoader'
import { toast } from 'react-toastify'
import noData from '../../../assets/no-data.svg'
import { useSelector } from 'react-redux'
function PreviewLeads() {
	const user = useSelector((state) => state.user)
	const isPartner = user.type.is_client || user.type.is_partner || user.type.is_mt
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

	const fetchPreviewData = useCallback(async () => {
		setIsLoading(true)
		await axios
			.get(`/sales/leads/${lead_id}/show`)
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
		const response = await axios.get(`/sales/leads/${lead_id}/recent-activity`)
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

	const isGetRecentActivity = () => {
		if (leadData.additional_information.lead_source === 'PARTNER') {
			return isAllowed('get_partner_recent_activity')
		} else if (isAllowed('get_lead_recent_activity')) {
			return true
		} else return false
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
					<PreviewLeadSummary matches={matches} lead_id={lead_id} data={leadData} fetchActivities={fetchActivities} />

					{leadData.additional_information.shared_with && (
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
					)}

					<Tabs value={previewLeadTabIndex} onChange={handlePreviewLeadTabChange} aria-label="View Lead Tabs">
						<Tab label="Details" />
						<Tab disabled={!isGetRecentActivity()} label="Activity" />
					</Tabs>

					{previewLeadTabIndex === 0 && (
						<PreviewLeadDetails matches={matches} lead_id={lead_id} data={leadData} userID={user.userId} />
					)}
					{previewLeadTabIndex === 1 && (
						<PreviewLeadActivity
							matches={matches}
							lead_id={lead_id}
							activities={activities}
							fetchActivities={fetchActivities}
							isPartner={isPartner}
						/>
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

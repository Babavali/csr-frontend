/* eslint-disable no-unused-vars*/
// React
import React, { useState } from 'react'
// Packages
import axios from '../../../../shared/axios'
// MUI Components
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material'
//
import PartnerLeadDetailActivityFollowUpCard from './partnerLeadDetailActivityFollowUpCard'
import PartnerLeadDetailActivityStatusCard from './partnerLeadDetailActivityStatusCard'
import PartnerLeadDetailActivityRemarkCard from './partnerLeadDetailActivityRemarkCard'
import PartnerLeadDetailActivityTierCard from './partnerLeadDetailActivityTierCard'
import PartnerLeadDetailActivityShareCard from './partnerLeadDetailActivityShareCard'
import PartnerLeadDetailActivityCallLogCard from './partnerLeadDetailActivityCallLogCard'
import PartnerLeadDetailActivityTransferCard from './partnerLeadDetailActivityTransferCard'

import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function PartnerLeadDetailActivity(props) {
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
	// Variables
	const leadId = props.lead_id
	const matches = props.matches
	// useStates
	const [currentRemark, setCurrentRemark] = useState('')

	// Event handlers
	function handleChangeCurrentRemark(event) {
		setCurrentRemark(event.target.value)
	}
	function handleSendCurrentRemark() {
		if (currentRemark.length > 0) {
			const payload = {
				remark: currentRemark,
			}
			let url = ''

			if (window.location.href.includes('doctor')) {
				url = `/sales/leads/doctor-leads/${leadId}/remark`
			} else if (window.location.href.includes('sales')) {
				url = `/sales/leads/partner-leads/${leadId}/remark`
			}
			axios
				.post(url, payload)
				.then(() => {
					setCurrentRemark('')
				})
				.catch((err) => {
					console.log(err)
				})
		}
		props.fetchActivities()
	}
	const showCallSection = () => {
		// * This is a temporary function, until the call button is displayed to everyone.
		return user.isAdmin || [90, 66, 91].includes(user.userId)
	}
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingX: matches ? 5 : 0 }}>
			<Box>
				{/* Remark Box */}
				<TextField
					disabled={!isAllowed('add_doctor_remark')}
					id="outlined-basic"
					placeholder="Write a Remark"
					size="small"
					variant="outlined"
					onChange={handleChangeCurrentRemark}
					value={currentRemark}
					multiline
					rows="7"
					fullWidth
					sx={{ backgroundColor: '#FFF6D6', mb: 2 }}
					InputProps={{
						endAdornment: (
							<InputAdornment
								position="end"
								sx={{
									alignItems: 'flex-start',
								}}>
								<Button
									aria-label="Send"
									color="primary"
									disabled={currentRemark.length === 0}
									onClick={handleSendCurrentRemark}
									size="small"
									variant="contained"
									sx={{ position: 'absolute', bottom: 15, right: 15, paddingX: 4, fontWeight: 520 }}>
									Save
								</Button>
							</InputAdornment>
						),
					}}
				/>
				{/* Activities */}
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2}>
					{props.activities.map((activity, index) => {
						if (activity.activity_type === 'FOLLOWUP') {
							return (
								<PartnerLeadDetailActivityFollowUpCard
									key={`ActivityCard-${index}`}
									activity={activity}
									matches={matches}
								/>
							)
						} else if (activity.activity_type === 'STATUS') {
							return (
								<PartnerLeadDetailActivityStatusCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
							)
						} else if (activity.activity_type == 'REMARK') {
							return (
								<PartnerLeadDetailActivityRemarkCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
							)
						} else if (activity.activity_type == 'LEAD_TIER') {
							return <PartnerLeadDetailActivityTierCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
						} else if (activity.activity_type == 'SHARE') {
							return (
								<PartnerLeadDetailActivityShareCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
							)
						} else if (activity.activity_type == 'CALL' && showCallSection()) {
							return (
								<PartnerLeadDetailActivityCallLogCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
							)
						} else if (activity.activity_type == 'TRANSFER') {
							return (
								<PartnerLeadDetailActivityTransferCard
									key={`ActivityCard-${index}`}
									activity={activity}
									matches={matches}
								/>
							)
						}
					})}
				</Box>
			</Box>
		</Box>
	)
}

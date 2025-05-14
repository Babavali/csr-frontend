/* eslint-disable no-unused-vars*/
// React
import React, { useState } from 'react'
// Packages
import axios from '../../../../shared/axios'
// MUI Components
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material'
//
import PreviewLeadActivityFollowUpCard from './previewLeadActivityFollowUpCard'
import PreviewLeadActivityStatusCard from './previewLeadActivityStatusCard'
import PreviewLeadActivityRemarkCard from './previewLeadActivityRemarkCard'
import PreviewLeadActivityTransferCard from './previewLeadActivityTransferCard'
import PreviewLeadActivityShareCard from './previewLeadActivityShareCard'
import { useSelector } from 'react-redux'

export default function PreviewLeadActivity(props) {
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
			axios
				.post(`/sales/leads/${leadId}/remark`, payload)
				.then(() => {
					setCurrentRemark('')
				})
				.catch((err) => {
					console.log(err)
				})
		}
		props.fetchActivities()
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingX: matches ? 5 : 0 }}>
			<Box>
				{/* Remark Box */}
				<TextField
					disabled={(props.isPartner && !isAllowed('add_partner_remark')) || (!props.isPartner && !isAllowed('add_lead_remark'))}
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
							return <PreviewLeadActivityFollowUpCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
						} else if (activity.activity_type === 'STATUS') {
							return <PreviewLeadActivityStatusCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
						} else if (activity.activity_type == 'REMARK') {
							return <PreviewLeadActivityRemarkCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
						} else if (activity.activity_type == 'TRANSFER') {
							return <PreviewLeadActivityTransferCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
						} else if (activity.activity_type == 'SHARE') {
							return <PreviewLeadActivityShareCard key={`ActivityCard-${index}`} activity={activity} matches={matches} />
						}
					})}
				</Box>
			</Box>
		</Box>
	)
}

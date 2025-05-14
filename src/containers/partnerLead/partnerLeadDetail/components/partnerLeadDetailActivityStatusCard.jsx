/* eslint-disable no-unused-vars*/
import { Box, Typography } from '@mui/material'
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
export default function PartnerLeadDetailActivityStatusCard(props) {
	const activity = props.activity
	const matches = props.matches
	const getStatusColor = (status) => {
		let statusColor = '#fff'
		/*
			OPEN,
			WORKING ,
			QUALIFIED ,
			CONVERTED ,
			UNQUALIFIED,
			NURTURE
		*/
		if (status === 'ADDED' || status === 'OPEN') {
			statusColor = '#FAC663'
		} else if (status === 'WORKING') {
			statusColor = '#6EC0B8'
		} else if (status === 'QUALIFIED') {
			statusColor = '#A3BDFF'
		} else if (status === 'CONVERTED') {
			statusColor = '#CE83B9'
		} else if (status === 'UNQUALIFIED') {
			statusColor = '#BB8160'
		} else if (status === 'NURTURE') {
			statusColor = '#FD4646'
		}
		return statusColor
	}

	return (
		<Box
			width="100%"
			display="flex"
			flexDirection={matches ? 'row' : 'column'}
			justifyContent="space-between"
			alignItems={'start'}
			px={3}
			py={2}
			mb={2}
			sx={{ border: '1px solid #c1c1c1', borderRadius: 2 }}>
			{/*  */}
			<Box>
				{activity.status.old_status && (
					<Box display="flex" alignItems="center" justifyContent="center" mb={1} style={{ '-webkit-justify-content': 'start' }}>
						{/* Icon */}
						<HistoryToggleOffOutlinedIcon sx={{ mr: 1, color: '#393434' }} />
						{/* Status */}
						<Box display="flex" alignItems="center" justifyContent="space-between">
							<Typography fontSize={matches ? 18 : 14} fontWeight="bold" color={getStatusColor(activity.status.old_status)}>
								{activity.status.old_status}
								{activity.status.old_sub_status && `, ${activity.status.old_sub_status}`}
							</Typography>
							{activity.status.new_status && <ChevronRightOutlinedIcon />}
							<Typography fontSize={matches ? 18 : 14} fontWeight="bold" color={getStatusColor(activity.status.new_status)}>
								{activity.status.new_status}
								{activity.status.new_sub_status && `, ${activity.status.new_sub_status}`}
							</Typography>
						</Box>
					</Box>
				)}
				{activity?.followup?.at_timestamp && (
					<Box>
						{/* Follow Up Timestamp */}
						<Typography fontSize={matches ? 16 : 14} mb={1}>
							@{activity.followup.at_timestamp}
						</Typography>
						{/* Follow Up Note */}
						<Typography fontSize={matches ? 16 : 14} sx={{ color: '#414141' }}>
							{activity.followup.note}
						</Typography>
					</Box>
				)}
			</Box>

			{/* Name and Type */}
			<Box
				display="flex"
				flexDirection={matches ? 'column' : 'row'}
				gap={matches ? 0 : 1}
				mt={matches ? 0 : 2}
				ml={matches ? 1 : 0}
				alignItems={matches ? 'end' : 'start'}
				minWidth="fit-content">
				<Typography variant="body2" color="#747474">
					{activity.created_at}
				</Typography>
				<Typography variant="body2" color="#747474">
					by {activity.created_by}
				</Typography>
			</Box>
		</Box>
	)
}

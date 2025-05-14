/* eslint-disable no-unused-vars*/
import { Box, Typography } from '@mui/material'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import CallOutlinedIcon from '@mui/icons-material/CallOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
export default function PreviewLeadActivityStatusCard(props) {
	const activity = props.activity
	const matches = props.matches
	const getStatusColor = (status) => {
		let statusColor = '#fff'

		if (status === 'ADDED' || status === 'OPEN') {
			statusColor = '#FAC663'
		} else if (status === 'WORKING') {
			statusColor = '#6EC0B8'
		} else if (
			status === 'REPORTS AWAITED FROM PATIENT' ||
			status === 'REPORTS SENT TO HOSPITAL' ||
			status === 'OPINION SENT TO PATIENT' ||
			status === 'VIDEO CALL DONE'
		) {
			statusColor = '#A3BDFF'
		} else if (
			status === 'PASSPORT AWAITED FROM PATIENT' ||
			status === 'VIL AWAITED FROM HOSPITAL' ||
			status === 'VIL SENT TO PATIENT' ||
			status === 'VISA RECEIVED' ||
			status === 'TICKET RECEIVED FROM PATIENT' ||
			status === 'ARRIVAL NOTIFICATION SENT TO HOSPITAL' ||
			status === 'FIELD STAFF ASSIGNED' ||
			status === 'PATIENT ARRIVED' ||
			status === 'CONNECTED WITH PATIENT'
		) {
			statusColor = '#CE83B9'
		} else if (status === 'PATIENT DEMAND CHANGES' || status === 'IP' || status === 'OP') {
			statusColor = '#BB8160'
		} else if (status === 'CLOSE' || status === 'INVALID' || status === 'LOST' || status === 'NURTURE') {
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
			{activity?.followup?.at_timestamp && (
				<Box display="flex" alignItems="start" justifyContent="center" mb={1} style={{ '-webkit-justify-content': 'start' }}>
					{!activity?.followup?.type && <AccessAlarmIcon sx={{ mr: 1, color: '#393434' }} />}
					{activity?.followup?.type == 'VIDEO_CALL' && <VideocamOutlinedIcon sx={{ mr: 1, color: '#393434' }} />}
					{activity?.followup?.type == 'CALL' && <CallOutlinedIcon sx={{ mr: 1, color: '#393434' }} />}
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
				</Box>
			)}

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

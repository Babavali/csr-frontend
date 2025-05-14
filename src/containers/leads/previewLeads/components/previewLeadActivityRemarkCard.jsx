/*eslint-disable no-unused-vars */
import { Box, Typography } from '@mui/material'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
export default function PreviewLeadActivityRemarkCard(props) {
	const activity = props.activity
	const matches = props.matches
	return (
		<Box
			width="100%"
			display="flex"
			flexDirection={matches ? 'row' : 'column'}
			justifyContent="space-between"
			alignItems="start"
			px={3}
			py={2}
			mb={2}
			sx={{ border: '1px solid #c1c1c1', borderRadius: 2, backgroundColor: '#FFF6D6' }}>
			<Box display="flex" mr={1}>
				<MessageOutlinedIcon sx={{ mr: 2, mt: 0.2, color: '#393434' }} />
				<Typography fontWeight="bold" sx={{ color: '#393434' }}>
					{activity.remark}
				</Typography>
			</Box>
			{/* Name and Time */}
			<Box
				display="flex"
				flexDirection={matches ? 'column' : 'row'}
				gap={matches ? 0 : 1}
				mt={matches ? 0 : 2}
				ml={matches ? 1 : 0}
				alignItems={matches ? 'end' : 'start'}
				minWidth="fit-content">
				<Typography variant="body2" sx={{ color: '#747474' }}>
					{activity.created_at}
				</Typography>
				<Typography variant="body2" sx={{ color: '#747474' }}>
					by {activity.created_by}
				</Typography>
			</Box>
		</Box>
	)
}

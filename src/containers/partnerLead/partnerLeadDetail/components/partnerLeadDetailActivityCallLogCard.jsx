import { Box, Typography, Chip } from '@mui/material'
import CallMadeIcon from '@mui/icons-material/CallMade'
import CallReceivedIcon from '@mui/icons-material/CallReceived'

export default function partnerDetailAcivityCallLog(props) {
	const callDetails = props.activity.call_details
	const getDate = (inputDate) => {
		// Create a new Date object from the input string
		const date = new Date(inputDate)
		// Define an array of month names
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		]
		// Extract the day, month, and year from the Date object
		const day = date.getDate()
		const month = monthNames[date.getMonth()]
		const year = date.getFullYear()
		// Combine them into the desired format
		const outputDate = `${day} ${month} ${year}`
		return outputDate
	}
	const getTime = (inputTime) => {
		// Split the input time into hours, minutes, and seconds
		const [hours, minutes] = inputTime.split(':').map(Number)
		// Determine if it's AM or PM
		const period = hours >= 12 ? 'PM' : 'AM'
		// Convert hours to 12-hour format
		const hours12 = hours % 12 || 12 // '0' hours should be treated as '12'
		// Combine them into the desired format
		const outputTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
		// Output the result
		return outputTime
	}
	const getIconColor = (status) => {
		if (status === 'Connected') {
			return 'green'
		}
		return 'red'
	}
	return (
		<Box sx={{ padding: 2, margin: 2, borderRadius: 2, border: '1px black dashed', width: '100%' }}>
			<Box sx={{ marginLeft: 1, marginBottom: 1 }}>
				<Box sx={{ display: 'flex' }}>
					<Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
						{props.activity.call_details.call_direction === 'Outgoing' ? (
							<CallMadeIcon
								sx={{ color: getIconColor(props.activity.call_details.call_status), marginRight: 0.5, width: '25px' }}
							/>
						) : (
							<CallReceivedIcon
								sx={{ color: getIconColor(props.activity.call_details.call_status), marginRight: 0.5, width: '25px' }}
							/>
						)}
						<Typography sx={{ textTransform: 'capitalize' }}>
							{props.activity.call_details.call_direction} - {callDetails.call_duration}
						</Typography>
					</Box>
					<Typography>
						<Chip
							label={`${callDetails.call_status}`}
							sx={{
								color: 'white',
								backgroundColor:
									callDetails.call_status === 'Connected'
										? 'green'
										: callDetails.call_status === 'Not Connected'
										? 'orange'
										: 'red',
							}}
						/>
					</Typography>
				</Box>
				<Typography>
					{getDate(callDetails.call_date)} @ {getTime(callDetails.call_time)}
				</Typography>
			</Box>
		</Box>
	)
}

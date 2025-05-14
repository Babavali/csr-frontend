/* eslint-disable no-unused-vars */
import { Box, Typography, Chip } from '@mui/material'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import CallMadeIcon from '@mui/icons-material/CallMade'

export default function partnerLeadDetailCallHistory(props) {
	function timeToMinutes(time) {
		let parts = time.split(':')
		let hours = parseInt(parts[0], 10)
		let minutes = parseInt(parts[1], 10)
		let seconds = parseInt(parts[2], 10)
		function truncateToTwoDecimals(number) {
			return Math.trunc(number * 100) / 100
		}

		// Convert hours and seconds to minutes
		return `${truncateToTwoDecimals(hours * 60 + minutes + seconds / 60)}`
	}
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
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				paddingX: 10,
			}}>
			{/* Call History Card */}
			{props.callLogs.meta_data?.data ? (
				props.callLogs.meta_data.data.map((log, index) => (
					<>
						<Box
							sx={{ padding: 2, margin: 2, borderRadius: 2, border: '1px solid #c1c1c1' }}
							key={`${index}-${log.customer_number}`}>
							<Box sx={{ marginLeft: 1, marginBottom: 2 }}>
								<Box sx={{ display: 'flex' }}>
									<Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', marginBottom: 2 }}>
										{log.call_direction === 'incoming' ? (
											<CallReceivedIcon
												sx={{ color: getIconColor(log.call_status), marginRight: 0.5, width: '25px' }}
											/>
										) : (
											<CallMadeIcon sx={{ color: getIconColor(log.call_status), marginRight: 0.5, width: '25px' }} />
										)}
										<Typography sx={{ color: '#2196F3', textTransform: 'capitalize' }}>{log.call_direction}</Typography>
									</Box>
									<Typography>
										<Chip
											label={`${log.call_status}`}
											sx={{
												color: 'white',
												backgroundColor:
													log.call_status === 'Connected'
														? 'green'
														: log.call_status === 'Not Connected'
														? 'orange'
														: 'red',
											}}
										/>
									</Typography>
								</Box>
								<Typography>
									{getDate(log.call_date)} @ {getTime(log.call_time)} for {log.call_duration}
								</Typography>
							</Box>
							{log.call_status === 'Connected' && (
								<audio controls style={{ width: '100%' }}>
									<source src={`${log.recording_url || log.callrecordingurl}`} type="audio/ogg" />
									Your browser does not support the audio tag.
								</audio>
							)}
						</Box>
					</>
				))
			) : (
				<Typography variant="h6" align="center" marginTop={4}>
					No Logs Found
				</Typography>
			)}
		</Box>
	)
}

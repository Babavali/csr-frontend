/* eslint-disable no-unused-vars*/
import { Box, Typography } from '@mui/material'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import WaterIcon from '@mui/icons-material/Water'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { tierChipColor } from '../../../../mixins/chipColor'
export default function PartnerLeadDetailActivityTierCard(props) {
	const activity = props.activity
	const matches = props.matches
	const getBackgroundColor = (status) => {
		let tierCardColor = '#FFF'
		if (status === 'HOT') {
			tierCardColor = '#ffa8a8'
		} else if (status === 'WARM') {
			tierCardColor = '#fee3bd'
		} else if (status === 'COLD') {
			tierCardColor = '#b7e2f5'
		}
		return tierCardColor
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
			sx={{
				border: `1px solid ${tierChipColor(activity?.new_tier)}`,
				borderRadius: 2,
				backgroundColor: getBackgroundColor(activity?.new_tier),
			}}>
			<Box display="flex" alignItems="center" justifyContent="center" mb={1} style={{ '-webkit-justify-content': 'start' }}>
				{activity?.new_tier == 'Hot' && <LocalFireDepartmentIcon fontSize="large" sx={{ mr: 5, color: tierChipColor('HOT') }} />}
				{activity?.new_tier == 'Cold' && <AcUnitIcon fontSize="large" sx={{ mr: 5, color: tierChipColor('COLD') }} />}
				{activity?.new_tier == 'Warm' && <WaterIcon fontSize="large" sx={{ mr: 5, color: tierChipColor('WARM') }} />}
				<Box display="flex" alignItems="center">
					{/* Old Tier */}
					<Typography fontSize={matches ? 16 : 14}>{activity.old_tier}</Typography>
					<ArrowForwardIcon sx={{ mx: 2 }} />
					{/* New Tier */}
					<Typography fontSize={matches ? 16 : 14}>{activity.new_tier}</Typography>
				</Box>
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
				<Typography variant="body2">{activity.created_at}</Typography>
				<Typography variant="body2">by {activity.created_by}</Typography>
			</Box>
		</Box>
	)
}

/* eslint-disable no-unused-vars */
import axios from '../../shared/axios'
import { useEffect, useState } from 'react'
import {
	Box,
	Divider,
	MenuItem,
	Typography,
	Select,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	InputLabel,
	FormControl,
} from '@mui/material'
import SalesEmpComponent from '../leads/myLeads/components/salesEmpComponent'
export default function DoctorActivityPage() {
	const [doctorActivityData, setDoctorActivityData] = useState([])
	const [advisorID, setAdvisorID] = useState(null)
	const [month, setMonth] = useState(null)
	const getDoctorActivityData = () => {
		axios
			.get('sales/employee/doctor-activity', {
				params: { emp_id: advisorID, start_date: month },
			})
			.then((res) => {
				setDoctorActivityData(res.data.data)
			})
	}
	useEffect(() => {
		if (advisorID) {
			getDoctorActivityData()
		}
	}, [advisorID, month])
	const selectAdvisor = (advisor_id) => {
		setAdvisorID(advisor_id)
	}
	const selectMonth = (month) => {
		const dateString = `2024-${month}-01`
		setMonth(dateString)
	}
	return (
		<Box width="100%" display="flex" flexDirection="column" justifyContent="center" gap={2} py={4} px={7}>
			<Typography variant="h5" color="#3F3F3F" sx={{ mr: 2 }}>
				Doctor Activity Dashboard
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Box display="flex" justifyItems="space-between" gap={10} marginBottom={4}>
				<Box width={'50%'}>
					<SalesEmpComponent handleSalesEmpChange={selectAdvisor} />
				</Box>
				<Box sx={{ flexGrow: 1 }}>
					<FormControl size="small" style={{ minWidth: '100%' }}>
						<InputLabel>Month</InputLabel>
						<Select
							fullWidth
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							label="Month"
							onChange={(event) => selectMonth(event.target.value)}>
							<MenuItem value={'01'}>January</MenuItem>
							<MenuItem value={'02'}>February</MenuItem>
							<MenuItem value={'03'}>March</MenuItem>
							<MenuItem value={'04'}>April</MenuItem>
							<MenuItem value={'05'}>May</MenuItem>
							<MenuItem value={'06'}>June</MenuItem>
							<MenuItem value={'07'}>July</MenuItem>
							<MenuItem value={'08'}>August</MenuItem>
							<MenuItem value={'09'}>September</MenuItem>
							<MenuItem value={'10'}>October</MenuItem>
							<MenuItem value={'11'}>November</MenuItem>
							<MenuItem value={'12'}>December</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Box>
			{advisorID && doctorActivityData.first_name ? (
				<Box>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="h5" color="#3F3F3F" sx={{ width: '50%' }}>
							{doctorActivityData.first_name} {doctorActivityData.last_name}
						</Typography>
						<Box display="flex" gap={4}>
							<Typography variant="h6" color="#3F3F3F">
								Reviews: <strong>{doctorActivityData.total_reviews}</strong>
							</Typography>
							<Typography variant="h6" color="#3F3F3F">
								Answers: <strong>{doctorActivityData.total_answers}</strong>
							</Typography>
						</Box>
					</Box>
					<Divider sx={{ mb: 2 }} />
					<TableContainer>
						<Table sx={{ tableLayout: 'fixed', border: '1px solid lightgray' }}>
							<TableHead sx={{ backgroundColor: '#0c4a6e', margin: 0 }}>
								<TableRow>
									<TableCell align="center" sx={{ color: 'white', fontWeight: 550, padding: '0.5rem' }}>
										Date
									</TableCell>
									<TableCell align="center" sx={{ color: 'white', fontWeight: 550, padding: '0.5rem' }}>
										Doctor
									</TableCell>
									<TableCell align="center" sx={{ color: 'white', fontWeight: 550, padding: '0.5rem' }}>
										Reviews
									</TableCell>
									<TableCell align="center" sx={{ color: 'white', fontWeight: 550, padding: '0.5rem' }}>
										Answers
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.entries(doctorActivityData.activity_breakdown).map(([date, data]) => (
									<>
										{data.map((doctor) => (
											<TableRow key={doctor}>
												<TableCell align="center">{date}</TableCell>
												<TableCell>
													Dr. {doctor.first_name} {doctor.middle_name} {doctor.last_name}
												</TableCell>
												<TableCell align="center">{doctor.review_count}</TableCell>
												<TableCell align="center">{doctor.answer_count}</TableCell>
											</TableRow>
										))}
									</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			) : (
				<Box display="flex" justifyContent="center" py={10}>
					<Typography variant="h5" color="#3F3F3F" align="center">
						Please select an Advisor
					</Typography>
				</Box>
			)}
		</Box>
	)
}

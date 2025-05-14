/* eslint-disable no-unused-vars */
import { Box, Button, Chip, Modal, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import ShareLeadSalesEmployeeSelect from './shareLeadSalesEmployeeSelect'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
import _ from 'lodash'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 680,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
}

export default function ShareLeadModal(props) {
	const open = props.open
	const onClose = props.onClose
	const leadId = props.leadId
	const fetchActivities = props.fetchActivities
	const [allSalesEmployees, setAllSalesEmployees] = useState([])
	const [selectedSalesEmployees, setSelectedSalesEmployees] = useState([])

	const fetchSalesEmployees = () => {
		axios.get(`sales/employee/sale-emp/search?name`).then((res) => {
			setAllSalesEmployees(res.data.data)
		})
	}
	useEffect(() => {
		fetchSalesEmployees()
	}, [])

	const getSalesEmployeeObj = (salesEmpId) => {
		return _.filter(allSalesEmployees, ['id', salesEmpId])[0]
	}
	const handleSalesEmpSelect = (id) => {
		const salesEmpObj = getSalesEmployeeObj(id)
		if (salesEmpObj && !selectedSalesEmployees.includes(salesEmpObj)) {
			const tempArr = [...selectedSalesEmployees, salesEmpObj]
			setSelectedSalesEmployees(tempArr)
		}
	}
	const handleDeleteSalesEmployee = (salesEmpId) => {
		const tempArr = selectedSalesEmployees.filter((employee) => employee.id !== salesEmpId)
		setSelectedSalesEmployees(tempArr)
	}

	const handleSubmitShareData = () => {
		let selectedSalesEmployeeIds = selectedSalesEmployees.map((salesEmp) => {
			if (salesEmp.id) {
				return salesEmp.id
			}
		})
		const payload = {
			lead_id: leadId,
			share_leads_to: selectedSalesEmployeeIds,
		}
		axios
			.post(`sales/leads/share`, payload)
			.then((res) => {
				toast.success('Shared Successfully', {
					position: 'bottom-left',
				})
				fetchActivities()
				onClose()
			})
			.catch((error) => {
				if (error?.response?.request?.status === 404) {
					toast.error('Page Not Found', {
						position: 'bottom-left',
					})
				} else {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				}
			})
	}

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style}>
				<Typography
					style={{
						fontSize: '20px',
						fontWeight: '500',
						display: 'flex',
						justifyContent: 'center',
						marginBottom: '20px',
					}}>
					Share Lead
				</Typography>
				<Box display="flex" justifyContent="center" mb={2}>
					<ShareLeadSalesEmployeeSelect handleSalesEmpChange={handleSalesEmpSelect} />
				</Box>
				{selectedSalesEmployees.map((employee) => {
					if (employee) {
						return (
							<Chip
								key={employee.id}
								label={employee.full_name}
								onDelete={() => {
									handleDeleteSalesEmployee(employee.id)
								}}
								sx={{ mr: 1, mb: 1 }}
							/>
						)
					}
				})}

				{/* Share Button */}
				<Box textAlign="center" mt={4}>
					<Button variant="contained" onClick={handleSubmitShareData}>
						Share
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}

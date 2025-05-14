import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import SalesEmpComponent from './salesEmpComponent'
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'

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

function TransferMultipleLeadModalPopup(props) {
	const open = props.open
	const onClose = props.onClose
	const transferMultipleLeadsArray = props.transferMultipleLeadsArray
	const [selectedSalesEmpId, setSelectedSalesEmpId] = useState()

	const handleSalesEmpChange = (id) => {
		setSelectedSalesEmpId(id)
	}

	const handleTransferLead = () => {
		axios
			.put(`sales/leads/transfer`, {
				lead_ids: transferMultipleLeadsArray,
				transfer_to_id: selectedSalesEmpId,
			})
			.then((res) => {
				if (res?.status === 201) {
					toast.success('Saved successfully', {
						position: 'bottom-left',
					})
					onClose()
					setTimeout(() => {
						window.location.reload()
					}, 2000)
				}
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
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
					Multiple Leads Transfer
				</Typography>
				<Box display="flex" justifyContent="center">
					<SalesEmpComponent handleSalesEmpChange={handleSalesEmpChange} />
				</Box>
				<Box textAlign="center" mt={4}>
					<Button variant="contained" onClick={handleTransferLead}>
						Transfer Leads
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}

TransferMultipleLeadModalPopup.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	transferMultipleLeadsArray: PropTypes.array,
}

TransferMultipleLeadModalPopup.defaultProps = {
	open: false,
	onClose: () => {},
}

export default TransferMultipleLeadModalPopup

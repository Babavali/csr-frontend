// React
import { useState } from 'react'
import axios from '../../../../shared/axios'
// MUI Components
import { Box, Modal, Typography, Select, MenuItem, Button } from '@mui/material'
// Packages
import { toast } from 'react-toastify'

export default function PartnerLeadListingTierModal(props) {
	const open = props.open
	const onClose = props.onClose
	const leadID = props.leadID
	const tabName = props.tabName
	const fetchData = props.fetchData
	const [tier, setTier] = useState(props.leadTier)
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '500px',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		p: 4,
	}
	const handleTierChange = (event) => {
		setTier(event.target.value)
	}
	const updateTier = () => {
		const payload = {
			lead_tier: tier,
		}
		const url = `/sales/leads/${tabName === 'doctor' ? 'doctor' : 'partner'}-leads/${leadID}`
		axios
			.put(url, payload)
			.then(() => {
				toast.success('Saved successfully', {
					position: 'bottom-left',
				})
				onClose()
				fetchData()
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, { position: 'bottom-left' })
			})
	}
	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style} display="flex" flexDirection="column" alignItems="center">
				<Typography variant="h6" mb={4}>
					Tier
				</Typography>

				<Select value={tier} onChange={(event) => handleTierChange(event)} sx={{ width: '100%', marginBottom: 5 }}>
					<MenuItem value="Cold">Cold</MenuItem>
					<MenuItem value="Warm">Warm</MenuItem>
					<MenuItem value="Hot">Hot</MenuItem>
				</Select>

				<Button variant="contained" onClick={updateTier}>
					Save
				</Button>
			</Box>
		</Modal>
	)
}

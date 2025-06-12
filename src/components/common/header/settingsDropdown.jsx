import React from 'react'
import {
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	CircularProgress,
	Box,
} from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'
import axios from 'axios'
import { toast } from 'react-toastify'

// Configure axios base URL
const api = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8083/api',
})

function SettingsDropdown() {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
	const [openScheduleDialog, setOpenScheduleDialog] = React.useState(false)
	const [isLoading, setIsLoading] = React.useState(false)
	const [scheduleDate, setScheduleDate] = React.useState('')
	const [scheduleTime, setScheduleTime] = React.useState('')

	// Set default date and time on component mount
	React.useEffect(() => {
		const now = new Date()
		const today = now.toISOString().split('T')[0] // YYYY-MM-DD format
		const currentTime = now.toTimeString().split(' ')[0].substring(0, 5) // HH:MM format
		setScheduleDate(today)
		setScheduleTime(currentTime)
	}, [])

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleDeleteAllLeads = async () => {
		setIsLoading(true)
		try {
			await api.delete('/sales/leads/delete-by-user')
			toast.success('All leads deleted successfully')
			setOpenDeleteDialog(false)
			// You might want to refresh the leads data here
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to delete leads')
		} finally {
			setIsLoading(false)
		}
	}

	const handleScheduleLeads = async () => {
		if (!scheduleDate || !scheduleTime) {
			toast.error('Please select both date and time')
			return
		}

		setIsLoading(true)
		try {
			await api.post('/sales/leads/schedulelater', {
				date: scheduleDate, // Already in YYYY-MM-DD format
				time: scheduleTime + ':00', // Convert HH:MM to HH:MM:SS
			})

			toast.success('Lead pull scheduled successfully')
			setOpenScheduleDialog(false)
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to schedule lead pull')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<Tooltip title="Settings">
				<IconButton color="inherit" onClick={handleMenuOpen} sx={{ ml: 2 }}>
					<SettingsIcon />
				</IconButton>
			</Tooltip>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
				<MenuItem
					onClick={() => {
						setOpenDeleteDialog(true)
						handleMenuClose()
					}}>
					Delete All Leads
				</MenuItem>
				<MenuItem
					onClick={() => {
						setOpenScheduleDialog(true)
						handleMenuClose()
					}}>
					Schedule Lead Pull
				</MenuItem>
			</Menu>

			{/* Delete All Leads Dialog */}
			<Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
				<DialogTitle>Delete All Leads</DialogTitle>
				<DialogContent>Are you sure you want to delete all leads? This action cannot be undone.</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
					<Button onClick={handleDeleteAllLeads} color="error" disabled={isLoading}>
						{isLoading ? <CircularProgress size={24} /> : 'Delete'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Schedule Lead Pull Dialog */}
			<Dialog
				open={openScheduleDialog}
				onClose={() => setOpenScheduleDialog(false)}
				maxWidth="xs"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 3,
						p: 2,
					},
				}}>
				<DialogTitle>Schedule Lead Pull</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
						<TextField
							label="Date"
							type="date"
							value={scheduleDate}
							onChange={(e) => setScheduleDate(e.target.value)}
							fullWidth
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								style: { padding: '12px' }, // Ensure padding for visibility
							}}
						/>
						<TextField
							label="Time"
							type="time"
							value={scheduleTime}
							onChange={(e) => setScheduleTime(e.target.value)}
							fullWidth
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								style: { padding: '12px' },
							}}
						/>
					</Box>
				</DialogContent>
				<DialogActions sx={{ justifyContent: 'flex-end', pt: 2 }}>
					<Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
					<Button onClick={handleScheduleLeads} color="primary" disabled={isLoading}>
						{isLoading ? <CircularProgress size={24} /> : 'Schedule'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default SettingsDropdown

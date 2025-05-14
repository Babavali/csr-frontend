/*eslint-disable no-unused-vars */

import React from 'react'
import AppBar from '@mui/material/AppBar'
import { Box, Avatar } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../slices/userDetailsSlice'

function Header(props) {
	const location = window.location.pathname
	const user = useSelector((state) => state.user)
	const dispatch = useDispatch()
	const [anchorElUser, setAnchorElUser] = React.useState(null)
	const navigate = useNavigate()
	const matches = useMediaQuery('(min-width: 600px)')

	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}

	const getHeading = () => {
		const pathname = window.location.pathname
		if (pathname.startsWith('/dashboard')) {
			return 'Dashboard'
		} else if (pathname.startsWith('/leads')) {
			return 'All Leads'
		} else if (pathname.startsWith('/follow-ups')) {
			return 'Follow Ups'
		} else if (pathname.startsWith('/offline/leads')) {
			return 'Partner Leads'
		} else if (pathname.startsWith('/offline/follow-ups')) {
			return 'Partner Follow Ups'
		} else if (pathname.startsWith('/mt-leads')) {
			return 'MT Leads'
		} else if (pathname.startsWith('/client-leads')) {
			return 'Client Leads'
		} else if (pathname.startsWith('/partner-leads')) {
			return 'Partner Leads'
		} else if (pathname.startsWith('/business-partner/doctor/follow-ups')) {
			return 'Doctor Follow Ups'
		} else if (pathname.startsWith('/business-partner/sales/follow-ups')) {
			return 'Sales Follow Ups'
		} else if (pathname.startsWith('/business-partner/add')) {
			return 'Add a Doctor'
		} else if (pathname.startsWith('/business-partner/doctor/edit')) {
			return 'Edit Doctor'
		} else if (pathname.startsWith('/business-partners')) {
			return 'Doctors'
		} else if (pathname.startsWith('/business-partner')) {
			return 'Doctor Detail'
		} else if (pathname.startsWith('/lead/add')) {
			return 'Add Lead'
		} else if (pathname.startsWith('/edit')) {
			return 'Edit Lead'
		} else if (pathname.startsWith('/documents')) {
			return 'Documents'
		} else if (pathname.startsWith('/lead-updates')) {
			return 'Lead Updates'
		} else if (pathname.startsWith('/lead')) {
			return 'Lead Details'
		} else if (pathname.startsWith('/pending-approval')) {
			return 'Pending Approval'
		} else if (pathname.startsWith('/edit-member')) {
			return 'Edit Member'
		} else if (pathname.startsWith('/members')) {
			return 'Members'
		} else if (pathname.startsWith('/doctor/activity')) {
			return 'Doctor Activity Dashboard'
		}
	}
	const displayAddSalesLeadButton = () => {
		const pathname = window.location.pathname
		if (pathname.startsWith('/lead')) {
			return true
		} else if (pathname.startsWith('/follow-ups')) {
			return true
		} else if (pathname.startsWith('/offline/leads')) {
			return true
		} else if (pathname.startsWith('/offline/follow-ups')) {
			return true
		} else if (pathname.startsWith('/mt-leads')) {
			return true
		} else if (pathname.startsWith('/client-leads')) {
			return true
		}
		return false
	}
	const displayAddPartnerLeadButton = () => {
		const pathname = window.location.pathname
		const queryParameter = window.location.search
		if (pathname.startsWith('/business-partner') && queryParameter.startsWith('?type=doctor')) {
			return true
		}
		return false
	}

	const redirectHandler = (path) => {
		navigate(path)
	}

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorElUser(null)
	}

	const handleLogout = () => {
		setAnchorElUser(null)
		const authToken = new Cookies().remove('x-auth-token', { path: '/' })

		if (!authToken) {
			redirectHandler('/login')
		}
		dispatch(logout())
	}

	const userName = user.userName

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar
				position="fixed"
				sx={{
					width: `100%`,
				}}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: matches ? 2 : 0 }}
						onClick={props.handleDrawerToggle}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						{getHeading(navigate)}
					</Typography>
					{displayAddSalesLeadButton() && isAllowed('add_lead') && (
						<Tooltip arrow title="Add Sales Lead">
							<IconButton
								sx={{
									marginRight: 2,
									backgroundColor: 'white',
									':hover': {
										backgroundColor: 'white', // theme.palette.primary.main
									},
								}}
								onClick={() => {
									redirectHandler('/lead/add')
								}}>
								<AddIcon sx={{ color: 'blue' }} />
							</IconButton>
						</Tooltip>
					)}
					{displayAddPartnerLeadButton() && isAllowed('add_doctor') && (
						<Tooltip arrow title="Add Doctor Lead">
							<IconButton
								sx={{
									marginRight: 2,
									backgroundColor: 'black',
									':hover': {
										backgroundColor: 'black',
									},
								}}
								onClick={() => {
									redirectHandler('/business-partner/add')
								}}>
								<AddIcon sx={{ color: '#fff' }} />
							</IconButton>
						</Tooltip>
					)}
					<Box sx={{ flexGrow: 0, marginLeft: '10px', cursor: 'pointer' }}>
						<Box
							aria-label="Account of Current User"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenUserMenu}
							display="flex"
							justifyContent="center"
							alignItems="center"
							style={{ borderLeft: '2px solid #D3D3D3' }}>
							<Avatar sx={{ bgcolor: '#D3D3D3', marginRight: 1, marginLeft: 2 }}>{userName.charAt(0)}</Avatar>
							{matches && <Typography variant="h6">{userName}</Typography>}
							<ExpandMoreIcon sx={{ marginLeft: 0 }} />
						</Box>
						<Menu
							sx={{ mt: matches ? '45px' : '40px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleClose}
							disablescrolllock={true}>
							<MenuItem onClick={handleLogout} sx={{ width: '200px', display: 'flex', justifyContent: 'space-between' }}>
								<Typography textAlign="center">Logout</Typography>
								<LogoutIcon />
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	)
}

export default Header

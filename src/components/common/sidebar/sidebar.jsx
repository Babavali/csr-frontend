import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import GroupsIcon from '@mui/icons-material/Groups'
import Toolbar from '@mui/material/Toolbar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Divider } from '@mui/material'
import Logo from '../../../assets/logo.svg'
import { useMediaQuery } from '@mui/material'

function Sidebar(props) {
	const user = useSelector((state) => state.user)
	const isAllowed = (perm) => {
		const permissions = user.permissions
		if (permissions[perm]) {
			return true
		}
		return false
	}
	// const navigationOptions = [
	// 	{
	// 		name: 'Dashboard',
	// 		url: '/dashboard',
	// 	},
	// 	{
	// 		name: 'Leads',
	// 		url: '/leads',
	// 	},
	// 	{
	// 		name: 'Offline Leads',
	// 		url: '/offline/leads',
	// 	},
	// 	{
	// 		name: 'Business Partners',
	// 		url: '/business-partners',
	// 	},
	// 	{
	// 		name: 'Upload Leads',
	// 		url: '/upload-leads',
	// 	},
	// {
	//   name: "Analytics",
	//   url: "/analytics",
	// },
	// {
	//   name: "Revenue",
	//   url: "/revenue",
	// },
	// { name: "Approval", url: "/approval" },
	// ]
	const NavigationOptions = [
		{
			name: 'Dashboard',
			url: '/dashboard',
			value: isAllowed('admin_dashboard_access'),
		},
		{
			name: 'All Leads',
			url: '/leads',
			value: user.isAdmin || user.isAuditor,
		},
		{
			name: 'MT Leads',
			url: '/mt-leads',
			value: user.isAdmin || user.isAuditor || user.type?.is_mt,
		},
		{
			name: 'Client Leads',
			url: '/client-leads',
			value: user.isAdmin || user.isAuditor || user.type?.is_client,
		},
		{
			name: 'Partner Leads',
			url: '/offline/leads',
			value: user.isAdmin || user.isAuditor || user.type?.is_partner,
		},
		{
			name: 'Lead Updates',
			url: '/lead-updates',
			value: isAllowed('lead_update_module_access'),
		},
		{
			name: 'Members',
			url: '/members',
			value: user.isAdmin,
		},
		{
			name: 'Pending Approval',
			url: '/pending-approval',
			value: user.isAdmin,
		},
		{
			name: 'User',
			url: '/business-partners',
			value: user.isAdmin || user.isAuditor || user.type?.is_mt,
		},
		{
			name: 'User Activity',
			url: '/doctor/activity',
			value: user.isAdmin || user.isAuditor || isAllowed('doctor_activity_dashboard'),
		},
		{
			name: 'Arrival Sheet',
			url: '/arrival-sheet',
			value: isAllowed('arrival_sheet_access'),
		},
		{
			name: 'Upload Leads',
			url: '/upload-leads',
			value: isAllowed('upload_lead_csv'),
		},
		// {
		//   name: "Analytics",
		//   url: "/analytics",
		// },
		// {
		//   name: "Revenue",
		//   url: "/revenue",
		// },
		// { name: "Approval", url: "/approval" },
	]
	const navigate = useNavigate()
	const matches = useMediaQuery('(min-width: 600px)')
	const drawerWidth = matches ? 240 : 300

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			PaperProps={{
				sx: {
					backgroundColor: '#3a3b3c',
					color: 'white',
				},
			}}
			// disablescrolllock="true"
			// variant={matches ? 'persistent' : 'temporary'}
			variant="temporary"
			open={props.isDrawerOpen}
			onClose={props.onClose}>
			<Toolbar style={{ justifyContent: 'center' }}>
				<img src={Logo} alt="Logo" width={110} />
			</Toolbar>
			<Divider />
			<List>
				{NavigationOptions.map((option) => {
					if (option.value) {
						return (
							<ListItem key={option.url} disablePadding>
								<ListItemButton>
									<ListItemIcon>
										<GroupsIcon color="primary" />
									</ListItemIcon>
									<ListItemText
										onClick={() => {
											navigate(option.url)
											props.onClose()
										}}
										primary={option.name}
									/>
								</ListItemButton>
							</ListItem>
						)
					}
				})}
			</List>
		</Drawer>
	)
}

export default Sidebar

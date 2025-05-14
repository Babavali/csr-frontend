import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Sidebar } from '../../components/common'
import Box from '@mui/material/Box'
import { useMediaQuery } from '@mui/material'

function Layout() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)

	const handleDrawerToggle = () => {
		setIsDrawerOpen((previous) => !previous)
	}

	const matches = useMediaQuery('(min-width: 600px)')

	return (
		<div>
			<header>
				<Header handleDrawerToggle={handleDrawerToggle} open={isDrawerOpen} />
			</header>
			<Box sx={{ display: 'flex' }}>
				{isDrawerOpen && <Sidebar isDrawerOpen={isDrawerOpen} onClose={handleDrawerToggle} />}
				<Box
					sx={{
						display: 'flex',
						width: '100%',
						marginTop: 10,
						marginLeft: matches ? 2 : 0,
					}}>
					<Outlet />
				</Box>
			</Box>
		</div>
	)
}

export default Layout

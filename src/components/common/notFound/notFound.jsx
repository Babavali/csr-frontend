import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function NotFound() {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				minHeight: '100vh',
				backgroundColor: 'primary',
			}}>
			<Typography variant="h1" style={{ color: 'black' }}>
				404
			</Typography>
			<Typography variant="h6" style={{ color: 'black' }}>
				The page you’re looking for doesn’t exist.
			</Typography>
			<Button variant="contained" component={Link} to="/leads" sx={{ mt: 3 }}>
				Back Home
			</Button>
		</Box>
	)
}

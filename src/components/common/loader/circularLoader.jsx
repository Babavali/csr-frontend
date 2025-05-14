import { CircularProgress } from '@mui/material'
import React from 'react'

function CircularLoader() {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '60vh',
			}}>
			<CircularProgress />
		</div>
	)
}

export default CircularLoader

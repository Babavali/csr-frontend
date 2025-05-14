import React from 'react'
import MCard from '@mui/material/Card'

function Card(props) {
	return (
		<MCard
			raised={true}
			style={{
				maxWidth: 500,
				marginTop: '40px',
				padding: '4px',
			}}
		>
			{props}
		</MCard>
	)
}

export default Card

import MTextField from '@mui/material/TextField'
import React from 'react'

function TextField(props) {
	return (
		<MTextField
			label={props.label}
			name={props.name}
			variant="outlined"
			margin="dense"
			size="small"
			fullWidth={props.fullWidth}
			value={props.value}
			onChange={props.onChange}
			onBlur={props.onBlur}
			helperText={props.helperText}
			error={props.error}
			type={props.type}
			InputProps={props.InputProps}
			InputLabelProps={props.InputLabelProps}
			required={props.required}
			multiline={props.multiline}
			rows={props.rows}
			maxRows={props.maxRows}
		/>
	)
}

export default TextField

import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   outline: 0,
// };

function submitLoadingButton(props) {
	return (
		<>
			<LoadingButton
				variant="contained"
				type="submit"
				color="primary"
				loading={props.loading}
				style={{ width: '200px', fontSize: '18px' }}>
				Submit
			</LoadingButton>
			<Dialog open={props.open} onClose={() => {}} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">{props.description}</DialogTitle>

				<DialogActions>
					<Button variant="contained" onClick={props.handleRedirectPrimaryButton}>
						{props.primaryButton}
					</Button>
					<Button variant="contained" onClick={props.handleRedirectSecondaryButton} autoFocus>
						{props.secondaryButton}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default submitLoadingButton

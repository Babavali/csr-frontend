import React, { useState } from 'react'
import backgroundImage from '../../../assets/backgroundAuth.webp'
import TextField from '../../../components/common/textField/textField'
import { ErrorMessage, Form, Formik } from 'formik'
import { useNavigate, useLocation } from 'react-router-dom'
import { Validations } from '../../../shared/validations'
import * as Yup from 'yup'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import axios from '../../../shared/axios'
import { toast } from 'react-toastify'

function ResetPassword() {
	const navigate = useNavigate()
	const [modal, setModal] = useState(false)
	const [loading, toggleLoading] = useState(false)
	const search = useLocation().search
	const resetPasswordToken = new URLSearchParams(search).get('token')

	const redirectHandler = (path) => {
		navigate(path)
	}
	const schema = Yup.object({
		password: Validations.password,
		confirmPassword: Validations.confirmPassword,
	})

	const initialValues = {
		password: '',
		confirmPassword: '',
	}

	const handleSubmit = (values, props) => {
		const { password } = values
		toggleLoading(true)
		axios
			.post('/sales/auth/reset-password', {
				password,
				resetPasswordToken,
			})
			.then((res) => {
				if (res?.status === 200) {
					toggleLoading(false)
					setModal(true)
				}
			})
			.catch((error) => {
				if (error?.response?.request?.status === 401) {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				} else {
					toast.error('Something went wrong', {
						position: 'bottom-left',
					})
				}
				toggleLoading(false)
			})
		props.resetForm()
	}

	return (
		<div
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: 'cover',
				overflow: 'auto',
				height: '100vh',
			}}>
			<Grid container direction="row" justifyContent="flex-end" alignItems="center" height="100%">
				<Paper elevation={10} style={{ marginRight: '50px' }}>
					<Box m={4} p={3}>
						<Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
							{(props) => {
								const { password, confirmPassword } = props.values
								return (
									<Form>
										{!modal ? (
											<>
												<Box mb={2}>
													<Typography variant="h4">Reset password</Typography>
												</Box>
												<TextField
													label="New Password"
													name="password"
													type="password"
													fullWidth
													variant="outlined"
													margin="dense"
													value={password}
													onChange={props.handleChange}
													onBlur={props.handleBlur}
													helperText={<ErrorMessage name="password" />}
													error={props.errors.password && props.touched.password}
													required
												/>
												<TextField
													label="Confirm New Password"
													name="confirmPassword"
													type="password"
													fullWidth
													variant="outlined"
													margin="dense"
													value={confirmPassword}
													onChange={props.handleChange}
													onBlur={props.handleBlur}
													helperText={<ErrorMessage name="confirmPassword" />}
													error={props.errors.confirmPassword && props.touched.confirmPassword}
													required
												/>
												<Box mt={1} mb={2}>
													<LoadingButton
														variant="contained"
														type="submit"
														loading={loading}
														color="primary"
														fullWidth>
														Submit
													</LoadingButton>
												</Box>
											</>
										) : (
											<>
												<Box display="flex" justifyContent="center">
													<CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'green' }} />
												</Box>

												<Box m={2} display="flex" justifyContent="center">
													<Typography variant="h4">Password has been updated</Typography>
												</Box>
												<Box mt={2} display="flex" justifyContent="center">
													<LoadingButton
														variant="contained"
														color="primary"
														size="large"
														onClick={() => {
															redirectHandler('/login')
														}}>
														Login
													</LoadingButton>
												</Box>
											</>
										)}
									</Form>
								)
							}}
						</Formik>
					</Box>
				</Paper>
			</Grid>
		</div>
	)
}

export default ResetPassword

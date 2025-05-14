import React, { useState } from 'react'
import backgroundImage from '../../../assets/backgroundAuth.webp'
import { Box, Grid, Paper, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { ErrorMessage, Form, Formik } from 'formik'
import axios from '../../../shared/axios'
import { Validations } from '../../../shared/validations'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

function ForgotPassword() {
	const navigate = useNavigate()
	const [loading, toggleLoading] = useState(false)

	const redirectHandler = (path) => {
		navigate(path)
	}

	const schema = Yup.object({
		email: Validations.email,
	})

	const initialValues = {
		email: '',
	}

	const handleSubmit = (values, props) => {
		toggleLoading(true)
		axios
			.post('/sales/auth/forgot-password', values)
			.then((res) => {
				if (res?.status === 200) {
					toggleLoading(false)
					toast.success('Check your email for reset link', {
						position: 'bottom-left',
					})
				}
			})
			.catch((error) => {
				if (error?.response?.request?.status === 401) {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				} else if (error?.response?.request?.status === 404) {
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
						<Box mb={2}>
							<Typography variant="h4">Forgot Password?</Typography>
						</Box>
						<Box mb={2}>
							<Typography variant="h7">Enter the email address associated with your clead account</Typography>
						</Box>
						<Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
							{(props) => {
								const { email } = props.values
								return (
									<Form>
										<TextField
											label="Email"
											name="email"
											fullWidth
											variant="outlined"
											margin="dense"
											size="small"
											value={email}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
											helperText={<ErrorMessage name="email" />}
											error={props.errors.email && props.touched.email}
											required
										/>
										<Box mt={1}>
											<LoadingButton variant="contained" type="submit" loading={loading} color="primary" fullWidth>
												Reset Password
											</LoadingButton>
										</Box>
										<Box mt={2} display="flex" justifyContent="center">
											<LoadingButton
												variant="text"
												color="primary"
												onClick={() => {
													redirectHandler('/login')
												}}>
												Login
											</LoadingButton>
										</Box>
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

export default ForgotPassword

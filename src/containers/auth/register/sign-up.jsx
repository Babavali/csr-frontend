import * as React from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { Formik, Form, ErrorMessage } from 'formik'
import { Validations } from '../../../shared/validations'
import { useState } from 'react'
import * as Yup from 'yup'
import axios from '../../../shared/axios'
import { useNavigate } from 'react-router-dom'
import LoadingButton from '../../../components/common/loadingButton/loadingButton'
import CustomModal from '../../../components/common/customModal/customModal'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { toast } from 'react-toastify'
import TextField from '../../../components/common/textField/textField'
import backgroundImage from '../../../assets/backgroundAuth.webp'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	outline: 0,
}

function Register() {
	const navigate = useNavigate()
	const [loading, toggleLoading] = useState(false)
	const [openModal, setOpenModal] = useState(false)

	const redirectHandler = (path) => {
		navigate(path)
	}

	const schema = Yup.object({
		first_name: Validations.firstName,
		last_name: Validations.lastName,
		email: Validations.email,
		password: Validations.password,
		confirmPassword: Validations.confirmPassword,
	})

	const initialValue = {
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		confirmPassword: '',
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}
		setOpenModal(false)
		redirectHandler('/login')
	}

	const handleSubmit = (values, props) => {
		toggleLoading(true)
		axios
			.post(`/sales/auth/signup`, values)
			.then((res) => {
				if (res?.status === 201) {
					setOpenModal(true)
					toggleLoading(false)
				}
			})
			.catch((error) => {
				if (error?.response?.request?.status === 400) {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				} else if (error?.response?.request?.status === 401) {
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
				<Grid item sm={5} xs={12}>
					<Paper elevation={10} style={{ marginRight: '50px' }}>
						<Box m={5} p={3}>
							<Box mb={2}>
								<Typography variant="h4">Register</Typography>
							</Box>
							<Box mb={2}>
								<Typography variant="h7">Please enter your details and create an account</Typography>
							</Box>
							<Formik initialValues={initialValue} validationSchema={schema} onSubmit={handleSubmit}>
								{(props) => {
									const { first_name, last_name, email, password, confirmPassword } = props.values
									return (
										<Form>
											<Grid container spacing={2}>
												<Grid item>
													<TextField
														label="First Name"
														name="first_name"
														value={first_name}
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														helperText={<ErrorMessage name="first_name" />}
														error={props.errors.first_name && props.touched.first_name}
													/>
												</Grid>
												<Grid item>
													<TextField
														label="Last Name"
														name="last_name"
														value={last_name}
														onChange={props.handleChange}
														onBlur={props.handleBlur}
														helperText={<ErrorMessage name="last_name" />}
														error={props.errors.last_name && props.touched.last_name}
													/>
												</Grid>
											</Grid>
											<TextField
												label="Email"
												name="email"
												value={email}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
												helperText={<ErrorMessage name="email" />}
												error={props.errors.email && props.touched.email}
												fullWidth
											/>
											<TextField
												label="Password"
												name="password"
												type="password"
												value={password}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
												helperText={<ErrorMessage name="password" />}
												error={props.errors.password && props.touched.password}
												fullWidth
											/>
											<TextField
												label="Confirm Password"
												name="confirmPassword"
												type="password"
												value={confirmPassword}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
												helperText={<ErrorMessage name="confirmPassword" />}
												error={props.errors.confirmPassword && props.touched.confirmPassword}
												fullWidth
											/>
											<Box mt={1}>
												<LoadingButton
													variant="contained"
													type="submit"
													loading={loading}
													color="primary"
													fullWidth>
													Submit
												</LoadingButton>
											</Box>
											<CustomModal openModal={openModal} handleClose={handleClose}>
												<Box sx={style}>
													<center>
														<CheckCircleIcon style={{ color: 'green' }} />
													</center>
													<Typography id="modal-modal-title" variant="h6" component="h2" align="center">
														Account Created Successfully!
													</Typography>
													<Typography align="center" id="modal-modal-description" sx={{ mt: 2 }}>
														Please contact System Admin to activate your account
													</Typography>
												</Box>
											</CustomModal>
											<Box mt={2} display="flex" justifyContent="center">
												<div>
													Already have an account?
													<LoadingButton
														variant="text"
														color="primary"
														onClick={() => {
															redirectHandler('/login')
														}}>
														Login
													</LoadingButton>
												</div>
											</Box>
										</Form>
									)
								}}
							</Formik>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</div>
	)
}

export default Register

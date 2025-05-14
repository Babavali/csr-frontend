/*eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { Box, Grid, Paper, Typography, Link, useMediaQuery } from '@mui/material'
import { ErrorMessage, Formik, Form } from 'formik'
import { useNavigate } from 'react-router-dom'
import { Validations } from '../../../shared/validations'
import axios from '../../../shared/axios'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Cookies from 'universal-cookie'
import TextField from '../../../components/common/textField/textField'
import backgroundImage from '../../../assets/backgroundAuth.webp'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAdmin, setUserId, setUserName, setPermissions, setIsAuditor, setType } from '../../../slices/userDetailsSlice'

function Login() {
	const user = useSelector((state) => state.user)
	// const isAllowed = (perm) => {
	// 	const permissions = user.permissions
	// 	if (permissions[perm]) {
	// 		return true
	// 	}
	// 	return false
	// }
	const navigate = useNavigate()
	const [loading, toggleLoading] = useState(false)
	const cookie = new Cookies()
	const matches = useMediaQuery('(min-width: 600px)')
	const dummyPerm = {
		status: {
			is_auditor: false,
			is_admin: false,
		},
		type: {
			is_client: true,
			is_mt: false,
			is_partner: false,
		},
		permissions: {
			view_doctor: true, //done
			edit_doctor: true, //done
			add_doctor: true, //done
			view_doctor_followup: true, //done
			add_doctor_followup: true, //done
			add_doctor_remark: true, //done
			get_doctor_recent_activity: true, //done
			get_doctor_leads_csv: true, // done
			view_partner: true /*done*/,
			edit_partner: false /*done*/,
			view_partner_followup: true /*done*/,
			add_partner_followup: true /*done*/,
			add_partner_remark: false /*done*/,
			get_partner_recent_activity: true /*done*/,
			get_partner_leads_csv: true /*done*/,
			view_lead: true /*done*/,
			edit_lead: true /*done*/,
			transfer_lead: true /*done*/,
			add_lead: true /*done*/,
			view_lead_followup: true /*done*/,
			add_lead_followup: true /*done*/,
			add_lead_remark: true /*done*/,
			get_lead_recent_activity: true /*done*/,
			share_lead: true /*done*/,
			allocate_or_assign_lead: true /*done*/,
			approve_lead: true /*done*/,
			get_lead_csv: true /*done*/,
			admin_dashboard_access: true /*done*/,
			lead_update_module_access: true /*done*/,
			arrival_sheet_access: true /*done*/,
			upload_lead_csv: true /*done*/,
		},
	}
	const redirectHandler = (path, type) => {
		if (type?.is_client) {
			navigate('/client-leads')
		} else if (type?.is_partner) {
			navigate('/offline/leads')
		} else if (type?.is_mt) {
			navigate('/mt-leads')
		} else {
			navigate(path)
		}
	}

	const schema = Yup.object({
		email: Validations.email,
		password: Validations.password,
	})

	const dispatch = useDispatch()

	const handleIsAdmin = (isAdmin) => {
		dispatch(setIsAdmin(isAdmin))
	}

	const handleChangeUserId = (userId) => {
		dispatch(setUserId(userId))
	}

	const handleChangeUsername = (username) => {
		dispatch(setUserName(username))
	}

	const handlePermissions = (permissions) => {
		dispatch(setPermissions(permissions))
	}

	const handleIsAuditor = (isAuditor) => {
		dispatch(setIsAuditor(isAuditor))
	}

	const handleType = (userType) => {
		dispatch(setType(userType))
	}
	const initialValues = {
		email: '',
		password: '',
	}

	const handleSubmit = (values, props) => {
		toggleLoading(true)
		axios
			.post('/sales/auth/login', values)
			.then(async (res) => {
				if (res?.status === 200) {
					cookie.set('x-auth-token', res.data.data.token, {
						path: '/',
						maxAge: 86400,
					})
					handleIsAdmin(res.data.data.user.is_admin)
					handleIsAuditor(res.data.data.user.is_auditor)
					handlePermissions(res.data.data.user.permissionsObj)
					handleType(res.data.data.user.type)
					handleChangeUserId(res.data.data.user.id)
					handleChangeUsername(res.data.data.user.full_name)
					toggleLoading(false)
					redirectHandler('/leads', res.data.data.user.type)
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
				<Grid item md={5} xs={12}>
					<Paper elevation={10} style={{ marginRight: matches ? '50px' : '0px' }}>
						<Box m={matches ? 4 : 2} p={matches ? 3 : 2}>
							<Box mb={2}>
								<Typography variant={matches ? 'h4' : 'h5'}>Hello Again!</Typography>
							</Box>
							<Box mb={2}>
								<Typography style={{ fontSize: matches ? '18px' : '14px' }}>
									Enter the information you entered while registering
								</Typography>
							</Box>
							<Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
								{(props) => {
									const { email, password } = props.values
									return (
										<Form>
											<TextField
												label="Email"
												name="email"
												fullWidth
												variant="outlined"
												margin="dense"
												value={email}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
												helperText={<ErrorMessage name="email" />}
												error={props.errors.email && props.touched.email}
												required
											/>
											<TextField
												label="Password"
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
											<Grid mt={1} container alignItems="center" justifyContent="space-between">
												<Grid item>
													<Link href="/forgot-password" underline="none" variant="body2">
														Forgot password?
													</Link>
												</Grid>
											</Grid>
											<Box mt={1}>
												<LoadingButton
													variant="contained"
													type="submit"
													loading={loading}
													color="primary"
													fullWidth>
													Login
												</LoadingButton>
											</Box>
											<Box mt={2} display="flex" justifyContent="center">
												<div>
													Don&apos;t have an account yet?
													<LoadingButton
														variant="text"
														color="primary"
														onClick={() => {
															redirectHandler('/register', {})
														}}>
														Sign up
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

export default Login

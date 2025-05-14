/* eslint-disable no-unused-vars*/
import { useNavigate } from 'react-router-dom'
// MUI Components
import { Divider, Typography, Button, Box, Grid, Table, TableCell, TableRow, TableBody } from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
// MUI Icons
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { useSelector } from 'react-redux'

export default function PreviewLeadDetails({ matches, lead_id, data, userID }) {
	const user = useSelector((state) => state.user)
	const navigate = useNavigate()
	const redirectHandler = (path, optionalArguments) => {
		navigate(path, optionalArguments)
	}
	return (
		<Box sx={{ paddingX: matches ? 5 : 2, paddingY: 2, border: '1px solid #1976D2', borderRadius: '4px' }}>
			<Grid container spacing={2}>
				{/* Patient Information */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6">Patient Information</Typography>
					<Divider
						sx={{
							borderBottomWidth: 4,
							borderColor: '#0089D6',
							width: '100px',
							marginBottom: 2,
						}}
					/>

					<Table
						size="small"
						sx={{
							[`& .${tableCellClasses.root}`]: {
								borderBottom: 'none',
								fontSize: 16,
							},
						}}>
						<TableBody>
							{/* Patient Name */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Name :</TableCell>
								<TableCell>{data?.patient.name ? data?.patient.name : '----'}</TableCell>
							</TableRow>
							{/* Patient Gender */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Gender :</TableCell>
								<TableCell>{data?.patient.gender ? data?.patient.gender : '----'}</TableCell>
							</TableRow>
							{/* Patient DOB */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Date of Birth (Age) :</TableCell>
								<TableCell>
									{data?.patient.date_of_birth ? data?.patient.date_of_birth : '----'}
									{data?.patient.age ? `(${data?.patient.age})` : ''}
								</TableCell>
							</TableRow>
							{/* Patient City */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>City :</TableCell>
								<TableCell>{data?.patient.city.name ? data?.patient.city.name : '----'}</TableCell>
							</TableRow>
							{/* Patient Country */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Country :</TableCell>
								<TableCell>{data?.patient.country.name ? data?.patient.country.name : '----'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				{/* Additional Information */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6">Additional Information</Typography>
					<Divider
						sx={{
							borderBottomWidth: 4,
							borderColor: '#0089D6',
							width: '100px',
							marginBottom: 2,
						}}
					/>
					<Table
						size="small"
						sx={{
							[`& .${tableCellClasses.root}`]: {
								borderBottom: 'none',
								fontSize: 16,
							},
						}}>
						<TableBody>
							{/* Message */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Message :</TableCell>
								<TableCell>
									{data?.additional_information.message ? data?.additional_information.message : '----'}
								</TableCell>
							</TableRow>
							{/* Partner Name */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Partner Name :</TableCell>
								<TableCell>
									{data?.additional_information.partner_name
										? data?.additional_information.partner_name.replace(/_/g, ' ')
										: '----'}
								</TableCell>
							</TableRow>
							{/* Lead Source */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Lead Source :</TableCell>
								<TableCell>
									{data?.additional_information.lead_source
										? data?.additional_information.lead_source.replace(/_/g, ' ')
										: '----'}
								</TableCell>
							</TableRow>
							{/* Hospital Name */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Hospital Name:</TableCell>
								<TableCell>
									{data?.additional_information.facility.name ? data?.additional_information.facility.name : '----'}
								</TableCell>
							</TableRow>
							{/* Category */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Category :</TableCell>
								<TableCell>
									{data?.additional_information.category.name ? data?.additional_information.category.name : '----'}
								</TableCell>
							</TableRow>
							{/* Treatment Intensity */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Treatment Intensity :</TableCell>
								<TableCell>
									{data?.additional_information.treatment_intensity
										? data?.additional_information.treatment_intensity
										: '----'}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Registration Number :</TableCell>
								<TableCell>{data?.registration_number ? data?.registration_number : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Estimated Amount :</TableCell>
								<TableCell>{data?.estimated_invoice ? data?.estimated_invoice : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Actual Amount :</TableCell>
								<TableCell>{data?.actual_invoice ? data?.actual_invoice : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Hotel Name :</TableCell>
								<TableCell>{data?.hotel_name ? data?.hotel_name : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Hotel Type :</TableCell>
								<TableCell>{data?.hotel_type ? data?.hotel_type.replaceAll('_', ' ') : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Visa Expiry Date :</TableCell>
								<TableCell>{data?.visa_expiry_at ? data?.visa_expiry_at : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Field Person :</TableCell>
								<TableCell>{data?.field_person_name ? data?.field_person_name : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Arrival Date :</TableCell>
								<TableCell>{data?.arrival_at ? data?.arrival_at : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Arrival Type :</TableCell>
								<TableCell>{data?.arrival_type ? data?.arrival_type : '----'}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Passport Number :</TableCell>
								<TableCell>{data?.passport_number ? data?.passport_number : '----'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				{/* Enquirer Information */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6">Enquirer Information</Typography>
					<Divider
						sx={{
							borderBottomWidth: 4,
							borderColor: '#0089D6',
							width: '100px',
							marginBottom: 2,
						}}
					/>

					<Table
						size="small"
						sx={{
							[`& .${tableCellClasses.root}`]: {
								borderBottom: 'none',
								fontSize: 16,
							},
						}}>
						<TableBody>
							{/* Enquirer Name */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Name : </TableCell>
								<TableCell>{data?.enquirer.name ? data?.enquirer.name : '----'}</TableCell>
							</TableRow>
							{/* Enquirer Gender */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Email : </TableCell>
								<TableCell>
									{data?.enquirer.email
										? user.isAuditor
											? `${data.enquirer.email.slice(0, 3)}********`
											: data.enquirer.email
										: '----'}
								</TableCell>
							</TableRow>
							{/* Enquirer Phone */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Phone : </TableCell>
								<TableCell>
									{data?.enquirer.phone
										? user.isAuditor
											? `${data.enquirer.phone.slice(0, 5)}********`
											: data.enquirer.phone
										: '----'}
								</TableCell>
							</TableRow>
							{/* Enquirer Relationship with Patient */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Relationship with Patient : </TableCell>
								<TableCell>{data?.enquirer.relationship ? data?.enquirer.relationship : '----'}</TableCell>
							</TableRow>
							{/* Enquirer Country */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Country :</TableCell>
								<TableCell>{data?.enquirer.country.name ? data?.enquirer.country.name : '----'}</TableCell>
							</TableRow>
							{/* Contact Means */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Contact Means :</TableCell>
								<TableCell>
									{data?.enquirer.preferred_contact_means ? data?.enquirer.preferred_contact_means : '----'}
								</TableCell>
							</TableRow>
							{/* Estimated Amount */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Estimated Amount :</TableCell>
								<TableCell>{data.meta_data?.estimated_invoice ? data.meta_data.estimated_invoice : '----'}</TableCell>
							</TableRow>
							{/* Contact Means */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Actual Amount :</TableCell>
								<TableCell>{data.meta_data?.actual_invoice ? data.meta_data.actual_invoice : '----'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				{/* Documents */}
				<Grid item xs={12} md={6}>
					<Button
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignContent: 'center',
							borderRadius: '6px',
							marginTop: 10,
							textTransform: 'capitalize !important',
						}}
						fullWidth
						variant="contained"
						onClick={() => {
							redirectHandler(`/lead/${lead_id}/documents`)
						}}>
						<Typography variant="h6">Documents</Typography>
						<KeyboardArrowRightIcon fontSize="large" />
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
}

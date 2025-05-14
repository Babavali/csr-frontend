/* eslint-disable no-unused-vars*/
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// MUI Components
import { Divider, Typography, Button, Box, Grid, Table, TableCell, TableRow, TableBody } from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
// MUI Icons
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export default function PartnerLeadDetailInformation({ type, matches, lead_id, data }) {
	const user = useSelector((state) => state.user)
	const navigate = useNavigate()
	const redirectHandler = (path, optionalArguments) => {
		navigate(path, optionalArguments)
	}
	const startDate = new Date(data.listing_duration_from_date)
	const endDate = new Date(data.listing_duration_to_date)
	const diffTime = Math.abs(startDate - endDate) //in milliseconds
	const listingDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	const partnerData = type === 'doctor' ? data.doctor : data.partner
	return (
		<Box sx={{ paddingX: matches ? 5 : 2, paddingY: 2, border: '1px solid #1976D2', borderRadius: '4px' }}>
			<Grid container spacing={2}>
				{/* Personal Information */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6">Personal Information</Typography>
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
							{/* Doctor Name */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Name :</TableCell>
								<TableCell>{partnerData.name ? partnerData.name : '-----'}</TableCell>
							</TableRow>
							{/* Doctor Gender */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Phone :</TableCell>
								<TableCell>
									{partnerData.phone
										? user.isAuditor
											? `${partnerData.phone.slice(0, 3)}*******`
											: partnerData.phone
										: '-----'}
								</TableCell>
							</TableRow>
							{/* Specialization */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Specialization :</TableCell>
								<TableCell>{data.specialization?.name ? data.specialization.name : '-----'}</TableCell>
							</TableRow>
							{/* Doctor Email */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Email :</TableCell>
								<TableCell>
									{partnerData.email
										? user.isAuditor
											? `${partnerData.email.slice(0, 3)}*******`
											: partnerData.email
										: '-----'}
								</TableCell>
							</TableRow>
							{/* Doctor State */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>State :</TableCell>
								<TableCell>{data.state?.name ? data.state.name : '-----'}</TableCell>
							</TableRow>
							{/* Doctor City */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>City :</TableCell>
								<TableCell>{data.city?.name ? data.city.name : '-----'}</TableCell>
							</TableRow>
							{/* Doctor ID */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Doctor Profile ID :</TableCell>
								<TableCell>{data.doctor_profile_id ? data.doctor_profile_id : '-----'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				{/* Business Data */}
				<Grid item xs={12} md={6}>
					<Typography variant="h6">Business Data</Typography>
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
							{/* Amount */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Amount :</TableCell>
								<TableCell>{data.amount ? `₹ ${data.amount}` : '----'}</TableCell>
							</TableRow>
							{/* Start Date */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>From :</TableCell>
								<TableCell>{data.listing_duration_from_date || '----'}</TableCell>
							</TableRow>
							{/* End Date */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>To:</TableCell>
								<TableCell>{data.listing_duration_to_date || '----'}</TableCell>
							</TableRow>
							{/* Listing Duration */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Listing Duration:</TableCell>
								<TableCell>{listingDuration} Days</TableCell>
							</TableRow>
							{/* Link Exchange */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Link Exchange:</TableCell>
								<TableCell>
									{data.link_exchange ? (
										<span style={{ color: 'green', fontWeight: 510 }}>Yes</span>
									) : (
										<span style={{ color: 'red', fontWeight: 510 }}>No</span>
									)}
								</TableCell>
							</TableRow>
							{/* Backlink */}
							{data.link_exchange ? (
								<TableRow>
									<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Backlink:</TableCell>
									<TableCell>
										<a href={data.back_link}>{data.back_link}</a>
									</TableCell>
								</TableRow>
							) : (
								''
							)}
							{/* Widget */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Widget:</TableCell>
								<TableCell>
									{data.iframe ? (
										<span style={{ color: 'green', fontWeight: 510 }}>Yes</span>
									) : (
										<span style={{ color: 'red', fontWeight: 510 }}>No</span>
									)}
								</TableCell>
							</TableRow>
							{/* Source */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Source:</TableCell>
								<TableCell>{data.additional_information.source}</TableCell>
							</TableRow>
							{/* Pages Sold */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Pages Sold ({data.pages_sold?.length || 0}) :</TableCell>
								<TableCell>
									{data.pages_sold?.map((page) => {
										return <p key={page.url}>{page.url}</p>
									})}
								</TableCell>
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
							{/* Status */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Status :</TableCell>
								<TableCell>
									{data.additional_information.status?.current_status
										? data.additional_information.status?.current_status
										: '-----'}
								</TableCell>
							</TableRow>
							{/* Updated At */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Updated At:</TableCell>
								<TableCell>
									{data.additional_information.updated_at ? data.additional_information.updated_at : '-----'}
								</TableCell>
							</TableRow>
							{/* Created At */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Created At:</TableCell>
								<TableCell>
									{data.additional_information.created_at ? data.additional_information.created_at : '-----'}
								</TableCell>
							</TableRow>
							{/* Doctor Message */}
							<TableRow>
								<TableCell sx={{ width: '45%', color: '#3F3F3F' }}>Message :</TableCell>
								<TableCell>{data.additional_information.message ? data.additional_information.message : '-----'}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		</Box>
	)
}

/*eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import {
	Container,
	Paper,
	Grid,
	Button,
	Box,
	Typography,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	FormControl,
	Radio,
	Divider,
	FormGroup,
	Checkbox,
	Link,
} from '@mui/material'
import axios from '../../../../shared/axios'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from 'react-toastify'
import { DisabledByDefault, FlashOnRounded } from '@mui/icons-material'
import { useSelector } from 'react-redux'

function EditPermissions(props) {
	let memberData = props.member_data
	const INITIAL_STATE = {
		...memberData.permissionsObj,
	}
	const memberId = props.member_id
	const [isAdmin, setIsAdmin] = useState(memberData.is_admin)
	const [isAuditor, setIsAuditor] = useState(memberData.is_auditor)
	const [isClient, setClient] = useState(memberData.type?.is_client || null)
	const [isPartner, setPartner] = useState(memberData.type?.is_partner || null)
	const [isMt, setMt] = useState(memberData.type?.is_mt || null)
	const [permissions, setPermissions] = useState(INITIAL_STATE)
	const PartnerClientMt = isClient ? 'Client' : isPartner ? 'Partner' : isMt ? 'MT' : ''
	const permissionCount = () => {
		let i = 0
		for (var key in permissions) {
			if (permissions[key]) {
				i++
			}
		}
		return i++
	}

	// const handleIsOthers = () => {
	// 	for (var key in permissions) {
	// 		permissions[key] = false
	// 	}
	// }

	const handleSave = () => {
		const payload = {
			status: {
				is_admin: isAdmin,
				is_auditor: isAuditor,
			},
			type: {
				is_client: isClient,
				is_partner: isPartner,
				is_mt: isMt,
			},
			permissions: {
				...permissions,
			},
		}
		if (isClient || isPartner) {
			if (isClient) {
				payload.permissions['approve_lead'] = false
				payload.permissions['transfer_lead'] = false
				payload.permissions['share_lead'] = false
			}
			payload.permissions['doctor_activity_dashboard'] = false
		}
		axios
			.post(`/sales/employee/${memberId}/permissions`, payload)
			.then((res) => {
				if (res?.status === 200) {
					toast.success('User needs to login again to set the permissions', {
						position: 'bottom-left',
					})
				}
			})
			.catch((error) => {
				toast.error(error.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}

	const setPermission = (key, value, alterKey) => {
		const perm = {
			...permissions,
		}
		perm[key] = value
		if (alterKey) {
			perm[alterKey] = value
		}

		setPermissions(perm)
	}

	const handleSelectAll = () => {
		const perms = {
			...permissions,
		}
		const partnerType = isClient ? 'client' : isPartner ? 'partner' : isMt ? 'mt' : ''
		for (var key in perms) {
			if (partnerType === 'client' || partnerType === 'partner') {
				if (
					key === 'add_lead' ||
					key === 'view_partner' ||
					key === 'edit_partner' ||
					key === 'view_partner_followup' ||
					key === 'add_partner_followup' ||
					key === 'add_partner_remark' ||
					key === 'get_partner_recent_activity' ||
					key === 'get_partner_leads_csv' ||
					key === 'view_lead' ||
					key === 'edit_lead' ||
					key === 'video_call_logs' ||
					key === 'view_lead_followup' ||
					key === 'add_lead_followup' ||
					key === 'add_lead_remark' ||
					key === 'get_lead_recent_activity' ||
					key === 'get_lead_lead_csv' ||
					key === 'admin_dashboard_access' ||
					key === 'lead_update_module_access' ||
					key === 'get_partner_leads_csv' ||
					key === 'arrival_sheet_access' ||
					key === 'upload_lead_csv'
				) {
					perms[key] = true
				}
			}
			if (partnerType === 'mt') {
				if (
					key === 'add_lead' ||
					key === 'view_partner' ||
					key === 'edit_partner' ||
					key === 'view_partner_followup' ||
					key === 'add_partner_followup' ||
					key === 'add_partner_remark' ||
					key === 'get_partner_recent_activity' ||
					key === 'get_partner_leads_csv' ||
					key === 'view_lead' ||
					key === 'edit_lead' ||
					key === 'view_lead_followup' ||
					key === 'add_lead_followup' ||
					key === 'video_call_logs' ||
					key === 'add_lead_remark' ||
					key === 'get_lead_recent_activity' ||
					key === 'get_lead_lead_csv' ||
					key === 'transfer_lead' ||
					key === 'share_lead' ||
					key === 'allocate_or_assign_lead' ||
					key === 'approve_lead' ||
					key === 'get_partner_leads_csv' ||
					key === 'admin_dashboard_access' ||
					key === 'lead_update_module_access' ||
					key === 'arrival_sheet_access' ||
					key === 'upload_lead_csv' ||
					key === 'view_doctor' ||
					key === 'edit_doctor' ||
					key === 'add_doctor' ||
					key === 'view_doctor_followup' ||
					key === 'add_doctor_followup' ||
					key === 'add_doctor_remark' ||
					key === 'get_doctor_recent_activity' ||
					key === 'get_doctor_leads_csv' ||
					key === 'doctor_activity_dashboard'
				) {
					perms[key] = true
				}
			}
		}
		setPermissions(perms)
	}

	const handleClearAll = () => {
		const perms = {
			...permissions,
		}
		for (var key in perms) {
			perms[key] = false
		}
		setPermissions(perms)
	}

	// useEffect(()=>{

	// })

	return (
		<>
			<Box my={4} sx={{ mx: '132px', width: 'full' }}>
				<Typography variant="h4" sx={{ mx: '15px', my: '2px', mt: '60px' }}>
					Permissions
				</Typography>
				<Divider
					sx={{
						borderBottomWidth: 5,
						borderColor: '#0089D6',
						width: '50px',
						mb: '10px',
						mx: '15px',
					}}
				/>
				<Box width={200} gap={4} p={2} sx={{ width: 'full' }}>
					<Box>
						<FormControl>
							<FormLabel id="user-type-radio-buttons-group-label">
								<Typography variant="h5">User:</Typography>
							</FormLabel>
							<RadioGroup aria-labelledby="user-type-radio-buttons-group-label" name="radio-buttons-group">
								<FormControlLabel
									value="admin"
									control={
										<Radio
											checked={isAdmin}
											onChange={() => {
												setIsAdmin(true)
												setIsAuditor(false)
												setClient(false)
												setPartner(false)
												setMt(false)
											}}
										/>
									}
									label="Admin"
								/>
								<FormControlLabel
									value="auditor"
									checked={isAuditor}
									control={
										<Radio
											checked={isAuditor}
											onChange={() => {
												setIsAuditor(true)
												setIsAdmin(false)
												setClient(false)
												setPartner(false)
												setMt(false)
											}}
										/>
									}
									label="Auditor"
								/>
								<Box sx={{ display: 'flex' }}>
									<Typography variant="h6" sx={{ mt: '4px', mr: '10px' }}>
										Others:
									</Typography>
									<FormControlLabel
										value="client"
										checked={isClient}
										control={
											<Radio
												checked={isClient}
												onChange={() => {
													setIsAuditor(false)
													setIsAdmin(false)
													setClient(true)
													setPartner(false)
													setMt(false)
												}}
											/>
										}
										label="Client"
									/>
									<FormControlLabel
										value="partner"
										checked={isPartner}
										control={
											<Radio
												checked={isPartner}
												onChange={() => {
													setIsAuditor(false)
													setIsAdmin(false)
													setClient(false)
													setPartner(true)
													setMt(false)
												}}
											/>
										}
										label="Partner"
									/>
									<FormControlLabel
										value="mt"
										checked={isMt}
										control={
											<Radio
												checked={isMt}
												onChange={() => {
													setIsAuditor(false)
													setIsAdmin(false)
													setClient(false)
													setPartner(false)
													setMt(true)
												}}
											/>
										}
										label="MT"
									/>
									{(isClient || isPartner || isMt) && (
										<>
											<Link
												component="button"
												onClick={() => {
													handleSelectAll()
												}}
												sx={{ mt: '3px', mr: '10px', cursor: 'pointer' }}>
												Select All
											</Link>
											<Link
												component="button"
												onClick={() => {
													handleClearAll()
												}}
												sx={{ mt: '3px', mr: '10px', cursor: 'pointer' }}>
												Clear All
											</Link>
										</>
									)}
								</Box>
							</RadioGroup>
						</FormControl>
					</Box>
					{(isClient || isPartner || isMt) && (
						<Box>
							<FormGroup>
								<Grid container spacing={3}>
									{/* Partner/Client/Mt Permissions */}
									<Grid item xs={12} sm={6}>
										<Paper
											style={{
												padding: '20px',
												minHeight: '200px',
												display: 'flex',
												flexDirection: 'column',
												height: '100%',
											}}>
											<Typography variant="h5" gutterBottom>
												{PartnerClientMt}
											</Typography>
											<Divider
												sx={{
													borderBottomWidth: 5,
													borderColor: '#0089D6',
													width: '50px',
													mb: '10px',
												}}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.add_lead}
														onChange={() => setPermission('add_lead', !permissions.add_lead, null)}
													/>
												}
												label={`add ${PartnerClientMt.toLowerCase()}`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.view_partner}
														onChange={() =>
															setPermission('view_partner', !permissions.view_partner, 'view_lead')
														}
													/>
												}
												label={`view ${PartnerClientMt.toLowerCase()}`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.edit_partner}
														onChange={() =>
															setPermission('edit_partner', !permissions.edit_partner, 'edit_lead')
														}
													/>
												}
												label={`edit ${PartnerClientMt.toLowerCase()}`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.view_partner_followup}
														onChange={() =>
															setPermission(
																'view_partner_followup',
																!permissions.view_partner_followup,
																'view_lead_followup'
															)
														}
													/>
												}
												label={`view ${PartnerClientMt.toLowerCase()} followup`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.add_partner_followup}
														onChange={() =>
															setPermission(
																'add_partner_followup',
																!permissions.add_partner_followup,
																'add_lead_followup'
															)
														}
													/>
												}
												label={`add ${PartnerClientMt.toLowerCase()} followup`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.add_partner_remark}
														onChange={() =>
															setPermission(
																'add_partner_remark',
																!permissions.add_partner_remark,
																'add_lead_remark'
															)
														}
													/>
												}
												label={`add ${PartnerClientMt.toLowerCase()} remark`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.get_partner_recent_activity}
														onChange={() =>
															setPermission(
																'get_partner_recent_activity',
																!permissions.get_partner_recent_activity,
																'get_lead_recent_activity'
															)
														}
													/>
												}
												label={`${PartnerClientMt.toLowerCase()} recent activity`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.get_partner_leads_csv}
														onChange={() =>
															setPermission(
																'get_partner_leads_csv',
																!permissions.get_partner_leads_csv,
																'get_lead_csv'
															)
														}
													/>
												}
												label={`${PartnerClientMt.toLowerCase()} lead csv`}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.video_call_logs}
														onChange={() => setPermission('video_call_logs', !permissions.video_call_logs)}
													/>
												}
												label={`${PartnerClientMt.toLowerCase()} video call logs`}
											/>
											{(PartnerClientMt === 'MT' || PartnerClientMt === 'Partner') && (
												<>
													<FormControlLabel
														control={
															<Checkbox
																checked={permissions.share_lead}
																onChange={() => setPermission('share_lead', !permissions.share_lead)}
															/>
														}
														label="share lead"
													/>
													{PartnerClientMt === 'MT' && (
														<FormControlLabel
															control={
																<Checkbox
																	checked={permissions.transfer_lead}
																	onChange={() =>
																		setPermission('transfer_lead', !permissions.transfer_lead)
																	}
																/>
															}
															label="transfer lead"
														/>
													)}
												</>
											)}
										</Paper>
									</Grid>
									{/* Doctor Permissions */}
									{PartnerClientMt === 'MT' && (
										<Grid item xs={12} sm={6}>
											<Paper
												style={{
													padding: '20px',
													minHeight: '200px',
													display: 'flex',
													flexDirection: 'column',
													height: '100%',
												}}>
												<Typography variant="h5" gutterBottom>
													Doctor
												</Typography>
												<Divider
													sx={{
														borderBottomWidth: 5,
														borderColor: '#0089D6',
														width: '50px',
														mb: '10px',
													}}
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.view_doctor}
															onChange={() => setPermission('view_doctor', !permissions.view_doctor)}
														/>
													}
													label="view doctor"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.edit_doctor}
															onChange={() => setPermission('edit_doctor', !permissions.edit_doctor)}
														/>
													}
													label="edit doctor"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.add_doctor}
															onChange={() => setPermission('add_doctor', !permissions.add_doctor)}
														/>
													}
													label="add doctor"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.view_doctor_followup}
															onChange={() =>
																setPermission('view_doctor_followup', !permissions.view_doctor_followup)
															}
														/>
													}
													label="view doctor followup"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.add_doctor_followup}
															onChange={() =>
																setPermission('add_doctor_followup', !permissions.add_doctor_followup)
															}
														/>
													}
													label="add doctor followup"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.add_doctor_remark}
															onChange={() =>
																setPermission('add_doctor_remark', !permissions.add_doctor_remark)
															}
														/>
													}
													label="add doctor remark"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.get_doctor_recent_activity}
															onChange={() =>
																setPermission(
																	'get_doctor_recent_activity',
																	!permissions.get_doctor_recent_activity
																)
															}
														/>
													}
													label="doctor recent activity"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.get_doctor_leads_csv}
															onChange={() =>
																setPermission('get_doctor_leads_csv', !permissions.get_doctor_leads_csv)
															}
														/>
													}
													label="doctor leads csv"
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.transfer_doctor_lead}
															onChange={() =>
																setPermission('transfer_doctor_lead', !permissions.transfer_doctor_lead)
															}
														/>
													}
													label="transfer lead"
												/>
											</Paper>
										</Grid>
									)}

									{/* Module Access Permissions */}
									<Grid item xs={12} sm={6}>
										<Paper
											style={{
												padding: '20px',
												minHeight: '200px',
												display: 'flex',
												flexDirection: 'column',
												height: '100%',
											}}>
											<Typography variant="h5" gutterBottom>
												Module Access
											</Typography>
											<Divider
												sx={{
													borderBottomWidth: 5,
													borderColor: '#0089D6',
													width: '50px',
													mb: '10px',
												}}
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.admin_dashboard_access}
														onChange={() =>
															setPermission('admin_dashboard_access', !permissions.admin_dashboard_access)
														}
													/>
												}
												label="dashboard access"
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.lead_update_module_access}
														onChange={() =>
															setPermission(
																'lead_update_module_access',
																!permissions.lead_update_module_access
															)
														}
													/>
												}
												label="Lead update module access"
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.arrival_sheet_access}
														onChange={() =>
															setPermission('arrival_sheet_access', !permissions.arrival_sheet_access)
														}
													/>
												}
												label="arrival sheet access"
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={permissions.upload_lead_csv}
														onChange={() => setPermission('upload_lead_csv', !permissions.upload_lead_csv)}
													/>
												}
												label="upload lead csv"
											/>
											{isMt && (
												<FormControlLabel
													control={
														<Checkbox
															checked={permissions.doctor_activity_dashboard}
															onChange={() =>
																setPermission(
																	'doctor_activity_dashboard',
																	!permissions.doctor_activity_dashboard
																)
															}
														/>
													}
													label="doctor activity dashboard"
												/>
											)}
										</Paper>
									</Grid>
								</Grid>
							</FormGroup>
						</Box>
					)}
					<Button
						sx={{ mt: '15px' }}
						variant="contained"
						disabled={(isClient || isPartner || isMt) && !permissionCount()}
						endIcon={<SaveIcon />}
						onClick={handleSave}>
						Save
					</Button>
				</Box>
			</Box>
		</>
	)
}

export default EditPermissions

/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
	name: 'user',
	initialState: {
		isAdmin: false,
		isAuditor: false,
		userId: null,
		userName: null,
		type: {
			is_client: false,
			is_mt: false,
			is_partner: false,
		},
		permissions: {
			view_doctor: false,
			edit_doctor: false,
			add_doctor: false,
			view_doctor_followup: false,
			add_doctor_followup: false,
			add_doctor_remark: false,
			get_doctor_recent_activity: false,
			get_doctor_leads_csv: false,
			view_partner: false,
			edit_partner: false,
			view_partner_followup: false,
			add_partner_followup: false,
			add_partner_remark: false,
			get_partner_recent_activity: false,
			get_partner_leads_csv: false,
			view_lead: false,
			edit_lead: false,
			add_lead: false,
			view_lead_followup: false,
			add_lead_followup: false,
			add_lead_remark: false,
			get_lead_recent_activity: false,
			share_lead: false,
			transfer_lead: false,
			allocate_or_assign_lead: false,
			approve_lead: false,
			get_lead_csv: false,
			admin_dashboard_access: false,
			lead_update_module_access: false,
			arrival_sheet_access: false,
			upload_lead_csv: false,
			video_call_logs: false,
		},
	},
	reducers: {
		setIsAdmin: (state, action) => {
			state.isAdmin = action.payload
		},
		setIsAuditor: (state, action) => {
			state.isAuditor = action.payload
		},
		setUserId: (state, action) => {
			state.userId = action.payload
		},
		setUserName: (state, action) => {
			state.userName = action.payload
		},
		setPermissions: (state, action) => {
			state.permissions = { ...action.payload }
		},
		setType: (state, action) => {
			state.type = { ...action.payload }
		},
		logout: (state) => {
			// From here we can take action only at this "counter" state
			// But, as we have taken care of this particular "logout" action
			// in rootReducer, we can use it to CLEAR the complete Redux Store's state
		},
	},
})

export const { setIsAdmin, setIsAuditor, setUserId, setUserName, reset, setPermissions, setType, logout } = slice.actions

export default slice.reducer

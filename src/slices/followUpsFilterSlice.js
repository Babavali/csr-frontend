import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	followUpsFilter: {
		followUpDateFrom: { placeholder: 'From', queryParameter: 'followup_date_from', value: null },
		followUpDateTo: { placeholder: 'To', queryParameter: 'follow_up_date_to', value: null },

		mainStatus: { placeholder: 'Status', queryParameter: 'status', value: null },
		subStatus: { placeholder: 'Sub Status', queryParameter: 'sub_status', value: null },

		enquirerName: { placeholder: 'Enquirer Name', queryParameter: 'enquirer_name', value: null },
		enquirerPhone: { placeholder: 'Enqurier Phone', queryParameter: 'enquirer_phone', value: null },

		patientCountry: { placeholder: 'Patient Country', queryParameter: 'patient_country_id', value: null, name: null },

		category: { placeholder: 'Category', queryParameter: 'category_id', value: null, name: null },
		tier: { placeholder: 'Tier', queryParameter: 'lead_tier', value: null, name: null },
		leadId: { placeholder: 'Lead ID', queryParameter: 'lead_id', value: null },
		treatmentIntensity: { placeholder: 'Treatment Intensity', queryParameter: 'treatment_intensity', value: null },
	},
}

const followUpsFilterSlice = createSlice({
	name: 'followUpsFilter',
	initialState,
	reducers: {
		setFollowUpsDateFrom: (state, action) => {
			state.followUpsFilter.followUpDateFrom = action.payload
		},
		setFollowUpsDateTo: (state, action) => {
			state.followUpsFilter.followUpDateTo = action.payload
		},
		setFollowUpsMainStatus: (state, action) => {
			state.followUpsFilter.mainStatus = action.payload
		},
		setFollowUpsSubStatus: (state, action) => {
			state.followUpsFilter.subStatus = action.payload
		},
		setFollowUpsEnquirerName: (state, action) => {
			state.followUpsFilter.enquirerName = action.payload
		},
		setFollowUpsEnquirerPhone: (state, action) => {
			state.followUpsFilter.enquirerPhone = action.payload
		},
		setFollowUpsPatientCountry: (state, action) => {
			state.followUpsFilter.patientCountry = action.payload
		},
		setFollowUpsCategory: (state, action) => {
			state.followUpsFilter.category = action.payload
		},
		setFollowUpsTier: (state, action) => {
			state.followUpsFilter.tier = action.payload
		},
		setFollowUpsLeadId: (state, action) => {
			state.followUpsFilter.leadId = action.payload
		},
		setFollowUpsLeadSource: (state, action) => {
			state.followUpsFilter.leadSource = action.payload
		},
		setFollowUpsTreatmentIntensity: (state, action) => {
			state.followUpsFilter.treatmentIntensity = action.payload
		},
		resetFollowUpsFilter: (state) => {
			Object.assign(state.followUpsFilter, initialState.followUpsFilter)
		},
	},
})

export const {
	setFollowUpsDateFrom,
	setFollowUpsDateTo,
	setFollowUpsMainStatus,
	setFollowUpsSubStatus,
	setFollowUpsEnquirerName,
	setFollowUpsEnquirerPhone,
	setFollowUpsPatientCountry,
	setFollowUpsCategory,
	setFollowUpsTier,
	setFollowUpsLeadId,
	setFollowUpsTreatmentIntensity,
	resetFollowUpsFilter,
} = followUpsFilterSlice.actions

export default followUpsFilterSlice.reducer

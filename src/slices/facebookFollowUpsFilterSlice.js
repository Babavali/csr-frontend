import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	facebookFollowUpsFilter: {
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

const facebookFollowUpsFilterSlice = createSlice({
	name: 'facebookFollowUpsFilter',
	initialState,
	reducers: {
		setFacebookFollowUpsDateFrom: (state, action) => {
			state.facebookFollowUpsFilter.followUpDateFrom = action.payload
		},
		setFacebookFollowUpsDateTo: (state, action) => {
			state.facebookFollowUpsFilter.followUpDateTo = action.payload
		},
		setFacebookFollowUpsMainStatus: (state, action) => {
			state.facebookFollowUpsFilter.mainStatus = action.payload
		},
		setFacebookFollowUpsSubStatus: (state, action) => {
			state.facebookFollowUpsFilter.subStatus = action.payload
		},
		setFacebookFollowUpsEnquirerName: (state, action) => {
			state.facebookFollowUpsFilter.enquirerName = action.payload
		},
		setFacebookFollowUpsEnquirerPhone: (state, action) => {
			state.facebookFollowUpsFilter.enquirerPhone = action.payload
		},
		setFacebookFollowUpsPatientCountry: (state, action) => {
			state.facebookFollowUpsFilter.patientCountry = action.payload
		},
		setFacebookFollowUpsCategory: (state, action) => {
			state.facebookFollowUpsFilter.category = action.payload
		},
		setFacebookFollowUpsTier: (state, action) => {
			state.facebookFollowUpsFilter.tier = action.payload
		},
		setFacebookFollowUpsLeadId: (state, action) => {
			state.facebookFollowUpsFilter.leadId = action.payload
		},
		setFacebookFollowUpsLeadSource: (state, action) => {
			state.facebookFollowUpsFilter.leadSource = action.payload
		},
		setFacebookFollowUpsTreatmentIntensity: (state, action) => {
			state.facebookFollowUpsFilter.treatmentIntensity = action.payload
		},
		resetFacebookFollowUpsFilter: (state) => {
			Object.assign(state.facebookFollowUpsFilter, initialState.facebookFollowUpsFilter)
		},
	},
})

export const {
	setFacebookFollowUpsDateFrom,
	setFacebookFollowUpsDateTo,
	setFacebookFollowUpsMainStatus,
	setFacebookFollowUpsSubStatus,
	setFacebookFollowUpsEnquirerName,
	setFacebookFollowUpsEnquirerPhone,
	setFacebookFollowUpsPatientCountry,
	setFacebookFollowUpsCategory,
	setFacebookFollowUpsTier,
	setFacebookFollowUpsLeadId,
	setFacebookFollowUpsTreatmentIntensity,
	resetFacebookFollowUpsFilter,
} = facebookFollowUpsFilterSlice.actions

export default facebookFollowUpsFilterSlice.reducer

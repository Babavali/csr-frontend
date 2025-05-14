import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	facebookLeadsFilter: {
		leadGeneratedDateFrom: { placeholder: 'From', queryParameter: 'lead_date_from', value: null },
		leadGeneratedDateTo: { placeholder: 'To', queryParameter: 'lead_date_to', value: null },

		mainStatus: { placeholder: 'Status', queryParameter: 'status', value: null },
		subStatus: { placeholder: 'Sub Status', queryParameter: 'sub_status', value: null },

		enquirerName: { placeholder: 'Enquirer Name', queryParameter: 'enquirer_name', value: null },
		enquirerPhone: { placeholder: 'Enquirer Phone', queryParameter: 'enquirer_phone', value: null },

		patientName: { placeholder: 'Patient Name', queryParameter: 'patient_name', value: null },
		patientCountry: { placeholder: 'Patient Country', queryParameter: 'patient_country_id', value: null },
		patientIsInternationalOnly: { placeholder: 'Only International Leads', queryParameter: 'only_international_leads', value: null },
		patientGender: { placeholder: 'Patient Gender', queryParameter: 'patient_gender', value: null },
		patientDob: { placeholder: 'Patient DOB', queryParameter: 'patient_birth_date', value: null },

		ppcWebsite: { placeholder: 'PPC Facility', queryParameter: 'ppc_hospital_name', value: null },
		category: { placeholder: 'Category', queryParameter: 'category', value: null, name: null },
		specialization: { placeholder: 'Specialization', queryParameter: 'specialization', value: null, name: null },
		service: { placeholder: 'Service', queryParameter: 'service', value: null, name: null },
		tier: { placeholder: 'Tier', queryParameter: 'lead_tier', value: null, name: null },
		leadId: { placeholder: 'Lead ID', queryParameter: 'lead_id', value: null },
		leadSource: { placeholder: 'Lead Source', queryParameter: 'lead_source', value: null },
		treatmentIntensity: { placeholder: 'Treatment Intensity', queryParameter: 'treatment_intensity', value: null },
	},
}

const facebookLeadsFilterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFacebookLeadsLeadGeneratedDateFrom: (state, action) => {
			state.facebookLeadsFilter.leadGeneratedDateFrom = action.payload
		},
		setFacebookLeadsLeadGeneratedDateTo: (state, action) => {
			state.facebookLeadsFilter.leadGeneratedDateTo = action.payload
		},

		setFacebookLeadsMainStatus: (state, action) => {
			state.facebookLeadsFilter.mainStatus = action.payload
		},
		setFacebookLeadsSubStatus: (state, action) => {
			state.facebookLeadsFilter.subStatus = action.payload
		},

		setFacebookLeadsEnquirerName: (state, action) => {
			state.facebookLeadsFilter.enquirerName = action.payload
		},
		setFacebookLeadsEnquirerPhone: (state, action) => {
			state.facebookLeadsFilter.enquirerPhone = action.payload
		},

		setFacebookLeadsPatientName: (state, action) => {
			state.facebookLeadsFilter.patientName = action.payload
		},

		// LeadListingsetPatientCountryName: (state, action) => {
		// 	state.facebookLeadsFilter.patientCountryName = action.payload
		// },
		setFacebookLeadsPatientCountry: (state, action) => {
			state.facebookLeadsFilter.patientCountry = action.payload
		},
		setFacebookLeadsPatientIsInternationalOnly: (state, action) => {
			state.facebookLeadsFilter.patientIsInternationalOnly = action.payload
		},
		setFacebookLeadsPatientGender: (state, action) => {
			state.facebookLeadsFilter.patientGender = action.payload
		},
		setFacebookLeadsPatientDob: (state, action) => {
			state.facebookLeadsFilter.patientDob = action.payload
		},
		setFacebookLeadsPatientState: (state, action) => {
			state.facebookLeadsFilter.patientState = action.payload
		},
		setFacebookLeadsPPCWebsite: (state, action) => {
			state.facebookLeadsFilter.ppcWebsite = action.payload
		},
		setFacebookLeadsCategory: (state, action) => {
			state.facebookLeadsFilter.category = action.payload
		},
		setFacebookLeadsSpecialization: (state, action) => {
			state.facebookLeadsFilter.specialization = action.payload
		},
		setFacebookLeadsService: (state, action) => {
			state.facebookLeadsFilter.service = action.payload
		},
		setFacebookLeadsTier: (state, action) => {
			state.facebookLeadsFilter.tier = action.payload
		},
		setFacebookLeadsLeadId: (state, action) => {
			state.facebookLeadsFilter.leadId = action.payload
		},
		setFacebookLeadsLeadSource: (state, action) => {
			state.facebookLeadsFilter.leadSource = action.payload
		},
		setFacebookLeadsTreatmentIntensity: (state, action) => {
			state.facebookLeadsFilter.treatmentIntensity = action.payload
		},
		resetFacebookLeadsFilter: (state) => {
			Object.assign(state.facebookLeadsFilter, initialState.facebookLeadsFilter)
		},
	},
})

export const {
	setFacebookLeadsLeadGeneratedDateFrom,
	setFacebookLeadsLeadGeneratedDateTo,
	setFacebookLeadsMainStatus,
	setFacebookLeadsSubStatus,
	setFacebookLeadsEnquirerName,
	setFacebookLeadsEnquirerPhone,
	setFacebookLeadsPatientName,
	setFacebookLeadsPatientCountry,
	// LeadListingsetPatientCountryName,
	setFacebookLeadsPatientIsInternationalOnly,
	setFacebookLeadsPatientGender,
	setFacebookLeadsPatientDob,
	setFacebookLeadsPatientState,
	setFacebookLeadsPPCWebsite,
	setFacebookLeadsCategory,
	setFacebookLeadsSpecialization,
	setFacebookLeadsService,
	setFacebookLeadsTier,
	setFacebookLeadsLeadId,
	setFacebookLeadsLeadSource,
	setFacebookLeadsTreatmentIntensity,
	resetFacebookLeadsFilter,
} = facebookLeadsFilterSlice.actions

export default facebookLeadsFilterSlice.reducer

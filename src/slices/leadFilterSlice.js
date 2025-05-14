import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	leadListingFilter: {
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

const leadFilterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setLeadListingLeadGeneratedDateFrom: (state, action) => {
			state.leadListingFilter.leadGeneratedDateFrom = action.payload
		},
		setLeadListingLeadGeneratedDateTo: (state, action) => {
			state.leadListingFilter.leadGeneratedDateTo = action.payload
		},

		setLeadListingMainStatus: (state, action) => {
			state.leadListingFilter.mainStatus = action.payload
		},
		setLeadListingSubStatus: (state, action) => {
			state.leadListingFilter.subStatus = action.payload
		},

		setLeadListingEnquirerName: (state, action) => {
			state.leadListingFilter.enquirerName = action.payload
		},
		setLeadListingEnquirerPhone: (state, action) => {
			state.leadListingFilter.enquirerPhone = action.payload
		},

		setLeadListingPatientName: (state, action) => {
			state.leadListingFilter.patientName = action.payload
		},
		setLeadListingPatientCountry: (state, action) => {
			state.leadListingFilter.patientCountry = action.payload
		},
		setLeadListingPatientIsInternationalOnly: (state, action) => {
			state.leadListingFilter.patientIsInternationalOnly = action.payload
		},
		setLeadListingPatientGender: (state, action) => {
			state.leadListingFilter.patientGender = action.payload
		},
		setLeadListingPatientDob: (state, action) => {
			state.leadListingFilter.patientDob = action.payload
		},
		setLeadListingPatientState: (state, action) => {
			state.leadListingFilter.patientState = action.payload
		},
		setLeadListingPPCWebsite: (state, action) => {
			state.leadListingFilter.ppcWebsite = action.payload
		},
		setLeadListingCategory: (state, action) => {
			state.leadListingFilter.category = action.payload
		},
		setLeadListingSpecialization: (state, action) => {
			state.leadListingFilter.specialization = action.payload
		},
		setLeadListingService: (state, action) => {
			state.leadListingFilter.service = action.payload
		},
		setLeadListingTier: (state, action) => {
			state.leadListingFilter.tier = action.payload
		},
		setLeadListingLeadId: (state, action) => {
			state.leadListingFilter.leadId = action.payload
		},
		setLeadListingLeadSource: (state, action) => {
			state.leadListingFilter.leadSource = action.payload
		},
		setLeadListingTreatmentIntensity: (state, action) => {
			state.leadListingFilter.treatmentIntensity = action.payload
		},
		resetLeadListingFilter: (state) => {
			Object.assign(state.leadListingFilter, initialState.leadListingFilter)
		},
	},
})

export const {
	setLeadListingLeadGeneratedDateFrom,
	setLeadListingLeadGeneratedDateTo,
	setLeadListingMainStatus,
	setLeadListingSubStatus,
	setLeadListingEnquirerName,
	setLeadListingEnquirerPhone,
	setLeadListingPatientName,
	setLeadListingPatientCountry,
	setLeadListingPatientIsInternationalOnly,
	setLeadListingPatientGender,
	setLeadListingPatientDob,
	setLeadListingPatientState,
	setLeadListingPPCWebsite,
	setLeadListingCategory,
	setLeadListingSpecialization,
	setLeadListingService,
	setLeadListingTier,
	setLeadListingLeadId,
	setLeadListingLeadSource,
	setLeadListingTreatmentIntensity,
	resetLeadListingFilter,
} = leadFilterSlice.actions

export default leadFilterSlice.reducer

/*
			
		


*/

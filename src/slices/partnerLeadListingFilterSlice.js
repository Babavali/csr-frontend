import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	partnerLeadListingFilter: {
		leadGeneratedDateFrom: { placeholder: 'From', queryParameter: 'lead_date_from', value: null },
		leadGeneratedDateTo: { placeholder: 'To', queryParameter: 'lead_date_to', value: null },
		tier: { placeholder: 'Tier', queryParameter: 'lead_tier', value: null, name: null },
		mainStatus: { placeholder: 'Status', queryParameter: 'status', value: null },
		partnerName: { placeholder: 'Name', queryParameter: 'partner_name', value: null },
		leadSource: { placeholder: 'Lead Source', queryParameter: 'lead_source', value: null, name: null },
	},
}

const partnerLeadListingFilterSlice = createSlice({
	name: 'partnerLeadListingFilter',
	initialState,
	reducers: {
		setPartnerLeadListingLeadGeneratedDateFrom: (state, action) => {
			state.partnerLeadListingFilter.leadGeneratedDateFrom = action.payload
		},
		setPartnerLeadListingLeadGeneratedDateTo: (state, action) => {
			state.partnerLeadListingFilter.leadGeneratedDateTo = action.payload
		},
		setPartnerLeadListingMainStatus: (state, action) => {
			state.partnerLeadListingFilter.mainStatus = action.payload
		},
		setPartnerLeadListingTier: (state, action) => {
			state.partnerLeadListingFilter.tier = action.payload
		},
		setPartnerLeadListingPartnerName: (state, action) => {
			state.partnerLeadListingFilter.partnerName = action.payload
		},
		setPartnerLeadListingLeadSource: (state, action) => {
			state.partnerLeadListingFilter.leadSource = action.payload
		},
		resetPartnerLeadListingFilter: (state) => {
			Object.assign(state.partnerLeadListingFilter, initialState.partnerLeadListingFilter)
		},
	},
})

export const {
	setPartnerLeadListingLeadGeneratedDateFrom,
	setPartnerLeadListingLeadGeneratedDateTo,
	setPartnerLeadListingMainStatus,
	setPartnerLeadListingTier,
	setPartnerLeadListingPartnerName,
	setPartnerLeadListingLeadSource,
	resetPartnerLeadListingFilter,
} = partnerLeadListingFilterSlice.actions

export default partnerLeadListingFilterSlice.reducer

/*
			
		


*/

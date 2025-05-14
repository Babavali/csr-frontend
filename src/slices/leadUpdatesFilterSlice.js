import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	leadUpdatesFilter: {
		leadUpdatesDateFrom: { placeholder: 'From', queryParameter: 'lead_date_from', value: null },
		leadUpdatesDateTo: { placeholder: 'To', queryParameter: 'lead_date_to', value: null },
	},
}

const leadUpdatesFilterSlice = createSlice({
	name: 'leadUpdatesFilter',
	initialState,
	reducers: {
		setLeadUpdatesDateFrom: (state, action) => {
			state.leadUpdatesFilter.leadUpdatesDateFrom = action.payload
		},
		setLeadUpdatesDateTo: (state, action) => {
			state.leadUpdatesFilter.leadUpdatesDateTo = action.payload
		},
		resetLeadUpdatesFilter: (state) => {
			Object.assign(state.leadUpdatesFilter, initialState.leadUpdatesFilter)
		},
	},
})

export const { setLeadUpdatesDateFrom, setLeadUpdatesDateTo, resetLeadUpdatesFilter } = leadUpdatesFilterSlice.actions

export default leadUpdatesFilterSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	dashboardFilter: {
		lead_date_from: null,
		lead_date_to: null,
		lead_source: null,
		treatment_country: null,
		emp_ids: null,
		only_international_leads: false,
	},
}

const dashboardFilterSlice = createSlice({
	name: 'dashboardFilterSlice',
	initialState,
	reducers: {
		setDashboardFilter: (state, action) => {
			state.dashboardFilter = action.payload
		},
		resetDashboardFilter: (state) => {
			Object.assign(state.dashboardFilter, initialState.dashboardFilter)
		},
	},
})

export const { setDashboardFilter, resetDashboardFilter } = dashboardFilterSlice.actions

export default dashboardFilterSlice.reducer

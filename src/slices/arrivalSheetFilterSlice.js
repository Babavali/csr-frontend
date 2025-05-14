import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	arrivalSheetFilter: {
		arrival_date_from: null,
		arrival_date_to: null,
		arrival_type: null,
		status: null,
		facility_id: null,
		field_person_name: null,
		lead_id: null,
		patient_country_id: null,
		patient_name: null,
		visa_expiry_date_from: null,
		visa_expiry_date_to: null,
		emp_ids: null,
		source_url: null,
		lead_date_from: null,
		lead_date_to: null,
	},
}

const arrivalSheetFilterSlice = createSlice({
	name: 'arrivalSheetFilterSlice',
	initialState,
	reducers: {
		setArrivalSheetFilter: (state, action) => {
			state.arrivalSheetFilter = action.payload
		},
		resetArrivalSheetFilter: (state) => {
			Object.assign(state.arrivalSheetFilter, initialState.arrivalSheetFilter)
		},
	},
})

export const { setArrivalSheetFilter, resetArrivalSheetFilter } = arrivalSheetFilterSlice.actions

export default arrivalSheetFilterSlice.reducer

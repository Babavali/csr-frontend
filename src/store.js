import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userDetailsSliceReducer from './slices/userDetailsSlice'
import leadFilterSliceReducer from './slices/leadFilterSlice'
import followUpsFilterSliceReducer from './slices/followUpsFilterSlice'
import leadUpdatesFilterSliceReducer from './slices/leadUpdatesFilterSlice'
import facebookLeadsFilterSliceReducer from './slices/facebookLeadsFilterSlice'
import facebookFollowUpsFilterSliceReducer from './slices/facebookFollowUpsFilterSlice'
// Business Partner
import partnerLeadListingFilterSliceReducer from './slices/partnerLeadListingFilterSlice'
// Dashboard
import dashboardFilterSliceReducer from './slices/dashboardFilterSlice'
//Arrival Sheet
import arrivalSheetFilterSliceReducer from './slices/arrivalSheetFilterSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

const persistConfig = {
	key: 'root',
	storage,
}

const combinedReducer = combineReducers({
	user: userDetailsSliceReducer,
	filterReducer: leadFilterSliceReducer,
	followUpsFilterReducer: followUpsFilterSliceReducer,
	leadUpdatesFilterReducer: leadUpdatesFilterSliceReducer,
	facebookLeadsFilterReducer: facebookLeadsFilterSliceReducer,
	facebookFollowUpsFilterReducer: facebookFollowUpsFilterSliceReducer,
	partnerLeadListingFilterReducer: partnerLeadListingFilterSliceReducer,
	dashboardFilterReducer: dashboardFilterSliceReducer,
	arrivalSheetFilterReducer: arrivalSheetFilterSliceReducer,
})

const rootReducer = (state, action) => {
	if (action.type === 'user/logout') {
		state = undefined
	}
	return combinedReducer(state, action)
}
const rootPersistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: rootPersistedReducer,
	middleware: [thunk],
})
export const persistor = persistStore(store)

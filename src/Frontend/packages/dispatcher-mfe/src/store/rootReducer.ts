import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/store/dashboardSlice';
import listingsReducer from '../features/listings/store/listingsSlice';
import bidsReducer from '../features/bids/store/bidsSlice';
import dealsReducer from '../features/deals/store/dealsSlice';

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  listings: listingsReducer,
  bids: bidsReducer,
  deals: dealsReducer,
});

export default rootReducer;

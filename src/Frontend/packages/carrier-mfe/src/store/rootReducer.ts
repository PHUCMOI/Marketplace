import { combineReducers } from '@reduxjs/toolkit';
import marketplaceReducer from '../features/marketplace/store/marketplaceSlice';
import myBidsReducer from '../features/my-bids/store/myBidsSlice';
import vehiclesReducer from '../features/fleet/store/vehiclesSlice';
import driversReducer from '../features/fleet/store/driversSlice';
import dispatchesReducer from '../features/dispatches/store/dispatchesSlice';
import dashboardReducer from '../features/dashboard/store/dashboardSlice';

const rootReducer = combineReducers({
  marketplace: marketplaceReducer,
  myBids: myBidsReducer,
  vehicles: vehiclesReducer,
  drivers: driversReducer,
  dispatches: dispatchesReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;

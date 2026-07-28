import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'On Duty';
  yearsExperience: number;
  rating: number;
}

export interface DriversState {
  drivers: Driver[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DriversState = {
  drivers: [],
  isLoading: false,
  error: null,
};

const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
    fetchDrivers(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDriversSucceeded(state, action: PayloadAction<Driver[]>) {
      state.isLoading = false;
      state.drivers = action.payload;
    },
    fetchDriversFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDrivers, fetchDriversSucceeded, fetchDriversFailed } =
  driversSlice.actions;

export default driversSlice.reducer;

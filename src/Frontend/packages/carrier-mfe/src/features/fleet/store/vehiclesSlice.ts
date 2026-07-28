import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  capacity: number;
  year: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
  lastInspection: string;
}

export interface VehiclesState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  vehicles: [],
  isLoading: false,
  error: null,
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    fetchVehicles(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchVehiclesSucceeded(state, action: PayloadAction<Vehicle[]>) {
      state.isLoading = false;
      state.vehicles = action.payload;
    },
    fetchVehiclesFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchVehicles, fetchVehiclesSucceeded, fetchVehiclesFailed } =
  vehiclesSlice.actions;

export default vehiclesSlice.reducer;

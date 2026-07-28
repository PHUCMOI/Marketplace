import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Dispatch {
  id: string;
  listingId: string;
  listingTitle: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Pending' | 'Assigned';
  driver: string;
  vehicle: string;
  estimatedDelivery: string;
  actualDelivery?: string;
}

export interface AssignDispatchPayload {
  dispatchId: string;
  vehicleId: string;
  driverId: string;
}

export interface DispatchesState {
  dispatches: Dispatch[];
  currentDispatch: Dispatch | null;
  isLoading: boolean;
  error: string | null;
  isAssigning: boolean;
  assignError: string | null;
  assignSucceeded: boolean;
}

export const initialState: DispatchesState = {
  dispatches: [],
  currentDispatch: null,
  isLoading: false,
  error: null,
  isAssigning: false,
  assignError: null,
  assignSucceeded: false,
};

const dispatchesSlice = createSlice({
  name: 'dispatches',
  initialState,
  reducers: {
    fetchDispatches(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDispatchesSucceeded(state, action: PayloadAction<Dispatch[]>) {
      state.isLoading = false;
      state.dispatches = action.payload;
    },
    fetchDispatchesFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchDispatchById(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDispatchByIdSucceeded(state, action: PayloadAction<Dispatch>) {
      state.isLoading = false;
      state.currentDispatch = action.payload;
    },
    fetchDispatchByIdFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    assignDispatch(state, _action: PayloadAction<AssignDispatchPayload>) {
      state.isAssigning = true;
      state.assignError = null;
      state.assignSucceeded = false;
    },
    assignDispatchSucceeded(state, action: PayloadAction<Dispatch>) {
      state.isAssigning = false;
      state.assignSucceeded = true;
      state.currentDispatch = action.payload;
      const index = state.dispatches.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) state.dispatches[index] = action.payload;
    },
    assignDispatchFailed(state, action: PayloadAction<string>) {
      state.isAssigning = false;
      state.assignError = action.payload;
    },
    clearAssignFeedback(state) {
      state.assignError = null;
      state.assignSucceeded = false;
    },
    clearCurrentDispatch(state) {
      state.currentDispatch = null;
    },
  },
});

export const {
  fetchDispatches,
  fetchDispatchesSucceeded,
  fetchDispatchesFailed,
  fetchDispatchById,
  fetchDispatchByIdSucceeded,
  fetchDispatchByIdFailed,
  assignDispatch,
  assignDispatchSucceeded,
  assignDispatchFailed,
  clearAssignFeedback,
  clearCurrentDispatch,
} = dispatchesSlice.actions;

export default dispatchesSlice.reducer;

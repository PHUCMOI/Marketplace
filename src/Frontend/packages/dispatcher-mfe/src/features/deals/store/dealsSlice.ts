import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Deal {
  id: string;
  listingId: string;
  listingTitle: string;
  carrierName: string;
  amount: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  startDate: string;
  estimatedDelivery: string;
  progress: number;
}

interface DealsState {
  deals: Deal[];
  currentDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  deals: [],
  currentDeal: null,
  isLoading: false,
  error: null,
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    fetchDeals(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDealsSucceeded(state, action: PayloadAction<Deal[]>) {
      state.isLoading = false;
      state.deals = action.payload;
    },
    fetchDealsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchDealById(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDealByIdSucceeded(state, action: PayloadAction<Deal>) {
      state.isLoading = false;
      state.currentDeal = action.payload;
    },
    fetchDealByIdFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCurrentDeal(state) {
      state.currentDeal = null;
    },
  },
});

export const {
  fetchDeals,
  fetchDealsSucceeded,
  fetchDealsFailed,
  fetchDealById,
  fetchDealByIdSucceeded,
  fetchDealByIdFailed,
  clearCurrentDeal,
} = dealsSlice.actions;

export default dealsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Bid {
  id: string;
  listingId: string;
  listingTitle: string;
  carrierName: string;
  amount: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  submittedAt: string;
  estimatedDelivery: string;
}

interface BidsState {
  bids: Bid[];
  currentBid: Bid | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BidsState = {
  bids: [],
  currentBid: null,
  isLoading: false,
  error: null,
};

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    fetchBids(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchBidsSucceeded(state, action: PayloadAction<Bid[]>) {
      state.isLoading = false;
      state.bids = action.payload;
    },
    fetchBidsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchBidById(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },
    fetchBidByIdSucceeded(state, action: PayloadAction<Bid>) {
      state.isLoading = false;
      state.currentBid = action.payload;
    },
    fetchBidByIdFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCurrentBid(state) {
      state.currentBid = null;
    },
  },
});

export const {
  fetchBids,
  fetchBidsSucceeded,
  fetchBidsFailed,
  fetchBidById,
  fetchBidByIdSucceeded,
  fetchBidByIdFailed,
  clearCurrentBid,
} = bidsSlice.actions;

export default bidsSlice.reducer;

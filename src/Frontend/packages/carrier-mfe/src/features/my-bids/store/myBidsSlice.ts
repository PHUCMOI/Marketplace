import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Bid {
  id: string;
  listingId: string;
  listingTitle: string;
  bidAmount: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface MyBidsState {
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MyBidsState = {
  bids: [],
  isLoading: false,
  error: null,
};

const myBidsSlice = createSlice({
  name: 'myBids',
  initialState,
  reducers: {
    fetchMyBids(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchMyBidsSucceeded(state, action: PayloadAction<Bid[]>) {
      state.isLoading = false;
      state.bids = action.payload;
    },
    fetchMyBidsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMyBids, fetchMyBidsSucceeded, fetchMyBidsFailed } = myBidsSlice.actions;

export default myBidsSlice.reducer;

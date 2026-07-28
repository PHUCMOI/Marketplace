import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Listing {
  id: string;
  title: string;
  origin: string;
  destination: string;
  weight: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  bidCount: number;
}

interface ListingsState {
  listings: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  listings: [],
  currentListing: null,
  isLoading: false,
  error: null,
};

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    fetchListings(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchListingsSucceeded(state, action: PayloadAction<Listing[]>) {
      state.isLoading = false;
      state.listings = action.payload;
    },
    fetchListingsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchListingById(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },
    fetchListingByIdSucceeded(state, action: PayloadAction<Listing>) {
      state.isLoading = false;
      state.currentListing = action.payload;
    },
    fetchListingByIdFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCurrentListing(state) {
      state.currentListing = null;
    },
  },
});

export const {
  fetchListings,
  fetchListingsSucceeded,
  fetchListingsFailed,
  fetchListingById,
  fetchListingByIdSucceeded,
  fetchListingByIdFailed,
  clearCurrentListing,
} = listingsSlice.actions;

export default listingsSlice.reducer;

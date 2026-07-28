import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Listing {
  id: string;
  title: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  weight: number;
  rate: number;
  currency: string;
  status: string;
}

export interface PlaceBidPayload {
  listingId: string;
  proposedPriceAmount: number;
  proposedPriceCurrency: string;
  message?: string;
}

export interface MarketplaceState {
  availableListings: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  isSubmittingBid: boolean;
  bidError: string | null;
  submittedBidId: string | null;
}

const initialState: MarketplaceState = {
  availableListings: [],
  currentListing: null,
  isLoading: false,
  error: null,
  isSubmittingBid: false,
  bidError: null,
  submittedBidId: null,
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    fetchAvailableListings(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchAvailableListingsSucceeded(state, action: PayloadAction<Listing[]>) {
      state.isLoading = false;
      state.availableListings = action.payload;
    },
    fetchAvailableListingsFailed(state, action: PayloadAction<string>) {
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
    placeBid(state, _action: PayloadAction<PlaceBidPayload>) {
      state.isSubmittingBid = true;
      state.bidError = null;
      state.submittedBidId = null;
    },
    placeBidSucceeded(state, action: PayloadAction<string>) {
      state.isSubmittingBid = false;
      state.submittedBidId = action.payload;
    },
    placeBidFailed(state, action: PayloadAction<string>) {
      state.isSubmittingBid = false;
      state.bidError = action.payload;
    },
    clearBidFeedback(state) {
      state.bidError = null;
      state.submittedBidId = null;
    },
    clearCurrentListing(state) {
      state.currentListing = null;
    },
  },
});

export const {
  fetchAvailableListings,
  fetchAvailableListingsSucceeded,
  fetchAvailableListingsFailed,
  fetchListingById,
  fetchListingByIdSucceeded,
  fetchListingByIdFailed,
  placeBid,
  placeBidSucceeded,
  placeBidFailed,
  clearBidFeedback,
  clearCurrentListing,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

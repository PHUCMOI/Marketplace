import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardStats {
  availableLoads: number;
  activeBids: number;
  activeDispatches: number;
  totalRevenue: number;
}

export interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStats(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDashboardStatsSucceeded(state, action: PayloadAction<DashboardStats>) {
      state.isLoading = false;
      state.stats = action.payload;
    },
    fetchDashboardStatsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDashboardStats,
  fetchDashboardStatsSucceeded,
  fetchDashboardStatsFailed,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

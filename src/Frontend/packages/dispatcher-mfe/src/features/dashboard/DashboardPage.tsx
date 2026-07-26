import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDashboardStats } from './store/dashboardSlice';
import StatsCard from './components/StatsCard';
import RecentActivity from './components/RecentActivity';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dispatcher Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Listings"
            value={stats?.activeListings || 0}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Bids"
            value={stats?.pendingBids || 0}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Deals"
            value={stats?.activeDeals || 0}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed Today"
            value={stats?.completedToday || 0}
            color="info"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <RecentActivity />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
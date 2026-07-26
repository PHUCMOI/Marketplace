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
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Carrier Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Available Loads"
            value={stats?.availableLoads || 0}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Bids"
            value={stats?.activeBids || 0}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Dispatches"
            value={stats?.activeDispatches || 0}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue || 0}`}
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

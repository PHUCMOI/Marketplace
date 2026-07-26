import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDashboardStats } from './store/dashboardSlice';
import StatsCard from './components/StatsCard';
import RecentActivity from './components/RecentActivity';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, isLoading } = useAppSelector((state) => state.dashboard);
  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);
  if (isLoading) return <Paper className="mfe-loading"><span className="loading-pulse"/><Typography>Loading dispatch center...</Typography></Paper>;

  return <Box className="mfe-page">
    <Box className="mfe-page-header"><Box><Typography className="mfe-eyebrow">Dispatch center</Typography><Typography variant="h4">Network control</Typography><Typography color="text.secondary">Review supply, resolve exceptions and keep load assignments moving.</Typography></Box><Button variant="contained" color="secondary" onClick={() => navigate('/dispatcher/listings/new')}>+ Create listing</Button></Box>
    <Paper className="mfe-status-strip"><Box><span>Dispatch network</span><strong><i/> Operations normal</strong></Box><Box><span>Review queue</span><strong>{stats?.pendingBids || 0} bids awaiting decision</strong></Box><Button onClick={() => navigate('/dispatcher/bids')}>Open bid review →</Button></Paper>
    <Grid container spacing={2}><Grid item xs={12} sm={6} lg={3}><StatsCard title="Active listings" value={stats?.activeListings || 0} color="primary" /></Grid><Grid item xs={12} sm={6} lg={3}><StatsCard title="Pending bids" value={stats?.pendingBids || 0} color="warning" /></Grid><Grid item xs={12} sm={6} lg={3}><StatsCard title="Active deals" value={stats?.activeDeals || 0} color="success" /></Grid><Grid item xs={12} sm={6} lg={3}><StatsCard title="Completed today" value={stats?.completedToday || 0} color="info" /></Grid><Grid item xs={12}><Paper className="activity-panel"><RecentActivity /></Paper></Grid></Grid>
  </Box>;
};
export default DashboardPage;

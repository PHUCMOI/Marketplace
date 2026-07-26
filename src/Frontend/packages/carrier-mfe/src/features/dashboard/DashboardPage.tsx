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
  if (isLoading) return <Paper className="mfe-loading"><span className="loading-pulse"/><Typography>Loading carrier operations...</Typography></Paper>;

  return <Box className="mfe-page">
    <Box className="mfe-page-header"><Box><Typography className="mfe-eyebrow">Carrier workspace</Typography><Typography variant="h4">Operations overview</Typography><Typography color="text.secondary">Keep trucks utilized and every active dispatch visible.</Typography></Box><Button variant="contained" color="secondary" onClick={() => navigate('/carrier/marketplace')}>Search load board</Button></Box>
    <Paper className="mfe-status-strip"><Box><span>Carrier status</span><strong><i/> Available for dispatch</strong></Box><Box><span>Priority</span><strong>{stats?.activeBids ? 'Follow up active bids' : 'Find a profitable lane'}</strong></Box><Button onClick={() => navigate('/carrier/dispatches')}>View dispatches →</Button></Paper>
    <Grid container spacing={2}><Grid item xs={12} sm={6} lg={3}><StatsCard title="Available loads" value={stats?.availableLoads || 0} color="primary" /></Grid><Grid item xs={12} sm={6} lg={3}><StatsCard title="Active bids" value={stats?.activeBids || 0} color="warning" /></Grid><Grid item xs={12} sm={6} lg={3}><StatsCard title="Active dispatches" value={stats?.activeDispatches || 0} color="success" /></Grid><Grid item xs={12} sm={6} lg={3}><StatsCard title="Total revenue" value={`${Number(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`} color="info" /></Grid><Grid item xs={12}><Paper className="activity-panel"><RecentActivity /></Paper></Grid></Grid>
  </Box>;
};
export default DashboardPage;

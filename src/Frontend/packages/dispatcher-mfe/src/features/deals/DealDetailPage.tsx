import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Divider, Chip, LinearProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrackingIcon from '@mui/icons-material/LocalShipping';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDealById } from './store/dealsSlice';

const DealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDeal, isLoading } = useAppSelector((state) => state.deals);

  useEffect(() => {
    if (id) {
      dispatch(fetchDealById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return <Typography>Loading deal details...</Typography>;
  }

  if (!currentDeal) {
    return <Typography>Deal not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dispatcher/deals')}
        sx={{ mb: 2 }}
      >
        Back to Deals
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h4">{currentDeal.listingTitle}</Typography>
          <Chip
            label={currentDeal.status}
            color={currentDeal.status === 'Active' ? 'success' : currentDeal.status === 'Completed' ? 'info' : 'error'}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Deal Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Deal ID
              </Typography>
              <Typography variant="body1">{currentDeal.id}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Listing ID
              </Typography>
              <Typography variant="body1">{currentDeal.listingId}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Carrier Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Carrier Name
              </Typography>
              <Typography variant="body1">{currentDeal.carrierName}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Deal Amount
              </Typography>
              <Typography variant="h6" sx={{ color: '#4caf50' }}>
                ${currentDeal.amount.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Delivery Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Progress</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {currentDeal.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={currentDeal.progress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Start Date
              </Typography>
              <Typography variant="body1">{currentDeal.startDate}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Estimated Delivery
              </Typography>
              <Typography variant="body1">{currentDeal.estimatedDelivery}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Status Summary
            </Typography>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                This deal is currently <strong>{currentDeal.status.toLowerCase()}</strong> and is{' '}
                <strong>{currentDeal.progress}%</strong> complete.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<TrackingIcon />}
          >
            Track Shipment
          </Button>
          <Button variant="outlined">Contact Carrier</Button>
          <Button variant="outlined" color="error">Cancel Deal</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DealDetailPage;

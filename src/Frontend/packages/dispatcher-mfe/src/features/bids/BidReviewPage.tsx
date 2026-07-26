import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchBidById } from './store/bidsSlice';

const BidReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentBid, isLoading } = useAppSelector((state) => state.bids);

  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return <Typography>Loading bid details...</Typography>;
  }

  if (!currentBid) {
    return <Typography>Bid not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dispatcher/bids')}
        sx={{ mb: 2 }}
      >
        Back to Bids
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h4">Bid Review</Typography>
          <Chip
            label={currentBid.status}
            color={currentBid.status === 'Pending' ? 'warning' : currentBid.status === 'Accepted' ? 'success' : 'error'}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Listing Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Listing Title
              </Typography>
              <Typography variant="body1">{currentBid.listingTitle}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Listing ID
              </Typography>
              <Typography variant="body1">{currentBid.listingId}</Typography>
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
              <Typography variant="body1">{currentBid.carrierName}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Bid Amount
              </Typography>
              <Typography variant="h6" sx={{ color: '#4caf50' }}>
                ${currentBid.amount.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Estimated Delivery
              </Typography>
              <Typography variant="body1">{currentBid.estimatedDelivery}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Submission Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Submitted Date
              </Typography>
              <Typography variant="body1">{currentBid.submittedAt}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
          >
            Accept Bid
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
          >
            Reject Bid
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BidReviewPage;

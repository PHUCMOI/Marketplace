import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchListingById } from './store/marketplaceSlice';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentListing, isLoading } = useAppSelector((state) => state.marketplace);

  useEffect(() => {
    if (id) {
      dispatch(fetchListingById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return <Typography>Loading listing details...</Typography>;
  }

  if (!currentListing) {
    return <Typography>Listing not found</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/carrier/marketplace')}
        sx={{ mb: 2 }}
      >
        Back to Marketplace
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentListing.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Route Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Origin
              </Typography>
              <Typography variant="body1">{currentListing.origin}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Destination
              </Typography>
              <Typography variant="body1">{currentListing.destination}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Dates & Rates
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Pickup Date
              </Typography>
              <Typography variant="body1">{currentListing.pickupDate}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Delivery Date
              </Typography>
              <Typography variant="body1">{currentListing.deliveryDate}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Cargo Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Weight
              </Typography>
              <Typography variant="body1">{currentListing.weight} lbs</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Rate
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                ${currentListing.rate}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" size="large">
            Place Bid
          </Button>
          <Button variant="outlined" size="large">
            Contact Dispatcher
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ListingDetailPage;

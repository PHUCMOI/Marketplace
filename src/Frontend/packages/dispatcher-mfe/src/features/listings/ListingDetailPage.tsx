import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchListingById } from './store/listingsSlice';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentListing, isLoading } = useAppSelector((state) => state.listings);

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
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dispatcher/listings')}
        sx={{ mb: 2 }}
      >
        Back to Listings
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h4">{currentListing.title}</Typography>
          <Chip
            label={currentListing.status}
            color={currentListing.status === 'Active' ? 'success' : 'default'}
          />
        </Box>

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
              Shipment Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Weight
              </Typography>
              <Typography variant="body1">{currentListing.weight} kg</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Created Date
              </Typography>
              <Typography variant="body1">{currentListing.createdAt}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Bids Received
            </Typography>
            <Typography variant="body1" sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              {currentListing.bidCount} bid(s) received
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained">View Bids</Button>
          <Button variant="outlined">Edit Listing</Button>
          <Button variant="outlined" color="error">Close Listing</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ListingDetailPage;

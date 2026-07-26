import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchAvailableListings } from './store/marketplaceSlice';
import AvailableListingCard from './components/AvailableListingCard';

const MarketplacePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availableListings, isLoading } = useAppSelector((state) => state.marketplace);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    dispatch(fetchAvailableListings());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading available loads...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Available Loads</Typography>
        <Button variant="outlined" onClick={() => setShowMap(!showMap)}>
          {showMap ? 'List View' : 'Map View'}
        </Button>
      </Box>

      {showMap ? (
        <Box sx={{ height: '500px', bgcolor: '#f0f0f0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Map View Coming Soon</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {availableListings.map((listing) => (
            <Grid item xs={12} md={6} lg={4} key={listing.id}>
              <AvailableListingCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MarketplacePage;

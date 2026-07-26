import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchMyBids } from './store/myBidsSlice';
import MyBidCard from './components/MyBidCard';

const MyBidsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bids, isLoading } = useAppSelector((state) => state.myBids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading your bids...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Bids
      </Typography>

      {bids.length === 0 ? (
        <Typography color="textSecondary">
          You haven't placed any bids yet. Visit the marketplace to find available loads.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bids.map((bid) => (
            <Grid item xs={12} md={6} lg={4} key={bid.id}>
              <MyBidCard bid={bid} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyBidsPage;

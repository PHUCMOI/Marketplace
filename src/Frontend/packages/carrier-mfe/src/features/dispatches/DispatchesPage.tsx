import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDispatches } from './store/dispatchesSlice';
import DispatchCard from './components/DispatchCard';

const DispatchesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dispatches, isLoading } = useAppSelector((state) => state.dispatches);

  useEffect(() => {
    dispatch(fetchDispatches());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading dispatches...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Active Dispatches
      </Typography>

      {dispatches.length === 0 ? (
        <Typography color="textSecondary">
          No active dispatches. Check back soon for new loads.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {dispatches.map((dispatch) => (
            <Grid item xs={12} md={6} lg={4} key={dispatch.id}>
              <DispatchCard dispatch={dispatch} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DispatchesPage;

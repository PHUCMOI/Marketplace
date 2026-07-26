import React, { useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDrivers } from './store/driversSlice';
import DriverCard from './components/DriverCard';

const DriversPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { drivers, isLoading } = useAppSelector((state) => state.drivers);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading drivers...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Fleet Drivers</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Driver
        </Button>
      </Box>

      {drivers.length === 0 ? (
        <Typography color="textSecondary">
          No drivers in your fleet. Add a driver to get started.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {drivers.map((driver) => (
            <Grid item xs={12} md={6} lg={4} key={driver.id}>
              <DriverCard driver={driver} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DriversPage;

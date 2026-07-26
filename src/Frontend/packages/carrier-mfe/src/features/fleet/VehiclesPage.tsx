import React, { useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchVehicles } from './store/vehiclesSlice';
import VehicleCard from './components/VehicleCard';

const VehiclesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, isLoading } = useAppSelector((state) => state.vehicles);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading vehicles...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Fleet Vehicles</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Vehicle
        </Button>
      </Box>

      {vehicles.length === 0 ? (
        <Typography color="textSecondary">
          No vehicles in your fleet. Add a vehicle to get started.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} md={6} lg={4} key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default VehiclesPage;

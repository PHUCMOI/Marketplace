import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { Vehicle } from '../store/vehiclesSlice';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Maintenance':
        return 'warning';
      case 'Inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {vehicle.licensePlate}
          </Typography>
          <Chip label={vehicle.status} color={getStatusColor(vehicle.status)} size="small" />
        </Box>

        <Typography color="textSecondary" gutterBottom>
          {vehicle.type}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Capacity
          </Typography>
          <Typography variant="body1">{vehicle.capacity.toLocaleString()} lbs</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Year
            </Typography>
            <Typography variant="body2">{vehicle.year}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Last Inspection
            </Typography>
            <Typography variant="body2">{vehicle.lastInspection}</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small">View Details</Button>
      </CardActions>
    </Card>
  );
};

export default VehicleCard;

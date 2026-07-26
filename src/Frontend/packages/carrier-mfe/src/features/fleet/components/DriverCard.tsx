import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Rating } from '@mui/material';
import { Driver } from '../store/driversSlice';

interface DriverCardProps {
  driver: Driver;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
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
            {driver.name}
          </Typography>
          <Chip label={driver.status} color={getStatusColor(driver.status)} size="small" />
        </Box>

        <Typography color="textSecondary" gutterBottom>
          License: {driver.licenseNumber}
        </Typography>

        <Typography color="textSecondary" gutterBottom>
          Phone: {driver.phone}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Rating
          </Typography>
          <Rating value={driver.rating} readOnly precision={0.1} />
          <Typography variant="caption" color="textSecondary">
            {driver.rating}/5.0
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Experience
          </Typography>
          <Typography variant="body1">{driver.yearsExperience} years</Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small">View Details</Button>
      </CardActions>
    </Card>
  );
};

export default DriverCard;

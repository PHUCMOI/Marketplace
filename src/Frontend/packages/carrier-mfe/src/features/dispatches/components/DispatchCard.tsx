import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Dispatch } from '../store/dispatchesSlice';

interface DispatchCardProps {
  dispatch: Dispatch;
}

const DispatchCard: React.FC<DispatchCardProps> = ({ dispatch }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'In Transit':
        return 'info';
      case 'Delayed':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'Pending':
        return 25;
      case 'In Transit':
        return 75;
      case 'Delivered':
        return 100;
      case 'Delayed':
        return 50;
      default:
        return 0;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {dispatch.listingTitle}
          </Typography>
          <Chip label={dispatch.status} color={getStatusColor(dispatch.status)} size="small" />
        </Box>

        <Typography color="textSecondary" gutterBottom>
          {dispatch.origin} → {dispatch.destination}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Progress
          </Typography>
          <LinearProgress variant="determinate" value={getProgressValue(dispatch.status)} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Driver
            </Typography>
            <Typography variant="body2">{dispatch.driver}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Vehicle
            </Typography>
            <Typography variant="body2">{dispatch.vehicle}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Est. Delivery
          </Typography>
          <Typography variant="body2">{dispatch.estimatedDelivery}</Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => navigate(`/carrier/dispatches/${dispatch.id}`)}>
          View Details
        </Button>
        <Button size="small">Track</Button>
      </CardActions>
    </Card>
  );
};

export default DispatchCard;

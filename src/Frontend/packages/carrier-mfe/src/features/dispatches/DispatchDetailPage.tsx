import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Divider, Stepper, Step, StepLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDispatchById } from './store/dispatchesSlice';

const DispatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDispatch, isLoading } = useAppSelector((state) => state.dispatches);

  useEffect(() => {
    if (id) {
      dispatch(fetchDispatchById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return <Typography>Loading dispatch details...</Typography>;
  }

  if (!currentDispatch) {
    return <Typography>Dispatch not found</Typography>;
  }

  const steps = ['Pending', 'In Transit', 'Delivered'];
  const currentStep = steps.indexOf(currentDispatch.status);

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/carrier/dispatches')}
        sx={{ mb: 2 }}
      >
        Back to Dispatches
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentDispatch.listingTitle}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Shipment Progress
        </Typography>
        <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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
              <Typography variant="body1">{currentDispatch.origin}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Destination
              </Typography>
              <Typography variant="body1">{currentDispatch.destination}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Assignment Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Driver
              </Typography>
              <Typography variant="body1">{currentDispatch.driver}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Vehicle
              </Typography>
              <Typography variant="body1">{currentDispatch.vehicle}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Delivery Timeline
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Estimated Delivery
              </Typography>
              <Typography variant="body1">{currentDispatch.estimatedDelivery}</Typography>
            </Box>
            {currentDispatch.actualDelivery && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Actual Delivery
                </Typography>
                <Typography variant="body1">{currentDispatch.actualDelivery}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained">Track Live</Button>
          <Button variant="outlined">Contact Driver</Button>
          <Button variant="outlined">Download Documents</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DispatchDetailPage;

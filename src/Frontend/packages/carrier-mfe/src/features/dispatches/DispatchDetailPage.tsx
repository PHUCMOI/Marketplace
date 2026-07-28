import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  assignDispatch,
  clearAssignFeedback,
  fetchDispatchById,
} from './store/dispatchesSlice';
import { fetchDrivers } from '../fleet/store/driversSlice';
import { fetchVehicles } from '../fleet/store/vehiclesSlice';

const DispatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentDispatch,
    isLoading,
    error,
    isAssigning,
    assignError,
    assignSucceeded,
  } = useAppSelector((state) => state.dispatches);
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const drivers = useAppSelector((state) => state.drivers.drivers);
  const [showAssignment, setShowAssignment] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');

  useEffect(() => {
    if (id) dispatch(fetchDispatchById(id));
    dispatch(fetchVehicles());
    dispatch(fetchDrivers());

    return () => {
      dispatch(clearAssignFeedback());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (assignSucceeded) setShowAssignment(false);
  }, [assignSucceeded]);

  const availableVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === 'Active'),
    [vehicles],
  );
  const availableDrivers = useMemo(
    () => drivers.filter((driver) => driver.status === 'Active'),
    [drivers],
  );

  const submitAssignment = (event: FormEvent) => {
    event.preventDefault();
    if (!id || !vehicleId || !driverId) return;
    dispatch(assignDispatch({ dispatchId: id, vehicleId, driverId }));
  };

  if (isLoading) {
    return (
      <Paper className="mfe-loading">
        <span className="loading-pulse" />
        <Typography>Loading dispatch details...</Typography>
      </Paper>
    );
  }

  if (!currentDispatch) {
    return (
      <Paper className="mfe-empty">
        <Typography variant="h6">Dispatch not found</Typography>
        <Typography color="text.secondary">{error ?? 'Unable to load this dispatch.'}</Typography>
        <Button onClick={() => navigate('/carrier/dispatches')}>Back to dispatches</Button>
      </Paper>
    );
  }

  const steps = ['Pending', 'Assigned', 'In Transit', 'Delivered'];
  const currentStep = Math.max(0, steps.indexOf(currentDispatch.status));
  const assignedVehicle = vehicles.find((vehicle) => vehicle.id === currentDispatch.vehicle);
  const assignedDriver = drivers.find((driver) => driver.id === currentDispatch.driver);
  const canAssign = currentDispatch.status === 'Pending';

  return (
    <Box className="mfe-page">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/carrier/dispatches')}
        sx={{ mb: 2 }}
      >
        Back to dispatches
      </Button>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Box className="listing-detail-heading">
          <Box>
            <Typography className="load-reference">
              DISPATCH #{currentDispatch.id.slice(0, 8).toUpperCase()}
            </Typography>
            <Typography variant="h4">{currentDispatch.listingTitle}</Typography>
          </Box>
          {canAssign && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                dispatch(clearAssignFeedback());
                setShowAssignment((value) => !value);
              }}
            >
              {showAssignment ? 'Cancel assignment' : 'Assign vehicle & driver'}
            </Button>
          )}
        </Box>

        {assignError && <Alert severity="error" sx={{ mt: 2 }}>{assignError}</Alert>}
        {assignSucceeded && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Vehicle and driver assigned successfully.
          </Alert>
        )}

        {showAssignment && (
          <Paper
            component="form"
            onSubmit={submitAssignment}
            variant="outlined"
            sx={{ mt: 2.5, p: 2.5, backgroundColor: '#f8fafb' }}
          >
            <Typography variant="h6">Assignment resources</Typography>
            <Typography color="text.secondary" sx={{ mb: 2, fontSize: 12 }}>
              Only available resources from your carrier organization can be assigned.
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Vehicle</InputLabel>
                  <Select
                    value={vehicleId}
                    label="Vehicle"
                    onChange={(event) => setVehicleId(String(event.target.value))}
                  >
                    {availableVehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.type} ({vehicle.capacity.toLocaleString()} kg)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Driver</InputLabel>
                  <Select
                    value={driverId}
                    label="Driver"
                    onChange={(event) => setDriverId(String(event.target.value))}
                  >
                    {availableDrivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.licenseNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!vehicleId || !driverId || isAssigning}
                >
                  {isAssigning ? <CircularProgress size={18} /> : 'Assign'}
                </Button>
              </Grid>
            </Grid>
            {(availableVehicles.length === 0 || availableDrivers.length === 0) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Add an available vehicle and driver in Fleet before assigning this dispatch.
              </Alert>
            )}
          </Paper>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Shipment progress
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
            <Typography variant="h6" gutterBottom>Assignment details</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography className="detail-label">Driver</Typography>
              <Typography>
                {assignedDriver
                  ? `${assignedDriver.name} - ${assignedDriver.licenseNumber}`
                  : currentDispatch.driver}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography className="detail-label">Vehicle</Typography>
              <Typography>
                {assignedVehicle
                  ? `${assignedVehicle.licensePlate} - ${assignedVehicle.type}`
                  : currentDispatch.vehicle}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Delivery timeline</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography className="detail-label">Estimated delivery</Typography>
              <Typography>
                {new Date(currentDispatch.estimatedDelivery).toLocaleString('vi-VN')}
              </Typography>
            </Box>
            {currentDispatch.actualDelivery && (
              <Box sx={{ mb: 2 }}>
                <Typography className="detail-label">Actual delivery</Typography>
                <Typography>
                  {new Date(currentDispatch.actualDelivery).toLocaleString('vi-VN')}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DispatchDetailPage;

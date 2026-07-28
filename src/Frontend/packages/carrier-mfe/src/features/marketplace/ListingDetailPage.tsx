import React, { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  clearBidFeedback,
  fetchListingById,
  placeBid,
} from './store/marketplaceSlice';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentListing,
    isLoading,
    error,
    isSubmittingBid,
    bidError,
    submittedBidId,
  } = useAppSelector((state) => state.marketplace);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) dispatch(fetchListingById(id));
    return () => {
      dispatch(clearBidFeedback());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentListing?.rate) setAmount(String(currentListing.rate));
  }, [currentListing?.id, currentListing?.rate]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currentListing?.currency ?? 'VND',
      maximumFractionDigits: 0,
    }).format(value);

  const submitBid = (event: FormEvent) => {
    event.preventDefault();
    if (!currentListing) return;

    const proposedPriceAmount = Number(amount);
    if (!Number.isFinite(proposedPriceAmount) || proposedPriceAmount <= 0) return;

    dispatch(
      placeBid({
        listingId: currentListing.id,
        proposedPriceAmount,
        proposedPriceCurrency: currentListing.currency,
        message: message.trim() || undefined,
      }),
    );
  };

  if (isLoading) {
    return (
      <Paper className="mfe-loading">
        <span className="loading-pulse" />
        <Typography>Loading listing details...</Typography>
      </Paper>
    );
  }

  if (!currentListing) {
    return (
      <Paper className="mfe-empty">
        <Typography variant="h6">Listing not found</Typography>
        <Typography color="text.secondary">
          {error ?? 'This load may have been removed or is no longer available.'}
        </Typography>
        <Button onClick={() => navigate('/carrier/marketplace')}>Back to marketplace</Button>
      </Paper>
    );
  }

  const canBid = currentListing.status === 'Open' && !submittedBidId;

  return (
    <Box className="mfe-page listing-detail-page">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/carrier/marketplace')}
        sx={{ mb: 2 }}
      >
        Back to marketplace
      </Button>

      <Paper className="listing-detail-hero">
        <Box className="listing-detail-heading">
          <Box>
            <Typography className="load-reference">
              LOAD #{currentListing.id.slice(0, 8).toUpperCase()}
            </Typography>
            <Typography variant="h4">{currentListing.title}</Typography>
            <Typography color="text.secondary">
              Review the lane, schedule and commercial terms before submitting your offer.
            </Typography>
          </Box>
          <Chip
            label={currentListing.status}
            color={currentListing.status === 'Open' ? 'success' : 'default'}
          />
        </Box>

        <Box className="listing-detail-route">
          <Box className="route-stop">
            <span className="route-marker origin"><PlaceOutlinedIcon /></span>
            <Box>
              <Typography className="detail-label">Pickup location</Typography>
              <Typography variant="h6">{currentListing.origin}</Typography>
              <Typography color="text.secondary">
                {formatDate(currentListing.pickupDate)}
              </Typography>
            </Box>
          </Box>
          <Box className="route-connector">
            <span />
            <LocalShippingOutlinedIcon />
            <span />
          </Box>
          <Box className="route-stop">
            <span className="route-marker destination"><PlaceOutlinedIcon /></span>
            <Box>
              <Typography className="detail-label">Delivery location</Typography>
              <Typography variant="h6">{currentListing.destination}</Typography>
              <Typography color="text.secondary">
                {formatDate(currentListing.deliveryDate)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Paper className="listing-detail-section">
            <Typography className="mfe-eyebrow">Shipment overview</Typography>
            <Typography variant="h6">Load requirements</Typography>
            <Box className="detail-metric-grid">
              <Box className="detail-metric">
                <ScaleOutlinedIcon />
                <span>Weight</span>
                <strong>{currentListing.weight.toLocaleString('vi-VN')} kg</strong>
              </Box>
              <Box className="detail-metric">
                <PaymentsOutlinedIcon />
                <span>Posted rate</span>
                <strong>
                  {currentListing.rate ? formatMoney(currentListing.rate) : 'Open bid'}
                </strong>
              </Box>
              <Box className="detail-metric">
                <CalendarMonthOutlinedIcon />
                <span>Transit window</span>
                <strong>
                  {Math.max(
                    1,
                    Math.ceil(
                      (new Date(currentListing.deliveryDate).getTime() -
                        new Date(currentListing.pickupDate).getTime()) /
                        86400000,
                    ),
                  )}{' '}
                  day(s)
                </strong>
              </Box>
            </Box>
            <Divider sx={{ my: 2.5 }} />
            <Stack spacing={2}>
              <Box className="detail-timeline-row">
                <span>01</span>
                <Box>
                  <Typography className="detail-label">Pickup appointment</Typography>
                  <Typography>{formatDate(currentListing.pickupDate)}</Typography>
                  <Typography color="text.secondary">{currentListing.origin}</Typography>
                </Box>
              </Box>
              <Box className="detail-timeline-row">
                <span>02</span>
                <Box>
                  <Typography className="detail-label">Delivery appointment</Typography>
                  <Typography>{formatDate(currentListing.deliveryDate)}</Typography>
                  <Typography color="text.secondary">{currentListing.destination}</Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper className="bid-panel">
            <Typography className="mfe-eyebrow">Carrier offer</Typography>
            <Typography variant="h6">Place your bid</Typography>
            <Typography color="text.secondary" className="bid-panel-copy">
              Submit a competitive all-in price. You can track the response from My Bids.
            </Typography>

            {bidError && <Alert severity="error" sx={{ mt: 2 }}>{bidError}</Alert>}
            {submittedBidId && (
              <Alert
                severity="success"
                icon={<CheckCircleOutlineIcon />}
                sx={{ mt: 2 }}
              >
                Bid submitted successfully.
              </Alert>
            )}

            <Box component="form" onSubmit={submitBid} className="bid-form">
              <TextField
                label="Your all-in price"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
                fullWidth
                inputProps={{ min: 1, step: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {currentListing.currency}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Message to shipper"
                placeholder="Equipment, availability or commercial notes"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                multiline
                minRows={4}
                fullWidth
                inputProps={{ maxLength: 500 }}
                helperText={`${message.length}/500 characters`}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                disabled={!canBid || isSubmittingBid || Number(amount) <= 0}
              >
                {isSubmittingBid ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Submitting bid...
                  </>
                ) : submittedBidId ? (
                  'Bid submitted'
                ) : (
                  'Submit bid'
                )}
              </Button>
              {submittedBidId && (
                <Button fullWidth onClick={() => navigate('/carrier/my-bids')}>
                  View My Bids
                </Button>
              )}
              {!canBid && !submittedBidId && (
                <Typography className="bid-form-note">
                  This listing is not open for new bids.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingDetailPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchBids } from './store/bidsSlice';

const BidsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bids, isLoading } = useAppSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchBids());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Accepted':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <Typography>Loading bids...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Received Bids
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Listing</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Est. Delivery</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{bid.listingTitle}</TableCell>
                <TableCell>{bid.carrierName}</TableCell>
                <TableCell>${bid.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={bid.status}
                    color={getStatusColor(bid.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{bid.estimatedDelivery}</TableCell>
                <TableCell>{bid.submittedAt}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/dispatcher/bids/${bid.id}`)}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BidsPage;

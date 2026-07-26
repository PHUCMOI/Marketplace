import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, LinearProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchDeals } from './store/dealsSlice';

const DealsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { deals, isLoading } = useAppSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Completed':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <Typography>Loading deals...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Active Deals
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Listing</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Est. Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{deal.listingTitle}</TableCell>
                <TableCell>{deal.carrierName}</TableCell>
                <TableCell>${deal.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={deal.status}
                    color={getStatusColor(deal.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={deal.progress}
                      sx={{ flex: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">{deal.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>{deal.estimatedDelivery}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/dispatcher/deals/${deal.id}`)}
                  >
                    View
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

export default DealsPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchListings } from './store/listingsSlice';

const ListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { listings, isLoading } = useAppSelector((state) => state.listings);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Completed':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <Typography>Loading listings...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Listings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dispatcher/listings/new')}
        >
          Create Listing
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Bids</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{listing.title}</TableCell>
                <TableCell>{listing.origin}</TableCell>
                <TableCell>{listing.destination}</TableCell>
                <TableCell>{listing.weight}</TableCell>
                <TableCell>
                  <Chip
                    label={listing.status}
                    color={getStatusColor(listing.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{listing.bidCount}</TableCell>
                <TableCell>{listing.createdAt}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/dispatcher/listings/${listing.id}`)}
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

export default ListingsPage;

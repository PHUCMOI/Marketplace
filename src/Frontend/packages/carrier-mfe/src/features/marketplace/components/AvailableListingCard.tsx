import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../store/marketplaceSlice';

interface AvailableListingCardProps {
  listing: Listing;
}

const AvailableListingCard: React.FC<AvailableListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/carrier/marketplace/${listing.id}`);
  };

  const handlePlaceBid = () => {
    navigate(`/carrier/marketplace/${listing.id}?action=bid`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {listing.title}
          </Typography>
          <Chip label={listing.status} color="success" size="small" />
        </Box>

        <Typography color="textSecondary" gutterBottom>
          {listing.origin} → {listing.destination}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Pickup: {listing.pickupDate}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Delivery: {listing.deliveryDate}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Weight
            </Typography>
            <Typography variant="body2">{listing.weight} lbs</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Rate
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ${listing.rate}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={handleViewDetails}>
          View Details
        </Button>
        <Button size="small" variant="contained" onClick={handlePlaceBid}>
          Place Bid
        </Button>
      </CardActions>
    </Card>
  );
};

export default AvailableListingCard;

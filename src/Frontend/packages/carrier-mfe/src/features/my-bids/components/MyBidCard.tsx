import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { Bid } from '../store/myBidsSlice';

interface MyBidCardProps {
  bid: Bid;
}

const MyBidCard: React.FC<MyBidCardProps> = ({ bid }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {bid.listingTitle}
          </Typography>
          <Chip label={bid.status} color={getStatusColor(bid.status)} size="small" />
        </Box>

        <Typography color="textSecondary" gutterBottom>
          Bid #{bid.id}
        </Typography>

        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Bid Amount
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            ${bid.bidAmount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Placed
            </Typography>
            <Typography variant="body2">{bid.createdAt}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              Updated
            </Typography>
            <Typography variant="body2">{bid.updatedAt}</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small">View Details</Button>
        {bid.status === 'Pending' && <Button size="small" color="error">Withdraw</Button>}
      </CardActions>
    </Card>
  );
};

export default MyBidCard;

import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../store/marketplaceSlice';

interface AvailableListingCardProps { listing: Listing; }

const AvailableListingCard: React.FC<AvailableListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();
  const date = (value: string) => new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return <Card className="market-load-card">
    <CardContent>
      <Box className="load-card-top"><Box><Typography className="load-reference">LOAD #{listing.id.slice(0, 8)}</Typography><Typography variant="h6">{listing.title}</Typography></Box><Chip label={listing.status} color="success" size="small" /></Box>
      <Box className="market-route"><Box><span>ORIGIN</span><strong>{listing.origin}</strong><small>Pickup {date(listing.pickupDate)}</small></Box><div className="route-line"><i/><b>→</b></div><Box><span>DESTINATION</span><strong>{listing.destination}</strong><small>Deliver {date(listing.deliveryDate)}</small></Box></Box>
      <Divider />
      <Box className="load-card-metrics"><Box><span>WEIGHT</span><strong>{listing.weight.toLocaleString()} kg</strong></Box><Box><span>POSTED RATE</span><strong className="market-rate">{listing.rate ? `${listing.rate.toLocaleString('vi-VN')} ₫` : 'Open bid'}</strong></Box><Box><span>PAYMENT</span><strong>On delivery</strong></Box></Box>
    </CardContent>
    <CardActions><Button onClick={() => navigate(`/carrier/marketplace/${listing.id}`)}>View details</Button><Button variant="contained" color="secondary" onClick={() => navigate(`/carrier/marketplace/${listing.id}?action=bid`)}>Place bid</Button></CardActions>
  </Card>;
};
export default AvailableListingCard;

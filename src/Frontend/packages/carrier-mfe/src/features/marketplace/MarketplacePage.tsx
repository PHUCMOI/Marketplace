import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Typography, Button, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchAvailableListings } from './store/marketplaceSlice';
import AvailableListingCard from './components/AvailableListingCard';

const MarketplacePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availableListings, isLoading, error } = useAppSelector((state) => state.marketplace);
  const [showMap, setShowMap] = useState(false);
  const [query, setQuery] = useState('');
  const [minimumRate, setMinimumRate] = useState('0');

  useEffect(() => { dispatch(fetchAvailableListings()); }, [dispatch]);
  const filtered = useMemo(() => availableListings.filter((listing) => {
    const text = `${listing.title} ${listing.origin} ${listing.destination}`.toLowerCase();
    return text.includes(query.toLowerCase()) && listing.rate >= Number(minimumRate);
  }), [availableListings, query, minimumRate]);

  return <Box className="mfe-page">
    <Box className="mfe-page-header">
      <Box><Typography className="mfe-eyebrow">Carrier marketplace</Typography><Typography variant="h4">Load board</Typography><Typography color="text.secondary">Find profitable lanes and respond to shipper demand.</Typography></Box>
      <Button variant="contained" color="secondary" onClick={() => setShowMap(!showMap)}>{showMap ? 'Show list' : 'Route map'}</Button>
    </Box>
    <Paper className="market-filter-bar">
      <TextField label="Search loads" placeholder="Cargo, origin or destination" value={query} onChange={(e) => setQuery(e.target.value)} />
      <FormControl size="small"><InputLabel>Minimum rate</InputLabel><Select label="Minimum rate" value={minimumRate} onChange={(e) => setMinimumRate(String(e.target.value))}><MenuItem value="0">Any rate</MenuItem><MenuItem value="5000000">₫5M+</MenuItem><MenuItem value="10000000">₫10M+</MenuItem><MenuItem value="20000000">₫20M+</MenuItem></Select></FormControl>
      <Box className="filter-result"><strong>{filtered.length}</strong><span>available loads</span></Box>
      <Chip label="Live marketplace" color="success" variant="outlined" />
    </Paper>
    {error && <Paper className="mfe-error"><Typography>{error}</Typography></Paper>}
    {isLoading ? <Paper className="mfe-loading"><span className="loading-pulse"/><Typography>Loading available loads...</Typography></Paper> : showMap ? (
      <Paper className="route-map-placeholder"><div className="map-grid"/><div className="map-route route-one"/><div className="map-route route-two"/><Box><Typography variant="h6">Route map</Typography><Typography color="text.secondary">Map integration is ready for the routing provider.</Typography></Box></Paper>
    ) : (
      <Grid container spacing={2}>{filtered.map((listing) => <Grid item xs={12} lg={6} key={listing.id}><AvailableListingCard listing={listing} /></Grid>)}{filtered.length === 0 && <Grid item xs={12}><Paper className="mfe-empty"><Typography variant="h6">No loads match these filters</Typography><Typography color="text.secondary">Try a broader route or lower minimum rate.</Typography></Paper></Grid>}</Grid>
    )}
  </Box>;
};

export default MarketplacePage;

import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Chip } from '@mui/material';
interface Activity { id: string; title: string; description: string; timestamp: string; type: 'listing' | 'bid' | 'deal'; }
const activities: Activity[] = [
  { id: '1', title: 'New listing created', description: 'Electronics load from Hà Nội to Hồ Chí Minh City', timestamp: '2 hours ago', type: 'listing' },
  { id: '2', title: 'Carrier bid received', description: 'A verified carrier submitted a bid for the furniture lane', timestamp: '4 hours ago', type: 'bid' },
  { id: '3', title: 'Deal assigned', description: 'The Đà Nẵng load moved into active execution', timestamp: 'Yesterday', type: 'deal' }
];
const color = (type: Activity['type']) => type === 'listing' ? 'primary' : type === 'bid' ? 'warning' : 'success';
const RecentActivity: React.FC = () => <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}><Box><Typography className="mfe-eyebrow">Event stream</Typography><Typography variant="h6">Recent activity</Typography></Box><Typography color="text.secondary" variant="caption">Latest network changes</Typography></Box><List disablePadding>{activities.map((activity) => <ListItem key={activity.id} sx={{ borderBottom: '1px solid #e2e8ec', px: 0, py: 1.5 }}><ListItemText primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="body2" fontWeight={750}>{activity.title}</Typography><Chip label={activity.type} size="small" color={color(activity.type)} variant="outlined"/></Box>} secondary={<Box sx={{ mt: .5, display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography variant="body2" color="text.secondary">{activity.description}</Typography><Typography variant="caption" color="text.secondary" whiteSpace="nowrap">{activity.timestamp}</Typography></Box>}/></ListItem>)}</List></Box>;
export default RecentActivity;

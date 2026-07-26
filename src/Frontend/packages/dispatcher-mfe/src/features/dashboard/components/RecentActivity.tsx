import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Chip } from '@mui/material';

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'listing' | 'bid' | 'deal';
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      title: 'New Listing Created',
      description: 'Electronics shipment from NY to LA',
      timestamp: '2 hours ago',
      type: 'listing',
    },
    {
      id: '2',
      title: 'Bid Received',
      description: 'Carrier ABC submitted bid for Furniture delivery',
      timestamp: '4 hours ago',
      type: 'bid',
    },
    {
      id: '3',
      title: 'Deal Accepted',
      description: 'Carrier XYZ accepted deal for Chicago shipment',
      timestamp: '1 day ago',
      type: 'deal',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'listing':
        return 'primary';
      case 'bid':
        return 'warning';
      case 'deal':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <List>
        {activities.map((activity) => (
          <ListItem key={activity.id} sx={{ borderBottom: '1px solid #eee', py: 2 }}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {activity.title}
                  </Typography>
                  <Chip
                    label={activity.type}
                    size="small"
                    color={getTypeColor(activity.type)}
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                    {activity.timestamp}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RecentActivity;

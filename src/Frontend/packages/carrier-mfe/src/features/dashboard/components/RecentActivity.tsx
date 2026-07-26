import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

export const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, title: 'New load available', description: 'Load #1234 from New York to Boston', time: '2 hours ago' },
    { id: 2, title: 'Bid accepted', description: 'Your bid for load #1233 was accepted', time: '4 hours ago' },
    { id: 3, title: 'Dispatch completed', description: 'Load #1232 delivered successfully', time: '1 day ago' },
  ];

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem>
              <ListItemText
                primary={activity.title}
                secondary={`${activity.description} - ${activity.time}`}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default RecentActivity;

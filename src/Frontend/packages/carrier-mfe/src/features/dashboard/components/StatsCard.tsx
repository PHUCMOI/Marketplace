import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color = 'primary' }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h5" component="div" sx={{ color: `${color}.main` }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: number;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color }) => {
  const colorMap: Record<string, string> = {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: colorMap[color],
              opacity: 0.1,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

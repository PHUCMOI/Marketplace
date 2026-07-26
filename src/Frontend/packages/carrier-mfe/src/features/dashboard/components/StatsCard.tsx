import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
interface StatsCardProps { title: string; value: string | number; color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'; }
const colorMap = { primary: '#0b2d45', secondary: '#f4a61d', success: '#17805c', warning: '#c77909', info: '#16729a', error: '#c23b3b' };
const StatsCard: React.FC<StatsCardProps> = ({ title, value, color = 'primary' }) => <Card className="mfe-stat-card" sx={{ borderTop: `3px solid ${colorMap[color]}` }}><CardContent><Typography color="text.secondary">{title}</Typography><Box><Typography variant="h5">{value}</Typography></Box><Typography className="stat-caption">Current marketplace total</Typography></CardContent></Card>;
export default StatsCard;

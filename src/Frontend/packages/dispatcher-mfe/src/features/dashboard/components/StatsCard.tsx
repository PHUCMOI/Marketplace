import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
interface StatsCardProps { title: string; value: number; color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'; }
const colorMap = { primary: '#0b2d45', secondary: '#f4a61d', success: '#17805c', error: '#c23b3b', warning: '#c77909', info: '#16729a' };
const StatsCard: React.FC<StatsCardProps> = ({ title, value, color }) => <Card className="mfe-stat-card" sx={{ borderTop: `3px solid ${colorMap[color]}` }}><CardContent><Typography color="text.secondary">{title}</Typography><Box><Typography variant="h5">{value}</Typography></Box><Typography className="stat-caption">Current operational total</Typography></CardContent></Card>;
export default StatsCard;

import React from 'react';
import { BrowserRouter, useInRouterContext } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import CarrierRoutes from './routes/CarrierRoutes';
import './styles/index.css';

const theme = createTheme({
  palette: {
    primary: { main: '#0f5b78', dark: '#0b4057' },
    secondary: { main: '#f4a61d', contrastText: '#102b3d' },
    success: { main: '#17805c' },
    warning: { main: '#c77909' },
    background: { default: '#eef2f5', paper: '#ffffff' },
    text: { primary: '#152b3b', secondary: '#5a6c79' },
    divider: '#d6dde3'
  },
  shape: { borderRadius: 5 },
  typography: { fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif', h4: { fontWeight: 750, letterSpacing: '-0.025em' }, h6: { fontWeight: 750 } },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 38, borderRadius: 4, boxShadow: 'none', fontSize: 12, fontWeight: 800, textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { border: '1px solid #d6dde3', boxShadow: '0 1px 2px rgba(10,35,52,.06)' } } },
    MuiPaper: { styleOverrides: { root: { border: '1px solid #d6dde3', boxShadow: '0 1px 2px rgba(10,35,52,.06)' } } },
    MuiChip: { styleOverrides: { root: { height: 24, borderRadius: 12, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' } } },
    MuiTextField: { defaultProps: { size: 'small' } }
  }
});

const CarrierContent: React.FC = () => <Provider store={store}><ThemeProvider theme={theme}><CssBaseline /><CarrierRoutes /></ThemeProvider></Provider>;

const CarrierApp: React.FC = () => {
  const hasRouter = useInRouterContext();
  const content = <CarrierContent />;
  return hasRouter ? content : <BrowserRouter>{content}</BrowserRouter>;
};

export default CarrierApp;

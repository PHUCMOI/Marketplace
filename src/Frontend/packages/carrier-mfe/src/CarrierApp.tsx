import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import CarrierRoutes from './routes/CarrierRoutes';

const theme = createTheme();
const CarrierApp: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <CarrierRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default CarrierApp;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import DispatcherRoutes from './routes/DispatcherRoutes';

const theme = createTheme();

const DispatcherApp: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <DispatcherRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default DispatcherApp;

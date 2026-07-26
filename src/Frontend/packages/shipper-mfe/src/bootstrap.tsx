
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ShipperApp from './ShipperApp';
import './styles/shipper-app.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <ShipperApp />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
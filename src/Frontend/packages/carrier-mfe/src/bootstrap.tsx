import React from 'react';
import ReactDOM from 'react-dom/client';
import CarrierApp from './CarrierApp';
import './styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <CarrierApp />
  </React.StrictMode>
);

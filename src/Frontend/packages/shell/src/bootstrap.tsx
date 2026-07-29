
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';
import './styles/global.css';

const RootComponent: React.FC = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: RootComponent,
  errorBoundary: (error) => (
    <div role="alert">Shell failed to render: {error.message}</div>
  ),
});

export const { bootstrap, mount, unmount } = lifecycles;

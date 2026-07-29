import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import CarrierApp from './CarrierApp';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: CarrierApp,
  errorBoundary: (error) => (
    <div role="alert">Carrier application failed: {error.message}</div>
  ),
});

const setStylesEnabled = (enabled: boolean): Promise<void> => {
  document
    .querySelectorAll<HTMLStyleElement>('style[data-single-spa-application="carrier-mfe"]')
    .forEach((style) => { style.media = enabled ? 'all' : 'not all'; });
  return Promise.resolve();
};

export const bootstrap = lifecycles.bootstrap;
export const mount = [() => setStylesEnabled(true), lifecycles.mount];
export const unmount = [lifecycles.unmount, () => setStylesEnabled(false)];

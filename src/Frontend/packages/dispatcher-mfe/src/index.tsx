import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import DispatcherApp from './DispatcherApp';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: DispatcherApp,
  errorBoundary: (error) => (
    <div role="alert">Dispatcher application failed: {error.message}</div>
  ),
});

const setStylesEnabled = (enabled: boolean): Promise<void> => {
  document
    .querySelectorAll<HTMLStyleElement>('style[data-single-spa-application="dispatcher-mfe"]')
    .forEach((style) => { style.media = enabled ? 'all' : 'not all'; });
  return Promise.resolve();
};

export const bootstrap = lifecycles.bootstrap;
export const mount = [() => setStylesEnabled(true), lifecycles.mount];
export const unmount = [lifecycles.unmount, () => setStylesEnabled(false)];

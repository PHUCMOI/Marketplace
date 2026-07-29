
import { registerApplication, start } from 'single-spa';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the shell root element');
}

registerApplication({
  name: '@logistics-marketplace/shell',
  app: () => import('./bootstrap'),
  activeWhen: () => true,
  customProps: { domElement: rootElement },
});

start();

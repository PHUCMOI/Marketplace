import React from 'react';
import Parcel from 'single-spa-react/parcel';
import { loadSingleSpaBundle } from './load-bundle';
import type { MfeBundleConfig } from './mfe-config';

export const SingleSpaBundle: React.FC<MfeBundleConfig> = ({
  name,
  moduleName,
  basePath,
}) => (
  <Parcel
    config={() => loadSingleSpaBundle(moduleName)}
    name={name}
    basePath={basePath}
    wrapWith="div"
    wrapClassName="single-spa-mfe"
    handleError={(error: Error) => {
      console.error(`Failed to mount ${name}`, error);
    }}
  />
);

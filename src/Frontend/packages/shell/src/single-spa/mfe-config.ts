export interface MfeBundleConfig {
  name: string;
  moduleName: string;
  basePath: string;
}

const defaults: Record<'shipper' | 'carrier' | 'dispatcher', MfeBundleConfig> = {
  shipper: {
    name: '@logistics-marketplace/shipper-mfe',
    moduleName: '@logistics-marketplace/shipper-mfe',
    basePath: '/shipper',
  },
  carrier: {
    name: '@logistics-marketplace/carrier-mfe',
    moduleName: '@logistics-marketplace/carrier-mfe',
    basePath: '/carrier',
  },
  dispatcher: {
    name: '@logistics-marketplace/dispatcher-mfe',
    moduleName: '@logistics-marketplace/dispatcher-mfe',
    basePath: '/dispatcher',
  },
};

export const mfeBundles = defaults;

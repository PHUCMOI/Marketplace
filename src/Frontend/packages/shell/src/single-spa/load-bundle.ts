import type { ParcelConfigObject } from 'single-spa';

export type SingleSpaBundleModule = ParcelConfigObject<Record<string, unknown>>;

const bundleCache = new Map<string, Promise<SingleSpaBundleModule>>();

const isLifecycleBundle = (value: unknown): value is SingleSpaBundleModule => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<SingleSpaBundleModule>;
  return (
    typeof candidate.bootstrap === 'function' &&
    typeof candidate.mount === 'function' &&
    typeof candidate.unmount === 'function'
  );
};

/** Resolves a System.register bundle through the page's import map. */
export const loadSingleSpaBundle = (
  moduleName: string
): Promise<SingleSpaBundleModule> => {
  const existing = bundleCache.get(moduleName);
  if (existing) return existing;

  const loading = System.import(moduleName).then((bundle: unknown) => {
    if (!isLifecycleBundle(bundle)) {
      throw new Error(`Module ${moduleName} did not expose single-spa lifecycles`);
    }
    return bundle;
  });

  bundleCache.set(moduleName, loading);
  loading.catch(() => bundleCache.delete(moduleName));
  return loading;
};

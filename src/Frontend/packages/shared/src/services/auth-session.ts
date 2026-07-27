import { storage, STORAGE_KEYS } from '../utils/storage';

const AUTH_SESSION_CHANGED_EVENT = 'logistics-marketplace:auth-session-changed';

export const notifyAuthSessionChanged = (): void => {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
};

export const subscribeToAuthSession = (listener: () => void): (() => void) => {
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === `logistics_marketplace_${STORAGE_KEYS.ACCESS_TOKEN}` ||
      event.key === `logistics_marketplace_${STORAGE_KEYS.USER}`
    ) {
      listener();
    }
  };

  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, listener);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
};

export const clearAuthSession = (): void => {
  storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(STORAGE_KEYS.USER);
  notifyAuthSessionChanged();
};

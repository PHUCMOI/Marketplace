
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password'
  },

  // Listings
  LISTINGS: {
    BASE: '/api/listings',
    BY_ID: (id: string) => `/api/listings/${id}`,
    SEARCH: '/api/listings/search',
    MY_LISTINGS: '/api/listings/my-listings'
  },

  // Bids
  BIDS: {
    BASE: '/api/bids',
    BY_ID: (id: string) => `/api/bids/${id}`,
    BY_LISTING: (listingId: string) => `/api/bids/listing/${listingId}`,
    MY_BIDS: '/api/bids/my-bids'
  },

  // Deals
  DEALS: {
    BASE: '/api/deals',
    BY_ID: (id: string) => `/api/deals/${id}`,
    MY_DEALS: '/api/deals/my-deals',
    CONFIRM: (id: string) => `/api/deals/${id}/confirm`,
    CANCEL: (id: string) => `/api/deals/${id}/cancel`
  },

  // Dispatches
  DISPATCHES: {
    BASE: '/api/dispatches',
    BY_ID: (id: string) => `/api/dispatches/${id}`,
    BY_DEAL: (dealId: string) => `/api/dispatches/deal/${dealId}`,
    UPDATE_STATUS: (id: string) => `/api/dispatches/${id}/status`,
    UPDATE_LOCATION: (id: string) => `/api/dispatches/${id}/location`
  },

  // Vehicles
  VEHICLES: {
    BASE: '/api/vehicles',
    BY_ID: (id: string) => `/api/vehicles/${id}`,
    AVAILABLE: '/api/vehicles/available',
    BY_ORGANIZATION: (orgId: string) => `/api/vehicles/organization/${orgId}`
  },

  // Drivers
  DRIVERS: {
    BASE: '/api/drivers',
    BY_ID: (id: string) => `/api/drivers/${id}`,
    AVAILABLE: '/api/drivers/available',
    BY_ORGANIZATION: (orgId: string) => `/api/drivers/organization/${orgId}`
  }
} as const;
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',

  // Listings
  LISTINGS: '/listings',
  LISTING_DETAIL: (id: string) => `/listings/${id}`,
  CREATE_LISTING: '/listings/create',
  EDIT_LISTING: (id: string) => `/listings/${id}/edit`,

  // Bids
  BIDS: '/bids',
  BID_DETAIL: (id: string) => `/bids/${id}`,

  // Deals
  DEALS: '/deals',
  DEAL_DETAIL: (id: string) => `/deals/${id}`,

  // Dispatches
  DISPATCHES: '/dispatches',
  DISPATCH_DETAIL: (id: string) => `/dispatches/${id}`,
  CREATE_DISPATCH: '/dispatches/create',

  // Vehicles
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: (id: string) => `/vehicles/${id}`,
  CREATE_VEHICLE: '/vehicles/create',
  EDIT_VEHICLE: (id: string) => `/vehicles/${id}/edit`,

  // Drivers
  DRIVERS: '/drivers',
  DRIVER_DETAIL: (id: string) => `/drivers/${id}`,
  CREATE_DRIVER: '/drivers/create',
  EDIT_DRIVER: (id: string) => `/drivers/${id}/edit`,

  // Profile
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;
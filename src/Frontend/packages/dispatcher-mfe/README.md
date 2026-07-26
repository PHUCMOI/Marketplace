# Dispatcher Microfrontend (MFE)

The Dispatcher Microfrontend is a specialized portal for logistics dispatchers to manage shipment listings, review carrier bids, and track active deals.

## Features

### 1. Dashboard
- Real-time statistics (Active Listings, Pending Bids, Active Deals, Completed Today)
- Recent activity feed showing all events
- Quick overview of dispatcher operations

### 2. Listings Management
- **View Listings**: Browse all active and past listings
- **Create Listing**: Create new shipment listings with details
- **Listing Details**: View comprehensive listing information and received bids

### 3. Bids Management
- **View Bids**: See all received bids from carriers
- **Bid Review**: Detailed bid review with carrier information and pricing
- **Accept/Reject**: Accept or reject bids directly from the review page

### 4. Deals Management
- **Active Deals**: Track all active deals with progress indicators
- **Deal Details**: View comprehensive deal information including:
  - Carrier and shipment details
  - Delivery progress with visual indicators
  - Timeline and status information
- **Shipment Tracking**: Track shipment progress in real-time
- **Carrier Communication**: Contact carriers directly

## Project Structure

```
dispatcher-mfe/
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── index.tsx                  # Entry point
│   ├── bootstrap.tsx              # React DOM rendering
│   ├── DispatcherApp.tsx          # Main app component
│   ├── store/
│   │   ├── store.ts               # Redux store configuration
│   │   └── rootReducer.ts         # Root reducer
│   ├── routes/
│   │   └── DispatcherRoutes.tsx   # Route definitions
│   ├── styles/
│   │   └── index.css              # Global styles
│   └── features/
│       ├── dashboard/
│       │   ├── DashboardPage.tsx
│       │   ├── components/
│       │   │   ├── StatsCard.tsx
│       │   │   └── RecentActivity.tsx
│       │   └── store/
│       │       └── dashboardSlice.ts
│       ├── listings/
│       │   ├── ListingsPage.tsx
│       │   ├── CreateListingPage.tsx
│       │   ├── ListingDetailPage.tsx
│       │   └── store/
│       │       └── listingsSlice.ts
│       ├── bids/
│       │   ├── BidsPage.tsx
│       │   ├── BidReviewPage.tsx
│       │   └── store/
│       │       └── bidsSlice.ts
│       └── deals/
│           ├── DealsPage.tsx
│           ├── DealDetailPage.tsx
│           └── store/
│               └── dealsSlice.ts
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Material-UI (MUI)**: Component library
- **Webpack 5**: Module bundler with Module Federation

## Getting Started

### Installation

```bash
cd src/Frontend
npm install
npx lerna bootstrap
```

### Development

```bash
npm start
```

The Dispatcher MFE will run on `http://localhost:3001`

### Build

```bash
npm run build
```

## Module Federation

This MFE is configured as a remote module and can be consumed by the Shell application.

**Exposed Modules:**
- `./DispatcherApp` - Main application component

**Shared Dependencies:**
- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- @mui/material

## State Management

Redux Toolkit is used for state management with the following slices:

### Dashboard Slice
- `fetchDashboardStats` - Fetch dashboard statistics

### Listings Slice
- `fetchListings` - Fetch all listings
- `fetchListingById` - Fetch specific listing details

### Bids Slice
- `fetchBids` - Fetch all received bids
- `fetchBidById` - Fetch specific bid details

### Deals Slice
- `fetchDeals` - Fetch all active deals
- `fetchDealById` - Fetch specific deal details

## API Integration

Currently using mock data. To integrate with real APIs:

1. Update the async thunks in each slice
2. Replace mock data with actual API calls
3. Update the API client in the shared package

Example:
```typescript
export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/listings');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Routing

Routes are defined in `src/routes/DispatcherRoutes.tsx`:

- `/dispatcher` - Dashboard (default)
- `/dispatcher/listings` - Listings list
- `/dispatcher/listings/new` - Create new listing
- `/dispatcher/listings/:id` - Listing details
- `/dispatcher/bids` - Bids list
- `/dispatcher/bids/:id` - Bid review
- `/dispatcher/deals` - Deals list
- `/dispatcher/deals/:id` - Deal details

## Styling

Global styles are defined in `src/styles/index.css`. Material-UI components use the `sx` prop for inline styling.

## Contributing

When adding new features:

1. Create a new feature folder under `src/features/`
2. Create Redux slice in `store/` subfolder
3. Create page components
4. Add routes to `DispatcherRoutes.tsx`
5. Follow the existing patterns for consistency

## Testing

To add tests:

1. Create `.test.tsx` files alongside components
2. Use Jest and React Testing Library
3. Run tests with `npm test`

## Deployment

The MFE is deployed as part of the Shell application. Ensure:

1. Build is successful: `npm run build`
2. All dependencies are correctly specified in `package.json`
3. Module Federation configuration is correct in `webpack.config.js`

## Troubleshooting

### Module not found errors
- Run `npm install` and `npx lerna bootstrap`
- Clear node_modules and reinstall

### Redux state not updating
- Check that actions are dispatched correctly
- Verify reducer logic in slices
- Use Redux DevTools for debugging

### Styling issues
- Ensure Material-UI is installed
- Check CSS specificity
- Verify theme configuration

## Support

For issues or questions, refer to the main project documentation or contact the development team.

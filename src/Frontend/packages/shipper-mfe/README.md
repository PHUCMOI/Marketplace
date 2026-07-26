# Shipper Micro-Frontend

The Shipper MFE is a Module Federation remote application that provides freight listing management and bidding capabilities for shipper users in the LogisticsMarketplace platform.

## Overview

This micro-frontend allows shippers to:
- Create and manage freight listings
- Review and respond to carrier bids
- Track confirmed deals and shipments
- Monitor listing performance and metrics

## Technology Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Webpack 5** - Module bundler with Module Federation
- **React Router 6** - Client-side routing

## Module Federation Configuration

- **Name**: `shipperMfe`
- **Port**: 3001
- **Exposes**: `./ShipperApp` → Main application component
- **Shared Dependencies**: react, react-dom, react-router-dom

## Project Structure

```
src/
├── index.tsx              # Entry point with async boundary
├── bootstrap.tsx          # Standalone bootstrap
├── ShipperApp.tsx         # Main app component (EXPOSED)
├── styles/
│   └── shipper-app.css    # Global styles
├── pages/
│   ├── ShipperDashboard.tsx
│   ├── ListingsPage.tsx
│   ├── CreateListingPage.tsx
│   ├── ListingDetailPage.tsx
│   ├── EditListingPage.tsx
│   ├── BidsPage.tsx
│   ├── DealsPage.tsx
│   └── DealDetailPage.tsx
└── components/
    ├── ListingCard.tsx
    ├── ListingForm.tsx
    ├── BidCard.tsx
    ├── BidActions.tsx
    ├── ListingStats.tsx
    ├── ListingFilters.tsx
    └── DealStatus.tsx
```

## Routes

The ShipperApp component exposes these routes:

- `/` - Shipper Dashboard
- `/listings` - My Listings List
- `/listings/create` - Create New Listing
- `/listings/:id` - Listing Detail with Bids
- `/listings/:id/edit` - Edit Listing
- `/bids` - Received Bids List
- `/deals` - My Deals List
- `/deals/:id` - Deal Detail

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

The application will be available at http://localhost:3001

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Integration with Shell

The shell application imports this MFE as:

```typescript
const ShipperApp = React.lazy(() => import('shipperMfe/ShipperApp'));
```

The shell provides:
- BrowserRouter context (ShipperApp uses Routes, not BrowserRouter)
- Authentication context
- Global navigation
- Shared styling theme

## Dependencies

### Runtime Dependencies
- `react` - UI framework
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `@logistics-marketplace/shared` - Shared components and utilities

### Development Dependencies
- `typescript` - Type checking
- `webpack` - Module bundler
- `ts-loader` - TypeScript loader
- `eslint` - Linting
- `prettier` - Code formatting

## Shared Package Integration

This MFE imports from `@logistics-marketplace/shared`:

### Components
- Button, Card, Input, Table, Badge, Alert

### Services
- listingService - Listing CRUD operations
- bidService - Bid management
- dealService - Deal tracking

### Types
- Listing, Bid, Deal
- ListingStatus, BidStatus, DealStatus

### Utils
- formatCurrency, formatDate

## Features

### Listing Management
- Create new freight listings with detailed information
- Edit existing listings
- View listing details and received bids
- Filter and search listings

### Bid Review
- View all received bids across listings
- Accept or reject bids
- Track bid status and history

### Deal Tracking
- Monitor confirmed deals
- View deal details and progress
- Track shipment status

### Dashboard
- Overview of key metrics
- Recent listings
- Pending bid notifications
- Revenue tracking

## Styling

The application uses:
- CSS Modules for component-specific styles
- Global styles in `shipper-app.css`
- Responsive design (mobile-first)
- Consistent design tokens from shared package

## Performance

- Code splitting via Module Federation
- Lazy loading of routes
- Optimized bundle size
- Shared dependencies to avoid duplication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
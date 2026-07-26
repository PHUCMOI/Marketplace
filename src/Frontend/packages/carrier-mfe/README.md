# Carrier Microfrontend (MFE)

The Carrier Microfrontend is a self-contained React application that provides a comprehensive portal for logistics carriers to manage their operations within the Logistics Marketplace platform.

## Overview

This MFE enables carriers to:
- Browse available loads in the marketplace
- Place and manage bids on shipments
- Manage their fleet (vehicles and drivers)
- Track active dispatches and deliveries
- View performance metrics and analytics

## Features

### Dashboard
- Real-time statistics on available loads, active bids, and dispatches
- Revenue tracking and performance metrics
- Recent activity feed

### Marketplace
- Browse available loads with filtering and search
- View detailed load information
- Place competitive bids
- Map view for geographic visualization

### My Bids
- Track all placed bids
- View bid status (Pending, Accepted, Rejected)
- Withdraw bids if needed

### Fleet Management
- **Vehicles**: Add, edit, and manage fleet vehicles
- **Drivers**: Manage driver profiles, licenses, and ratings

### Dispatches
- Track active shipments in real-time
- View dispatch progress and timeline
- Contact drivers and access shipment documents
- Live tracking capabilities

## Project Structure

```
src/
├── features/
│   ├── dashboard/          # Dashboard feature
│   │   ├── components/
│   │   ├── store/
│   │   └── DashboardPage.tsx
│   ├── marketplace/        # Marketplace feature
│   │   ├── components/
│   │   ├── store/
│   │   ├── MarketplacePage.tsx
│   │   └── ListingDetailPage.tsx
│   ├── my-bids/           # My Bids feature
│   │   ├── components/
│   │   ├── store/
│   │   └── MyBidsPage.tsx
│   ├── fleet/             # Fleet management
│   │   ├── components/
│   │   ├── store/
│   │   ├── VehiclesPage.tsx
│   │   └── DriversPage.tsx
│   └── dispatches/        # Dispatch tracking
│       ├── components/
│       ├── store/
│       ├── DispatchesPage.tsx
│       └── DispatchDetailPage.tsx
├── routes/
│   └── CarrierRoutes.tsx   # Route definitions
├── store/
│   ├── store.ts           # Redux store configuration
│   └── rootReducer.ts     # Root reducer
├── styles/
│   └── index.css          # Global styles
├── CarrierApp.tsx         # Main app component
├── bootstrap.tsx          # Async bootstrap for Module Federation
└── index.tsx              # Entry point
```

## Technology Stack

- **React 18.2+**: UI framework
- **TypeScript 5.0+**: Type safety
- **Redux Toolkit**: State management
- **Material-UI (MUI) 5.14+**: UI components
- **React Router 6.14+**: Client-side routing
- **Webpack 5.88+**: Module bundler with Module Federation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### Development

```bash
# Start the development server
npm start

# The MFE will be available at http://localhost:3002
```

### Building

```bash
# Build for production
npm run build

# Output will be in the dist/ directory
```

## Module Federation

This MFE is configured as a remote module in the Module Federation setup:

**Exposed Modules:**
- `./CarrierApp` - Main application component
- `./CarrierRoutes` - Route definitions
- `./DashboardPage` - Dashboard page component

**Consumed Modules:**
- `shared` - Shared components, utilities, and API clients

## State Management

Redux Toolkit is used for state management with the following slices:

- `marketplace` - Available listings and current listing details
- `myBids` - User's placed bids
- `vehicles` - Fleet vehicles
- `drivers` - Fleet drivers
- `dispatches` - Active dispatches and dispatch details
- `dashboard` - Dashboard statistics

## API Integration

All API calls are made through the shared API client from the `shared` MFE. The client automatically handles:
- Authentication token injection
- Error handling
- Request/response interceptors

**TODO:** Replace mock data in Redux slices with actual API calls:
- `src/features/*/store/*Slice.ts` - Update `fetchXxx` thunks

## Styling

The MFE uses Material-UI (MUI) for component styling with:
- System sx prop for inline styles
- CSS modules for component-specific styles
- Global CSS for utility classes

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Deployment

The MFE can be deployed independently to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` directory to your hosting service
3. Update the remote URL in the shell application's webpack configuration

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_BFF_API_URL=http://localhost:5001
REACT_APP_ENV=development
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## Best Practices

- Keep components small and focused
- Use Redux for global state, local state for component-specific data
- Leverage shared components from the `shared` MFE
- Follow TypeScript strict mode
- Write unit tests for business logic
- Use meaningful commit messages

## Troubleshooting

### Module Federation Issues
- Ensure the shared MFE is running on port 3004
- Check webpack configuration for correct remote URLs
- Clear browser cache and rebuild

### State Management Issues
- Verify Redux DevTools extension is installed
- Check Redux Toolkit middleware configuration
- Ensure reducers are properly registered in rootReducer

### API Issues
- Verify BFF API is running on the correct port
- Check authentication token in localStorage
- Review API client interceptors

## Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Material-UI Documentation](https://mui.com)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [TypeScript Documentation](https://www.typescriptlang.org)

## License

This project is part of the Logistics Marketplace platform and is proprietary.

## Support

For issues or questions, please contact the frontend team or create an issue in the project repository.

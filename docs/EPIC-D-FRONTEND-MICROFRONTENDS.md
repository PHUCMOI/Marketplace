# Epic D: Frontend Workspace - Micro-frontends Architecture

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Module Federation Configuration](#module-federation-configuration)
- [Shell Application](#shell-application)
- [Microfrontend Applications](#microfrontend-applications)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Routing Strategy](#routing-strategy)
- [Styling Approach](#styling-approach)
- [Development Workflow](#development-workflow)
- [Building for Production](#building-for-production)
- [Deployment Strategy](#deployment-strategy)
- [Best Practices](#best-practices)

---

## Overview

### What is Microfrontend Architecture?

Microfrontend architecture extends the microservices concept to the frontend, allowing teams to build, test, and deploy features independently. Each microfrontend (MFE) is a self-contained application that can be developed and deployed separately while seamlessly integrating into a unified user experience.

### Why Microfrontends for LogisticsMarketplace?

1. **Team Autonomy**: Separate teams can work on Dispatcher, Carrier, and Shipper portals independently
2. **Technology Flexibility**: Each MFE can use different libraries or versions (within reason)
3. **Incremental Upgrades**: Upgrade one MFE at a time without affecting others
4. **Faster Deployments**: Deploy features without redeploying the entire frontend
5. **Scalability**: Scale development across multiple teams efficiently
6. **Isolation**: Bugs in one MFE don't crash the entire application

### Our Approach

We use **Webpack Module Federation** (not single-spa) to implement microfrontends. This provides:
- Runtime integration without iframe overhead
- Shared dependencies to reduce bundle size
- Type-safe integration with TypeScript
- Better performance than traditional approaches

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Shell Application                          │
│                     (Module Federation Host)                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  - Main Layout (Header, Footer, Navigation)                │    │
│  │  - Authentication & Authorization                          │    │
│  │  - Global Routing                                          │    │
│  │  - Error Boundaries                                        │    │
│  │  - Theme Provider                                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Runtime Loading via Module Federation:                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Dispatcher   │  │   Carrier    │  │   Shipper    │            │
│  │     MFE      │  │     MFE      │  │     MFE      │            │
│  │  (Remote 1)  │  │  (Remote 2)  │  │  (Remote 3)  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│         │                 │                 │                      │
│         └─────────────────┴─────────────────┘                      │
│                           │                                        │
│                  ┌────────▼────────┐                               │
│                  │   Shared MFE    │                               │
│                  │  - Components   │                               │
│                  │  - Utils        │                               │
│                  │  - API Clients  │                               │
│                  │  - Hooks        │                               │
│                  └─────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    BFF API Gateway    │
                    │   (Port 5001/5002)    │
                    └───────────────────────┘
```

### Communication Flow

```
User Request
    │
    ▼
Shell App (loads at http://localhost:3000)
    │
    ├─► Authentication Check
    │
    ├─► Route Matching
    │   │
    │   ├─► /dispatcher/* → Loads Dispatcher MFE (port 3001)
    │   ├─► /carrier/*    → Loads Carrier MFE (port 3002)
    │   └─► /shipper/*    → Loads Shipper MFE (port 3003)
    │
    └─► MFE Component Renders
        │
        └─► API Call via BFF Client (from Shared MFE)
            │
            └─► BFF API (http://localhost:5001/api/*)
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2+ | UI Framework |
| **TypeScript** | 5.0+ | Type Safety |
| **Webpack** | 5.88+ | Module Bundler |
| **Module Federation** | Webpack 5 Built-in | Microfrontend Integration |
| **Lerna** | 8.0+ | Monorepo Management |
| **npm Workspaces** | Built-in | Package Management |

### Supporting Libraries

| Library | Purpose |
|---------|---------|
| **React Router** v6 | Client-side routing |
| **Redux Toolkit** | State management |
| **RTK Query** | API data fetching & caching |
| **Material-UI (MUI)** v5 | UI Components |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client (BFF communication) |
| **React Hook Form** | Form management |
| **Zod** | Schema validation |
| **date-fns** | Date manipulation |
| **react-query** | Alternative to RTK Query (if needed) |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Unit testing |
| **React Testing Library** | Component testing |
| **Playwright** | E2E testing |
| **Storybook** | Component documentation |

---

## Project Structure

### Complete Folder Structure

```
src/Frontend/
├── package.json                 # Root package.json with workspaces
├── lerna.json                   # Lerna configuration
├── tsconfig.json                # Root TypeScript config
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore
│
└── packages/
    │
    ├── shell/                   # Shell Application (Host)
    │   ├── public/
    │   │   ├── index.html
    │   │   └── favicon.ico
    │   ├── src/
    │   │   ├── App.tsx
    │   │   ├── index.tsx
    │   │   ├── bootstrap.tsx    # Async bootstrap for Module Federation
    │   │   ├── routes/
    │   │   │   ├── AppRoutes.tsx
    │   │   │   └── ProtectedRoute.tsx
    │   │   ├── layout/
    │   │   │   ├── MainLayout.tsx
    │   │   │   ├── Header.tsx
    │   │   │   ├── Sidebar.tsx
    │   │   │   └── Footer.tsx
    │   │   ├── auth/
    │   │   │   ├── AuthProvider.tsx
    │   │   │   ├── useAuth.ts
    │   │   │   └── authService.ts
    │   │   ├── store/
    │   │   │   ├── store.ts
    │   │   │   └── rootReducer.ts
    │   │   ├── types/
    │   │   │   └── global.d.ts  # Module Federation types
    │   │   └── utils/
    │   │       └── loadRemoteModule.ts
    │   ├── webpack.config.js    # Webpack + Module Federation config
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── dispatcher-mfe/          # Dispatcher Microfrontend
    │   ├── public/
    │   │   └── index.html       # Standalone mode
    │   ├── src/
    │   │   ├── index.tsx        # Standalone entry
    │   │   ├── bootstrap.tsx
    │   │   ├── App.tsx
    │   │   ├── features/
    │   │   │   ├── listings/
    │   │   │   │   ├── ListingsPage.tsx
    │   │   │   │   ├── CreateListingPage.tsx
    │   │   │   │   ├── ListingDetailPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── ListingCard.tsx
    │   │   │   │   │   ├── ListingForm.tsx
    │   │   │   │   │   └── ListingFilters.tsx
    │   │   │   │   ├── hooks/
    │   │   │   │   │   └── useListings.ts
    │   │   │   │   └── store/
    │   │   │   │       └── listingsSlice.ts
    │   │   │   ├── bids/
    │   │   │   │   ├── BidsPage.tsx
    │   │   │   │   ├── BidReviewPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── BidCard.tsx
    │   │   │   │   │   └── BidComparison.tsx
    │   │   │   │   └── store/
    │   │   │   │       └── bidsSlice.ts
    │   │   │   ├── deals/
    │   │   │   │   ├── DealsPage.tsx
    │   │   │   │   ├── DealDetailPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   └── DealCard.tsx
    │   │   │   │   └── store/
    │   │   │   │       └── dealsSlice.ts
    │   │   │   └── dashboard/
    │   │   │       ├── DashboardPage.tsx
    │   │   │       └── components/
    │   │   │           ├── StatsCard.tsx
    │   │   │           └── RecentActivity.tsx
    │   │   ├── routes/
    │   │   │   └── DispatcherRoutes.tsx
    │   │   └── types/
    │   │       └── index.ts
    │   ├── webpack.config.js
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── carrier-mfe/             # Carrier Microfrontend
    │   ├── public/
    │   │   └── index.html
    │   ├── src/
    │   │   ├── index.tsx
    │   │   ├── bootstrap.tsx
    │   │   ├── App.tsx
    │   │   ├── features/
    │   │   │   ├── marketplace/
    │   │   │   │   ├── MarketplacePage.tsx
    │   │   │   │   ├── ListingDetailPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── AvailableListingCard.tsx
    │   │   │   │   │   ├── BidForm.tsx
    │   │   │   │   │   └── MapView.tsx
    │   │   │   │   └── store/
    │   │   │   │       └── marketplaceSlice.ts
    │   │   │   ├── my-bids/
    │   │   │   │   ├── MyBidsPage.tsx
    │   │   │   │   └── components/
    │   │   │   │       └── MyBidCard.tsx
    │   │   │   ├── fleet/
    │   │   │   │   ├── VehiclesPage.tsx
    │   │   │   │   ├── DriversPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── VehicleCard.tsx
    │   │   │   │   │   ├── VehicleForm.tsx
    │   │   │   │   │   ├── DriverCard.tsx
    │   │   │   │   │   └── DriverForm.tsx
    │   │   │   │   └── store/
    │   │   │   │       ├── vehiclesSlice.ts
    │   │   │   │       └── driversSlice.ts
    │   │   │   ├── dispatches/
    │   │   │   │   ├── DispatchesPage.tsx
    │   │   │   │   ├── DispatchDetailPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── DispatchCard.tsx
    │   │   │   │   │   └── DispatchTimeline.tsx
    │   │   │   │   └── store/
    │   │   │   │       └── dispatchesSlice.ts
    │   │   │   └── dashboard/
    │   │   │       ├── DashboardPage.tsx
    │   │   │       └── components/
    │   │   │           ├── RevenueChart.tsx
    │   │   │           └── ActiveLoads.tsx
    │   │   ├── routes/
    │   │   │   └── CarrierRoutes.tsx
    │   │   └── types/
    │   │       └── index.ts
    │   ├── webpack.config.js
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── shipper-mfe/             # Shipper Microfrontend (Future)
    │   ├── .gitkeep
    │   └── README.md            # Placeholder for future development
    │
    └── shared/                  # Shared Components & Utilities
        ├── src/
        │   ├── index.ts         # Main export
        │   ├── components/
        │   │   ├── ui/
        │   │   │   ├── Button.tsx
        │   │   │   ├── Input.tsx
        │   │   │   ├── Modal.tsx
        │   │   │   ├── Card.tsx
        │   │   │   ├── Table.tsx
        │   │   │   ├── Spinner.tsx
        │   │   │   └── Toast.tsx
        │   │   ├── forms/
        │   │   │   ├── FormField.tsx
        │   │   │   ├── DatePicker.tsx
        │   │   │   └── AddressInput.tsx
        │   │   └── layout/
        │   │       ├── Container.tsx
        │   │       └── Grid.tsx
        │   ├── hooks/
        │   │   ├── useApi.ts
        │   │   ├── useDebounce.ts
        │   │   ├── useLocalStorage.ts
        │   │   └── usePermissions.ts
        │   ├── api/
        │   │   ├── client.ts         # Axios instance
        │   │   ├── endpoints/
        │   │   │   ├── listings.ts
        │   │   │   ├── bids.ts
        │   │   │   ├── deals.ts
        │   │   │   ├── dispatches.ts
        │   │   │   ├── vehicles.ts
        │   │   │   └── drivers.ts
        │   │   └── types/
        │   │       └── responses.ts
        │   ├── utils/
        │   │   ├── formatters.ts     # Date, currency, etc.
        │   │   ├── validators.ts
        │   │   ├── constants.ts
        │   │   └── helpers.ts
        │   ├── types/
        │   │   ├── index.ts
        │   │   ├── domain.ts         # Domain types
        │   │   └── api.ts            # API types
        │   └── styles/
        │       ├── theme.ts          # MUI theme
        │       └── globalStyles.css
        ├── webpack.config.js
        ├── package.json
        └── tsconfig.json
```

---

## Module Federation Configuration

### Concept

Module Federation allows multiple separate builds to form a single application. Each build acts as a container and can consume or expose modules from other containers.

**Key Terms:**
- **Host**: The shell application that loads remote modules
- **Remote**: Individual MFEs that expose modules
- **Shared**: Dependencies shared between host and remotes
- **Expose**: Modules a remote makes available
- **Remotes**: External modules the host can load

### Shell (Host) Configuration

**`packages/shell/webpack.config.js`**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        dispatcher: 'dispatcher@http://localhost:3001/remoteEntry.js',
        carrier: 'carrier@http://localhost:3002/remoteEntry.js',
        shipper: 'shipper@http://localhost:3003/remoteEntry.js',
        shared: 'shared@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        '@mui/material': {
          singleton: true,
          requiredVersion: deps['@mui/material'],
        },
        '@reduxjs/toolkit': {
          singleton: true,
          requiredVersion: deps['@reduxjs/toolkit'],
        },
        'react-redux': {
          singleton: true,
          requiredVersion: deps['react-redux'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    publicPath: 'http://localhost:3000/',
    clean: true,
  },
};
```

### Dispatcher MFE (Remote) Configuration

**`packages/dispatcher-mfe/webpack.config.js`**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dispatcher',
      filename: 'remoteEntry.js',
      exposes: {
        './DispatcherApp': './src/App.tsx',
        './DispatcherRoutes': './src/routes/DispatcherRoutes.tsx',
        './DashboardPage': './src/features/dashboard/DashboardPage.tsx',
      },
      remotes: {
        shared: 'shared@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        '@mui/material': {
          singleton: true,
          requiredVersion: deps['@mui/material'],
        },
        '@reduxjs/toolkit': {
          singleton: true,
        },
        'react-redux': {
          singleton: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    publicPath: 'http://localhost:3001/',
    clean: true,
  },
};
```

### Carrier MFE Configuration

**`packages/carrier-mfe/webpack.config.js`**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    port: 3002,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'carrier',
      filename: 'remoteEntry.js',
      exposes: {
        './CarrierApp': './src/App.tsx',
        './CarrierRoutes': './src/routes/CarrierRoutes.tsx',
        './DashboardPage': './src/features/dashboard/DashboardPage.tsx',
      },
      remotes: {
        shared: 'shared@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
        },
        '@mui/material': {
          singleton: true,
          requiredVersion: deps['@mui/material'],
        },
        '@reduxjs/toolkit': {
          singleton: true,
        },
        'react-redux': {
          singleton: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    publicPath: 'http://localhost:3002/',
    clean: true,
  },
};
```

### Shared MFE Configuration

**`packages/shared/webpack.config.js`**

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devServer: {
    port: 3004,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shared',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/components/index.ts',
        './hooks': './src/hooks/index.ts',
        './api': './src/api/index.ts',
        './utils': './src/utils/index.ts',
        './types': './src/types/index.ts',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
        '@mui/material': {
          singleton: true,
          requiredVersion: deps['@mui/material'],
        },
      },
    }),
  ],
  output: {
    publicPath: 'http://localhost:3004/',
    clean: true,
  },
};
```

### TypeScript Type Definitions

**`packages/shell/src/types/global.d.ts`**

```typescript
declare module 'dispatcher/DispatcherApp' {
  const DispatcherApp: React.ComponentType;
  export default DispatcherApp;
}

declare module 'dispatcher/DispatcherRoutes' {
  const DispatcherRoutes: React.ComponentType;
  export default DispatcherRoutes;
}

declare module 'carrier/CarrierApp' {
  const CarrierApp: React.ComponentType;
  export default CarrierApp;
}

declare module 'carrier/CarrierRoutes' {
  const CarrierRoutes: React.ComponentType;
  export default CarrierRoutes;
}

declare module 'shared/components' {
  export * from '@shared/components';
}

declare module 'shared/hooks' {
  export * from '@shared/hooks';
}

declare module 'shared/api' {
  export * from '@shared/api';
}

declare module 'shared/utils' {
  export * from '@shared/utils';
}
```

---

## Shell Application

### Bootstrap Pattern

Module Federation requires asynchronous loading. Use the bootstrap pattern:

**`packages/shell/src/index.tsx`**

```typescript
// This file is the entry point, it just imports the async bootstrap
import('./bootstrap');
```

**`packages/shell/src/bootstrap.tsx`**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Main App Component

**`packages/shell/src/App.tsx`**

```typescript
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './auth/AuthProvider';
import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import theme from 'shared/styles/theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
```

### Routing Configuration

**`packages/shell/src/routes/AppRoutes.tsx`**

```typescript
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { Spinner } from 'shared/components';

// Lazy load MFE routes
const DispatcherRoutes = lazy(() => import('dispatcher/DispatcherRoutes'));
const CarrierRoutes = lazy(() => import('carrier/CarrierRoutes'));
// const ShipperRoutes = lazy(() => import('shipper/ShipperRoutes'));

const LoginPage = lazy(() => import('../pages/LoginPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dispatcher" replace />} />
          
          {/* Dispatcher Routes */}
          <Route
            path="/dispatcher/*"
            element={
              <ProtectedRoute roles={['Dispatcher', 'Admin']}>
                <DispatcherRoutes />
              </ProtectedRoute>
            }
          />
          
          {/* Carrier Routes */}
          <Route
            path="/carrier/*"
            element={
              <ProtectedRoute roles={['Carrier', 'Admin']}>
                <CarrierRoutes />
              </ProtectedRoute>
            }
          />
          
          {/* Shipper Routes (Future) */}
          {/* <Route
            path="/shipper/*"
            element={
              <ProtectedRoute roles={['Shipper', 'Admin']}>
                <ShipperRoutes />
              </ProtectedRoute>
            }
          /> */}
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
```

### Protected Route Component

**`packages/shell/src/routes/ProtectedRoute.tsx`**

```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Spinner } from 'shared/components';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Main Layout

**`packages/shell/src/layout/MainLayout.tsx`**

```typescript
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? '240px' : 0,
          transition: 'margin 0.3s',
        }}
      >
        <Outlet />
      </Box>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;
```

### Authentication Provider

**`packages/shell/src/auth/AuthProvider.tsx`**

```typescript
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      navigate('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Microfrontend Applications

### Dispatcher MFE

The Dispatcher MFE provides functionality for logistics dispatchers to manage listings, review bids, and accept deals.

#### Routes

**`packages/dispatcher-mfe/src/routes/DispatcherRoutes.tsx`**

```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import ListingsPage from '../features/listings/ListingsPage';
import CreateListingPage from '../features/listings/CreateListingPage';
import ListingDetailPage from '../features/listings/ListingDetailPage';
import BidsPage from '../features/bids/BidsPage';
import BidReviewPage from '../features/bids/BidReviewPage';
import DealsPage from '../features/deals/DealsPage';
import DealDetailPage from '../features/deals/DealDetailPage';

const DispatcherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      
      <Route path="listings">
        <Route index element={<ListingsPage />} />
        <Route path="new" element={<CreateListingPage />} />
        <Route path=":id" element={<ListingDetailPage />} />
      </Route>
      
      <Route path="bids">
        <Route index element={<BidsPage />} />
        <Route path=":id" element={<BidReviewPage />} />
      </Route>
      
      <Route path="deals">
        <Route index element={<DealsPage />} />
        <Route path=":id" element={<DealDetailPage />} />
      </Route>
    </Routes>
  );
};

export default DispatcherRoutes;
```

#### Dashboard Page Example

**`packages/dispatcher-mfe/src/features/dashboard/DashboardPage.tsx`**

```typescript
import React, { useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardStats } from './store/dashboardSlice';
import { StatsCard } from './components/StatsCard';
import { RecentActivity } from './components/RecentActivity';
import { Spinner } from 'shared/components';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dispatcher Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Listings"
            value={stats?.activeListings || 0}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Bids"
            value={stats?.pendingBids || 0}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Deals"
            value={stats?.activeDeals || 0}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed Today"
            value={stats?.completedToday || 0}
            color="info"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <RecentActivity />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardPage;
```

#### Listings Page Example

**`packages/dispatcher-mfe/src/features/listings/ListingsPage.tsx`**

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useListings } from './hooks/useListings';
import { ListingCard } from './components/ListingCard';
import { ListingFilters } from './components/ListingFilters';
import { Spinner } from 'shared/components';

const ListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { listings, isLoading, fetchListings } = useListings();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchListings(filters);
  }, [filters]);

  const handleCreateListing = () => {
    navigate('/dispatcher/listings/new');
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Listings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateListing}
        >
          Create Listing
        </Button>
      </Box>

      <ListingFilters filters={filters} onFilterChange={setFilters} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {listings.map((listing) => (
          <Grid item xs={12} md={6} lg={4} key={listing.id}>
            <ListingCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListingsPage;
```

---

### Carrier MFE

The Carrier MFE enables carriers to browse available loads, place bids, and manage their fleet.

#### Routes

**`packages/carrier-mfe/src/routes/CarrierRoutes.tsx`**

```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import MarketplacePage from '../features/marketplace/MarketplacePage';
import ListingDetailPage from '../features/marketplace/ListingDetailPage';
import MyBidsPage from '../features/my-bids/MyBidsPage';
import VehiclesPage from '../features/fleet/VehiclesPage';
import DriversPage from '../features/fleet/DriversPage';
import DispatchesPage from '../features/dispatches/DispatchesPage';
import DispatchDetailPage from '../features/dispatches/DispatchDetailPage';

const CarrierRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="marketplace" element={<MarketplacePage />} />
      <Route path="marketplace/:id" element={<ListingDetailPage />} />
      <Route path="my-bids" element={<MyBidsPage />} />
      
      <Route path="fleet">
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="drivers" element={<DriversPage />} />
      </Route>
      
      <Route path="dispatches">
        <Route index element={<DispatchesPage />} />
        <Route path=":id" element={<DispatchDetailPage />} />
      </Route>
    </Routes>
  );
};

export default CarrierRoutes;
```

#### Marketplace Page Example

**`packages/carrier-mfe/src/features/marketplace/MarketplacePage.tsx`**

```typescript
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useMarketplace } from './hooks/useMarketplace';
import { AvailableListingCard } from './components/AvailableListingCard';
import { MapView } from './components/MapView';
import { Spinner } from 'shared/components';

const MarketplacePage: React.FC = () => {
  const { availableListings, isLoading, fetchAvailableListings } = useMarketplace();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchAvailableListings();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Available Loads</Typography>
        <Button onClick={() => setShowMap(!showMap)}>
          {showMap ? 'List View' : 'Map View'}
        </Button>
      </Box>

      {showMap ? (
        <MapView listings={availableListings} />
      ) : (
        <Grid container spacing={3}>
          {availableListings.map((listing) => (
            <Grid item xs={12} md={6} lg={4} key={listing.id}>
              <AvailableListingCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MarketplacePage;
```

---

### Shared MFE

The Shared MFE contains reusable components, utilities, and API clients.

#### Component Export

**`packages/shared/src/components/index.ts`**

```typescript
// UI Components
export { Button } from './ui/Button';
export { Input } from './ui/Input';
export { Modal } from './ui/Modal';
export { Card } from './ui/Card';
export { Table } from './ui/Table';
export { Spinner } from './ui/Spinner';
export { Toast } from './ui/Toast';

// Form Components
export { FormField } from './forms/FormField';
export { DatePicker } from './forms/DatePicker';
export { AddressInput } from './forms/AddressInput';

// Layout Components
export { Container } from './layout/Container';
export { Grid } from './layout/Grid';
```

#### API Client Example

**`packages/shared/src/api/client.ts`**

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BFF_API_URL = process.env.REACT_APP_BFF_API_URL || 'http://localhost:5001';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BFF_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

#### API Endpoints

**`packages/shared/src/api/endpoints/listings.ts`**

```typescript
import { apiClient } from '../client';
import { ApiResponse, ListingResponse, CreateListingRequest } from '../types/responses';

export const listingsApi = {
  getAll: async (): Promise<ApiResponse<ListingResponse[]>> => {
    return apiClient.get<ApiResponse<ListingResponse[]>>('/api/listings');
  },

  getById: async (id: string): Promise<ApiResponse<ListingResponse>> => {
    return apiClient.get<ApiResponse<ListingResponse>>(`/api/listings/${id}`);
  },

  create: async (data: CreateListingRequest): Promise<ApiResponse<ListingResponse>> => {
    return apiClient.post<ApiResponse<ListingResponse>>('/api/listings', data);
  },

  update: async (id: string, data: Partial<CreateListingRequest>): Promise<ApiResponse<ListingResponse>> => {
    return apiClient.put<ApiResponse<ListingResponse>>(`/api/listings/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/api/listings/${id}`);
  },
};
```

---

## State Management

### Redux Toolkit Setup

**`packages/shell/src/store/store.ts`**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**`packages/shell/src/store/rootReducer.ts`**

```typescript
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // MFEs will inject their own reducers
});

export default rootReducer;
```

### Feature Slice Example

**`packages/dispatcher-mfe/src/features/listings/store/listingsSlice.ts`**

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listingsApi } from 'shared/api';
import { ListingResponse } from 'shared/types';

interface ListingsState {
  listings: ListingResponse[];
  currentListing: ListingResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  listings: [],
  currentListing: null,
  isLoading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listings');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchListingById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listing');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/createListing',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await listingsApi.create(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create listing');
    }
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearCurrentListing: (state) => {
      state.currentListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all listings
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action: PayloadAction<ListingResponse[]>) => {
        state.isLoading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch listing by ID
      .addCase(fetchListingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action: PayloadAction<ListingResponse>) => {
        state.isLoading = false;
        state.currentListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create listing
      .addCase(createListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action: PayloadAction<ListingResponse>) => {
        state.isLoading = false;
        state.listings.unshift(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentListing } = listingsSlice.actions;
export default listingsSlice.reducer;
```

---

## API Integration

### Using API Clients in Components

**Example: Fetching listings with hooks**

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchListings } from './store/listingsSlice';

export const useListings = () => {
  const dispatch = useAppDispatch();
  const { listings, isLoading, error } = useAppSelector((state) => state.listings);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  return {
    listings,
    isLoading,
    error,
    refetch: () => dispatch(fetchListings()),
  };
};
```

### Authentication Headers

All API calls automatically include the JWT token via the axios interceptor in `packages/shared/src/api/client.ts`.

### Error Handling

```typescript
import { toast } from 'shared/components';

const handleCreateListing = async (data: any) => {
  try {
    await dispatch(createListing(data)).unwrap();
    toast.success('Listing created successfully');
    navigate('/dispatcher/listings');
  } catch (error: any) {
    toast.error(error || 'Failed to create listing');
  }
};
```

---

## Routing Strategy

### Nested Routes in MFEs

Each MFE manages its own routes using React Router. The shell provides the base path (e.g., `/dispatcher/*`) and the MFE handles sub-routes.

**Shell routing:**
```
/dispatcher/* → Loads Dispatcher MFE
/carrier/*    → Loads Carrier MFE
```

**Dispatcher MFE internal routes:**
```
/dispatcher/dashboard
/dispatcher/listings
/dispatcher/listings/new
/dispatcher/listings/:id
/dispatcher/bids
/dispatcher/deals
```

### Navigation Between MFEs

Use React Router's `Link` or `useNavigate`:

```typescript
import { Link, useNavigate } from 'react-router-dom';

// Using Link
<Link to="/carrier/marketplace">Browse Loads</Link>

// Using navigate
const navigate = useNavigate();
navigate('/dispatcher/listings/new');
```

### Deep Linking

All routes support deep linking. Users can bookmark or share URLs like:
```
http://localhost:3000/dispatcher/listings/123
http://localhost:3000/carrier/marketplace
```

---

## Styling Approach

### Material-UI (MUI) Theme

**`packages/shared/src/styles/theme.ts`**

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#e33371',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
```

### Tailwind CSS Integration

**`tailwind.config.js`** (at workspace root)

```javascript
module.exports = {
  content: [
    './packages/*/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#dc004e',
      },
    },
  },
  plugins: [],
};
```

### CSS Modules

For component-specific styles:

```typescript
// ListingCard.module.css
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}
```

```typescript
import styles from './ListingCard.module.css';

export const ListingCard = ({ listing }) => (
  <div className={styles.card}>
    <h3 className={styles.title}>{listing.title}</h3>
  </div>
);
```

---

## Development Workflow

### Initial Setup

```bash
# Navigate to frontend folder
cd src/Frontend

# Install dependencies
npm install

# Bootstrap all packages with Lerna
npx lerna bootstrap
```

### Running Individual MFEs

```bash
# Run shell only
cd packages/shell
npm start
# Runs on http://localhost:3000

# Run dispatcher MFE standalone
cd packages/dispatcher-mfe
npm start
# Runs on http://localhost:3001

# Run carrier MFE standalone
cd packages/carrier-mfe
npm start
# Runs on http://localhost:3002

# Run shared MFE
cd packages/shared
npm start
# Runs on http://localhost:3004
```

### Running All MFEs Together

**From the root Frontend folder:**

```bash
npm start
```

This uses Lerna to run all packages in parallel.

### Package.json Scripts

**`packages/shell/package.json`**

```json
{
  "name": "@logistics/shell",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.1",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.1.6",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
    "ts-loader": "^9.4.4",
    "html-webpack-plugin": "^5.5.3",
    "css-loader": "^6.8.1",
    "style-loader": "^3.3.3"
  }
}
```

### Hot Module Replacement (HMR)

All MFEs support HMR for instant feedback during development:

```javascript
// webpack.config.js
devServer: {
  hot: true,
  historyApiFallback: true,
}
```

### TypeScript Compilation

```bash
# Check types across all packages
npx lerna run type-check

# Or for individual package
cd packages/dispatcher-mfe
npm run type-check
```

---

## Building for Production

### Production Build Commands

```bash
# Build all packages
npm run build

# Or use Lerna
npx lerna run build
```

### Production Webpack Configuration

**Key optimizations:**

```javascript
// webpack.config.js (production)
module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: process.env.PUBLIC_URL || '/',
    clean: true,
  },
};
```

### Environment Variables

**`.env.production`**

```
REACT_APP_BFF_API_URL=https://api.logistics.com
REACT_APP_ENV=production
```

### Build Output

Each MFE builds to its own `dist` folder:

```
packages/shell/dist/
├── index.html
├── main.[hash].js
├── vendors.[hash].js
└── remoteEntry.js

packages/dispatcher-mfe/dist/
├── index.html
├── main.[hash].js
└── remoteEntry.js
```

---

## Deployment Strategy

### Independent Deployment

Each MFE can be deployed independently to different URLs:

**Production URLs:**
```
Shell:      https://app.logistics.com
Dispatcher: https://dispatcher.logistics.com
Carrier:    https://carrier.logistics.com
Shared:     https://shared.logistics.com
```

### Module Federation Remote URLs

Update `webpack.config.js` for production:

```javascript
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    dispatcher: 'dispatcher@https://dispatcher.logistics.com/remoteEntry.js',
    carrier: 'carrier@https://carrier.logistics.com/remoteEntry.js',
    shared: 'shared@https://shared.logistics.com/remoteEntry.js',
  },
  // ...
}),
```

### Dynamic Remote Loading

For more flexibility, load remotes dynamically:

**`packages/shell/src/utils/loadRemoteModule.ts`**

```typescript
const loadRemoteModule = async (remoteName: string, moduleName: string) => {
  const remoteUrl = process.env[`REACT_APP_${remoteName.toUpperCase()}_URL`];
  
  // @ts-ignore
  await __webpack_init_sharing__('default');
  const container = window[remoteName];
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(moduleName);
  return factory();
};

export default loadRemoteModule;
```

### CI/CD Pipeline

**GitHub Actions workflow example:**

```yaml
name: Deploy Dispatcher MFE

on:
  push:
    branches: [main]
    paths:
      - 'src/Frontend/packages/dispatcher-mfe/**'

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd src/Frontend
          npm install
      
      - name: Build
        run: |
          cd src/Frontend/packages/dispatcher-mfe
          npm run build
        env:
          REACT_APP_BFF_API_URL: ${{ secrets.BFF_API_URL }}
      
      - name: Deploy to S3
        run: |
          aws s3 sync src/Frontend/packages/dispatcher-mfe/dist s3://dispatcher-mfe-bucket --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} --paths "/*"
```

### Docker Deployment

**`packages/shell/Dockerfile`**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shell/package*.json ./packages/shell/

# Install dependencies
RUN npm ci

# Copy source
COPY packages/shell ./packages/shell

# Build
WORKDIR /app/packages/shell
RUN npm run build

# Production image
FROM nginx:alpine

COPY --from=builder /app/packages/shell/dist /usr/share/nginx/html
COPY packages/shell/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## Best Practices

### 1. Shared Dependencies

**✅ DO:**
- Share React, ReactDOM, React Router as singletons
- Share UI libraries (MUI) to avoid duplication
- Use exact version matching for shared dependencies

**❌ DON'T:**
- Share too many dependencies (only share what's necessary)
- Mix different versions of React across MFEs

**Example:**
```javascript
shared: {
  react: {
    singleton: true,
    requiredVersion: deps.react,
    eager: true, // Load immediately in host
  },
  'react-dom': {
    singleton: true,
    requiredVersion: deps['react-dom'],
    eager: true,
  },
  '@mui/material': {
    singleton: true, // Avoid duplicate MUI instances
    requiredVersion: deps['@mui/material'],
  },
}
```

### 2. Version Management

**Use Lerna for coordinated releases:**

```bash
# Update all packages to a new version
npx lerna version minor

# Publish all packages
npx lerna publish
```

**Package versioning strategy:**
- **Independent versioning**: Each MFE has its own version
- **Fixed versioning**: All packages share the same version (simpler)

### 3. Communication Between MFEs

**✅ Recommended approaches:**

**a) Shared State (Redux store):**
```typescript
// Shell provides the Redux store
// MFEs inject their reducers dynamically
import { injectReducer } from 'shared/store';

injectReducer('listings', listingsReducer);
```

**b) Custom Events:**
```typescript
// MFE A dispatches event
window.dispatchEvent(new CustomEvent('listing-created', { detail: listing }));

// MFE B listens
window.addEventListener('listing-created', (event) => {
  console.log('New listing:', event.detail);
});
```

**c) Shared Context:**
```typescript
// In Shared MFE
export const ListingContext = createContext();

// MFEs consume the context
const { currentListing } = useContext(ListingContext);
```

**❌ Avoid:**
- Direct imports between MFEs (breaks independence)
- Global variables (hard to debug)
- Tight coupling

### 4. Error Boundaries

**Wrap each MFE in an error boundary:**

```typescript
// packages/shell/src/components/MFEErrorBoundary.tsx
import React from 'react';

class MFEErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MFE Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong loading this module</h2>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MFEErrorBoundary;
```

**Use it:**
```typescript
<MFEErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <DispatcherRoutes />
  </Suspense>
</MFEErrorBoundary>
```

### 5. Performance Optimization

**Code splitting:**
```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

**Memoization:**
```typescript
const MemoizedCard = React.memo(ListingCard);
```

**Avoid re-renders:**
```typescript
const { listings } = useAppSelector(
  (state) => state.listings,
  shallowEqual // Prevent unnecessary re-renders
);
```

### 6. Testing Strategy

**Unit tests (Jest + RTL):**
```typescript
import { render, screen } from '@testing-library/react';
import ListingCard from './ListingCard';

test('renders listing card', () => {
  const listing = { id: '1', title: 'Test Load' };
  render(<ListingCard listing={listing} />);
  expect(screen.getByText('Test Load')).toBeInTheDocument();
});
```

**Integration tests:**
```typescript
test('can create a listing', async () => {
  render(<CreateListingPage />);
  
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'New Load' },
  });
  
  fireEvent.click(screen.getByText('Create'));
  
  await waitFor(() => {
    expect(screen.getByText('Listing created')).toBeInTheDocument();
  });
});
```

**E2E tests (Playwright):**
```typescript
test('dispatcher can create listing', async ({ page }) => {
  await page.goto('http://localhost:3000/dispatcher/listings/new');
  await page.fill('[name="title"]', 'Test Load');
  await page.click('button:has-text("Create")');
  await expect(page).toHaveURL(/\/dispatcher\/listings\/\d+/);
});
```

### 7. Type Safety

**Share types between MFEs:**

```typescript
// packages/shared/src/types/domain.ts
export interface Listing {
  id: string;
  title: string;
  origin: Address;
  destination: Address;
  pickupDate: Date;
  deliveryDate: Date;
  status: ListingStatus;
}
```

**Import in MFEs:**
```typescript
import { Listing } from 'shared/types';
```

### 8. Monitoring & Logging

**Implement logging:**
```typescript
// packages/shared/src/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // Send to monitoring service (e.g., Sentry)
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking service
  },
};
```

---

## Summary

This epic establishes a robust, scalable microfrontend architecture using:

- **Webpack Module Federation** for runtime integration
- **Lerna + npm workspaces** for monorepo management
- **React + TypeScript** for type-safe development
- **Redux Toolkit** for predictable state management
- **Material-UI** for consistent UI components
- **Independent deployment** for team autonomy

### Key Benefits

1. **Scalability**: Teams can work independently on different MFEs
2. **Flexibility**: Each MFE can evolve at its own pace
3. **Performance**: Code splitting and lazy loading reduce initial bundle size
4. **Maintainability**: Clear boundaries between features
5. **Deployability**: Deploy features without full application deployment

### Next Steps

1. Set up the monorepo structure
2. Configure Module Federation for each MFE
3. Implement the Shell application with routing
4. Build out Dispatcher and Carrier MFEs
5. Create shared component library
6. Implement authentication flow
7. Set up CI/CD pipelines
8. Deploy to staging environment

---

**For questions or contributions, please refer to the main project README or contact the frontend team lead.**
# Shell Application

Module Federation HOST application for LogisticsMarketplace.

## Overview

The Shell application serves as the Module Federation host that orchestrates and loads all micro-frontend applications (Shipper MFE, Carrier MFE, and Dispatcher MFE). It provides the main application layout, navigation, routing, and shared components.

## Features

- **Module Federation Host**: Dynamically loads remote micro-frontends
- **Unified Navigation**: Centralized navigation and routing
- **Layout System**: Consistent header, navigation, and footer
- **Error Boundaries**: Graceful error handling for micro-frontends
- **Loading States**: Suspense-based loading indicators
- **Responsive Design**: Mobile-first responsive layout
- **TypeScript**: Full type safety

## Architecture

```
shell/
├── src/
│   ├── components/        # Shared components
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingFallback.tsx
│   ├── pages/            # Shell-owned pages
│   │   ├── HomePage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── routes/           # Routing configuration
│   │   └── AppRouter.tsx
│   ├── styles/           # CSS stylesheets
│   ├── types/            # TypeScript declarations
│   ├── App.tsx
│   ├── bootstrap.tsx
│   └── index.tsx
├── public/
│   └── index.html
├── webpack.config.js     # Module Federation config
├── tsconfig.json
└── package.json
```

## Module Federation Configuration

The shell is configured as a HOST that consumes three remote micro-frontends:

- **shipperMfe**: `http://localhost:3001/remoteEntry.js`
- **carrierMfe**: `http://localhost:3002/remoteEntry.js`
- **dispatcherMfe**: `http://localhost:3003/remoteEntry.js`

### Shared Dependencies

- React 18.2+ (singleton)
- React-DOM 18.2+ (singleton)
- React-Router-DOM 6+ (singleton)

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The shell will start on `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Routes

- `/` - Home page
- `/shipper/*` - Shipper micro-frontend (lazy loaded)
- `/carrier/*` - Carrier micro-frontend (lazy loaded)
- `/dispatcher/*` - Dispatcher micro-frontend (lazy loaded)
- `/profile` - User profile page
- `*` - 404 Not Found page

## Components

### Layout

Main application layout with header, navigation, and footer.

### Navigation

Role-based navigation menu with active route highlighting.

### ErrorBoundary

Catches and displays errors from micro-frontends gracefully.

### LoadingFallback

Displays loading spinner while micro-frontends are being loaded.

## Styling

The application uses vanilla CSS with CSS custom properties (variables) for theming:

- Modular CSS files per component/page
- CSS variables for consistent theming
- Responsive design with mobile-first approach

## TypeScript

Full TypeScript support with strict mode enabled:

- Type declarations for remote modules
- Strict null checks
- No implicit any
- Component props typing

## Error Handling

- Error boundaries for micro-frontend isolation
- Graceful fallback UI
- Detailed error information in development
- Error logging for debugging

## Performance

- Code splitting with React lazy
- Suspense boundaries for loading states
- Webpack optimization (minification, tree-shaking)
- Module Federation for optimal bundle sharing

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- No IE11 support

## Contributing

1. Follow the established code structure
2. Use TypeScript for all new components
3. Add CSS modules for styling
4. Test error boundaries and loading states
5. Ensure responsive design

## License

MIT
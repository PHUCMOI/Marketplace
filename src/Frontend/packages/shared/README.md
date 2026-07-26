# @logistics-marketplace/shared

Shared utilities, components, and services for LogisticsMarketplace micro-frontends.

## Installation

```bash
npm install @logistics-marketplace/shared
```

## Usage

### Components

```typescript
import { Button, Card, Input, Table } from '@logistics-marketplace/shared';

function MyComponent() {
  return (
    <Card>
      <Input label="Name" placeholder="Enter name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Hooks

```typescript
import { useApi, useDebounce, usePagination } from '@logistics-marketplace/shared';

function MyComponent() {
  const { data, loading, error, execute } = useApi(listingService.getAll);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const pagination = usePagination({ totalItems: 100, initialPageSize: 10 });
}
```

### Services

```typescript
import { authService, listingService, bidService } from '@logistics-marketplace/shared';

// Authentication
await authService.login({ email, password });
const user = await authService.getCurrentUser();

// Listings
const listings = await listingService.getAll({ pageNumber: 1, pageSize: 10 });
const listing = await listingService.getById(id);

// Bids
const bids = await bidService.getByListing(listingId);
await bidService.create({ listingId, proposedPrice: { amount: 1000, currency: 'USD' } });
```

### Utils

```typescript
import { formatCurrency, formatDate, isValidEmail } from '@logistics-marketplace/shared';

formatCurrency(1000, 'USD'); // "$1,000.00"
formatDate(new Date(), 'MMM dd, yyyy'); // "Jul 22, 2026"
isValidEmail('test@example.com'); // true
```

### Types

```typescript
import type { User, Listing, Bid, ApiResponse } from '@logistics-marketplace/shared';
import { ListingStatus, UserRole } from '@logistics-marketplace/shared';
```

## Features

- **Reusable UI Components**: Button, Card, Input, Select, Modal, Table, Badge, Alert
- **Custom Hooks**: API calls, debouncing, local storage, pagination
- **API Services**: Authentication, listings, bids, deals with TypeScript support
- **Type Definitions**: Complete TypeScript types for all domain entities
- **Utility Functions**: Formatting, validation, storage helpers
- **Constants**: API endpoints, routes, status colors

## License

MIT
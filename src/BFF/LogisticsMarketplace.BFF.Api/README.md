# Logistics Marketplace BFF API

Backend-for-Frontend (BFF) API layer for the Logistics Marketplace application.

## Overview

The BFF layer acts as an API gateway and orchestration layer between the frontend applications and the Service API. It provides:

- **API Aggregation**: Combines multiple Service API calls into single endpoints
- **Data Transformation**: Transforms Service API responses for frontend consumption
- **Authentication**: JWT-based authentication
- **Resilience**: Retry and circuit breaker patterns using Polly
- **CORS**: Configured for frontend origins

## Architecture

```
Frontend Apps
     ↓
  BFF API (this project)
     ↓
  Service API
     ↓
  Database
```

## Endpoints

### Listings
- `GET /api/listings` - Get all open listings
- `GET /api/listings/{id}` - Get listing details with bids
- `POST /api/listings` - Create new listing
- `POST /api/listings/{id}/award` - Award listing to bid

### Bids
- `GET /api/bids/listing/{listingId}` - Get bids for a listing
- `POST /api/bids` - Place a bid
- `DELETE /api/bids/{id}` - Withdraw bid

### Deals
- `GET /api/deals/carrier` - Get deals for carrier
- `GET /api/deals/shipper` - Get deals for shipper
- `GET /api/deals/{id}` - Get deal details

### Dispatches
- `GET /api/dispatches/carrier` - Get dispatches for carrier
- `POST /api/dispatches` - Create dispatch
- `POST /api/dispatches/{id}/assign` - Assign vehicle/driver
- `PATCH /api/dispatches/{id}/status` - Update status

### Vehicles
- `GET /api/vehicles` - Get vehicles for organization
- `POST /api/vehicles` - Create vehicle

### Drivers
- `GET /api/drivers` - Get drivers for organization
- `POST /api/drivers` - Create driver

## Configuration

Update `appsettings.json` with your settings:

```json
{
  "ServiceApi": {
    "BaseUrl": "http://localhost:5000"
  },
  "Jwt": {
    "Secret": "your-secret-key",
    "Issuer": "LogisticsMarketplace.BFF",
    "Audience": "LogisticsMarketplace",
    "ExpiryMinutes": 60
  }
}
```

## Running the Application

```bash
cd src/BFF/LogisticsMarketplace.BFF.Api
dotnet run
```

The API will be available at:
- HTTP: http://localhost:5001
- HTTPS: https://localhost:7001
- Swagger: https://localhost:7001/swagger

## Features

### Resilience with Polly

The BFF uses Polly for resilient HTTP communication:
- **Retry Policy**: 3 retries with exponential backoff
- **Circuit Breaker**: Opens after 5 consecutive failures

### Authentication

JWT Bearer token authentication is required for all endpoints (except health checks).

### Health Checks

- `GET /health` - Health check endpoint

### Logging

Structured logging with different levels:
- Request/Response logging
- Error logging
- Performance metrics

## Development

### Adding New Endpoints

1. Create request/response models in `Models/`
2. Add method to `IServiceApiClient` interface
3. Implement method in `ServiceApiClient`
4. Create controller action
5. Update documentation

### Testing

Use Swagger UI for manual testing or tools like Postman.

## Docker

Build and run with Docker:

```bash
docker build -t logistics-bff-api .
docker run -p 5001:80 logistics-bff-api
```

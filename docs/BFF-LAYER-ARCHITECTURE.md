# BFF (Backend-for-Frontend) Layer Architecture

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Testing](#testing)

---

## Overview

### What is BFF?

The **Backend-for-Frontend (BFF)** pattern is an architectural approach where a dedicated backend service is created specifically to serve the needs of a particular frontend application. In the Logistics Marketplace system, the BFF layer acts as an intermediary between the frontend microfrontends and the backend service layer.

### Why BFF Exists

1. **Separation of Concerns**: Decouples frontend requirements from core business logic
2. **API Aggregation**: Combines multiple service calls into single frontend-friendly endpoints
3. **Protocol Translation**: Transforms backend responses into frontend-optimized formats
4. **Security**: Adds an additional security layer between public-facing frontend and internal services
5. **Performance**: Reduces chattiness by aggregating multiple backend calls
6. **Frontend-Specific Logic**: Handles UI-specific transformations without polluting domain services
7. **Resilience**: Implements retry policies, circuit breakers, and graceful degradation

### Key Responsibilities

- **API Gateway**: Routes frontend requests to appropriate backend services
- **Data Transformation**: Converts domain models to UI-friendly DTOs
- **Error Handling**: Provides consistent error responses to frontend
- **Authentication & Authorization**: Validates JWT tokens and enforces access control
- **Caching**: (Future) Implements response caching for performance
- **Rate Limiting**: (Future) Protects backend services from excessive requests

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Shell MFE  │  │Dispatcher MFE│  │  Carrier MFE │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/REST
                            │ (Port 5001)
┌───────────────────────────▼─────────────────────────────────────┐
│                      BFF Layer (This Layer)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              LogisticsMarketplace.BFF.Api                  │ │
│  │                                                            │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │ │
│  │  │ Controllers │  │  Middleware  │  │  HTTP Client    │    │ │
│  │  │             │  │              │  │  (Polly +       │    │ │
│  │  │ - Listings  │  │ - Exception  │  │   Resilience)   │    │ │
│  │  │ - Bids      │  │ - Logging    │  │                 │    │ │
│  │  │ - Deals     │  │ - Auth       │  │                 │    │ │
│  │  │ - Dispatches│  │ - CORS       │  │                 │    │ │
│  │  │ - Vehicles  │  │              │  │                 │    │ │
│  │  │ - Drivers   │  │              │  │                 │    │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘    │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              Response Models (DTOs)                  │  │ │
│  │  │  ApiResponse<T>, ListingResponse, BidResponse, etc.  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
                            │ (Port 5000)
┌───────────────────────────▼─────────────────────────────────────┐
│                     Service Layer                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          LogisticsMarketplace.Service.Api                  │ │
│  │                                                            │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │ │
│  │  │ Controllers │  │  Application │  │   Domain        │    │ │
│  │  │             │  │  Services    │  │   Entities      │    │ │
│  │  │ - Listings  │  │              │  │                 │    │ │
│  │  │ - Bids      │  │ - Business   │  │ - Listing       │    │ │
│  │  │ - Deals     │  │   Logic      │  │ - Bid           │    │ │
│  │  │ - Dispatches│  │ - Validation │  │ - Deal          │    │ │
│  │  │ - Vehicles  │  │              │  │ - Dispatch      │    │ │
│  │  │ - Drivers   │  │              │  │ - Vehicle       │    │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘    │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │            Infrastructure Layer                      │  │ │
│  │  │  - EF Core DbContext                                 │  │ │
│  │  │  - Repositories                                      │  │ │
│  │  │  - Database (PostgreSQL)                             │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

Communication Flow:
1. Frontend makes HTTP request to BFF (e.g., GET /api/listings)
2. BFF authenticates request and applies middleware
3. BFF forwards request to Service API with resilience policies
4. Service API processes business logic and returns domain DTOs
5. BFF transforms response to frontend-friendly format
6. BFF returns ApiResponse<T> wrapper to frontend
```

---

## Project Structure

### Complete File Listing

```
src/BFF/
└── LogisticsMarketplace.BFF.Api/
    ├── Controllers/
    │   ├── ListingsController.cs       # Manages freight listings
    │   ├── BidsController.cs           # Handles bid placement and management
    │   ├── DealsController.cs          # Deal acceptance and tracking
    │   ├── DispatchesController.cs     # Dispatch operations and tracking
    │   ├── VehiclesController.cs       # Vehicle fleet management
    │   └── DriversController.cs        # Driver management
    │
    ├── Models/
    │   ├── ApiResponse.cs              # Generic API response wrapper
    │   ├── ListingResponse.cs          # Listing data transfer object
    │   ├── BidResponse.cs              # Bid data transfer object
    │   ├── DealResponse.cs             # Deal data transfer object
    │   ├── DispatchResponse.cs         # Dispatch data transfer object
    │   ├── VehicleResponse.cs          # Vehicle data transfer object
    │   └── DriverResponse.cs           # Driver data transfer object
    │
    ├── Services/
    │   ├── IServiceApiClient.cs        # Service API client interface
    │   └── ServiceApiClient.cs         # HTTP client with Polly resilience
    │
    ├── Middleware/
    │   ├── ExceptionHandlingMiddleware.cs  # Global error handling
    │   └── RequestLoggingMiddleware.cs     # Request/response logging
    │
    ├── Properties/
    │   └── launchSettings.json         # Development launch configuration
    │
    ├── LogisticsMarketplace.BFF.Api.csproj  # Project file
    ├── Program.cs                      # Application entry point
    ├── appsettings.json                # Production configuration
    ├── appsettings.Development.json    # Development configuration
    ├── .gitignore                      # Git ignore patterns
    └── README.md                       # Project-specific documentation
```

### File Purposes

#### Controllers

- **ListingsController**: Exposes endpoints for creating, searching, and managing freight listings
- **BidsController**: Handles bid placement, retrieval, and withdrawal operations
- **DealsController**: Manages deal acceptance, listing, and status updates
- **DispatchesController**: Controls dispatch creation, tracking, and completion
- **VehiclesController**: Provides vehicle fleet management capabilities
- **DriversController**: Manages driver assignments and availability

#### Models

- **ApiResponse<T>**: Standardized response wrapper with success/error states
- **Response DTOs**: Frontend-optimized data structures for each domain entity

#### Services

- **ServiceApiClient**: Encapsulates all HTTP communication with the backend service layer, including:
  - HTTP client factory integration
  - Polly retry and circuit breaker policies
  - Request/response serialization
  - Error handling and mapping

#### Middleware

- **ExceptionHandlingMiddleware**: Catches unhandled exceptions and returns consistent error responses
- **RequestLoggingMiddleware**: Logs all incoming requests and outgoing responses for debugging

---

## Key Features

### 1. **Resilience Patterns (Polly Integration)**

The BFF implements multiple resilience patterns to ensure robust communication with backend services:

#### Retry Policy
```csharp
// Retries failed requests up to 3 times with exponential backoff
services.AddHttpClient<IServiceApiClient, ServiceApiClient>()
    .AddTransientHttpErrorPolicy(policy => 
        policy.WaitAndRetryAsync(3, retryAttempt => 
            TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))));
```

**Benefits:**
- Handles transient failures (network glitches, temporary service unavailability)
- Exponential backoff prevents overwhelming recovering services
- Configurable retry count and delay strategies

#### Circuit Breaker Pattern
```csharp
// Opens circuit after 5 consecutive failures, stays open for 30 seconds
services.AddHttpClient<IServiceApiClient, ServiceApiClient>()
    .AddTransientHttpErrorPolicy(policy => 
        policy.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));
```

**Benefits:**
- Prevents cascading failures
- Allows backend services time to recover
- Fast-fails when service is known to be down
- Automatic recovery testing after timeout period

### 2. **Authentication & Authorization**

```csharp
// JWT Bearer token authentication
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.Authority = "https://your-auth-server";
        options.Audience = "logistics-marketplace-api";
    });

// Controllers are protected with [Authorize] attribute
[Authorize]
public class ListingsController : ControllerBase
```

**Features:**
- JWT token validation on all endpoints
- Role-based access control (RBAC) ready
- Integration with external identity providers (Auth0, Azure AD, etc.)

### 3. **CORS Configuration**

```csharp
// Allows frontend applications to communicate with BFF
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://app.logistics.com")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});
```

**Features:**
- Configurable allowed origins
- Supports credentials (cookies, auth headers)
- Environment-specific policies (dev vs. production)

### 4. **Structured Logging**

```csharp
// Request logging middleware captures all traffic
public class RequestLoggingMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation("HTTP {Method} {Path} started", 
            context.Request.Method, 
            context.Request.Path);
        
        await _next(context);
        
        _logger.LogInformation("HTTP {Method} {Path} completed with {StatusCode}", 
            context.Request.Method, 
            context.Request.Path, 
            context.Response.StatusCode);
    }
}
```

**Features:**
- Request/response logging
- Performance monitoring
- Error tracking
- Integration-ready for Application Insights, Serilog, etc.

### 5. **Consistent API Responses**

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
}
```

**Benefits:**
- Predictable response structure for frontend
- Simplified error handling in UI
- Clear success/failure states
- Structured error messages

### 6. **Health Checks**

```csharp
// Built-in health check endpoint
app.MapHealthChecks("/health");
```

**Features:**
- Service availability monitoring
- Integration with orchestrators (Kubernetes, Docker Swarm)
- Custom health check implementations (database, external APIs)

---

## API Endpoints

### Base URL
- **Development**: `https://localhost:5001`
- **Production**: `https://bff.logistics-marketplace.com`

### Authentication
All endpoints require a valid JWT Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

### **Listings API**

#### 1. Get All Active Listings
```http
GET /api/listings
```

**Response:**
```json
{
  "success": true,
  "message": "Listings retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "dispatcherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "origin": "Hanoi, Vietnam",
      "destination": "Ho Chi Minh City, Vietnam",
      "cargoType": "Electronics",
      "weight": 5000.0,
      "volume": 20.0,
      "pickupDate": "2026-07-25T08:00:00Z",
      "deliveryDate": "2026-07-27T17:00:00Z",
      "price": 5000000.0,
      "currency": "VND",
      "status": "Active",
      "createdAt": "2026-07-22T10:30:00Z"
    }
  ],
  "errors": null
}
```

#### 2. Get Listing by ID
```http
GET /api/listings/{id}
```

**Parameters:**
- `id` (UUID) - Listing identifier

**Response:** Same structure as above, but single object in `data`

#### 3. Create New Listing
```http
POST /api/listings
Content-Type: application/json
```

**Request Body:**
```json
{
  "origin": "Hanoi, Vietnam",
  "destination": "Da Nang, Vietnam",
  "cargoType": "Consumer Goods",
  "weight": 3000.0,
  "volume": 15.0,
  "pickupDate": "2026-08-01T08:00:00Z",
  "deliveryDate": "2026-08-02T17:00:00Z",
  "price": 3000000.0,
  "currency": "VND"
}
```

**Response:** HTTP 201 Created with listing details

#### 4. Update Listing
```http
PUT /api/listings/{id}
Content-Type: application/json
```

**Request Body:** Same as Create

**Response:** HTTP 200 OK with updated listing

#### 5. Cancel Listing
```http
DELETE /api/listings/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing cancelled successfully",
  "data": null,
  "errors": null
}
```

---

### **Bids API**

#### 1. Get Bids for Listing
```http
GET /api/bids/listing/{listingId}
```

**Response:**
```json
{
  "success": true,
  "message": "Bids retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "listingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "carrierId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "proposedPrice": 4500000.0,
      "currency": "VND",
      "notes": "Can deliver 1 day earlier",
      "status": "Pending",
      "createdAt": "2026-07-22T11:00:00Z"
    }
  ],
  "errors": null
}
```

#### 2. Place Bid
```http
POST /api/bids
Content-Type: application/json
```

**Request Body:**
```json
{
  "listingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "proposedPrice": 4500000.0,
  "currency": "VND",
  "notes": "Experienced with fragile goods"
}
```

**Response:** HTTP 201 Created with bid details

#### 3. Withdraw Bid
```http
DELETE /api/bids/{id}
```

**Response:** HTTP 200 OK with success message

---

### **Deals API**

#### 1. Get All Deals for User
```http
GET /api/deals
```

**Query Parameters:**
- `status` (optional) - Filter by deal status (Pending, Confirmed, Completed, Cancelled)

**Response:**
```json
{
  "success": true,
  "message": "Deals retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "listingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "bidId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "dispatcherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "carrierId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "finalPrice": 4500000.0,
      "currency": "VND",
      "status": "Confirmed",
      "createdAt": "2026-07-22T12:00:00Z"
    }
  ],
  "errors": null
}
```

#### 2. Accept Bid (Create Deal)
```http
POST /api/deals
Content-Type: application/json
```

**Request Body:**
```json
{
  "bidId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Response:** HTTP 201 Created with deal details

#### 3. Update Deal Status
```http
PUT /api/deals/{id}/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Completed"
}
```

**Response:** HTTP 200 OK with updated deal

---

### **Dispatches API**

#### 1. Get All Dispatches
```http
GET /api/dispatches
```

**Query Parameters:**
- `status` (optional) - Filter by status (Scheduled, InTransit, Completed, Cancelled)

**Response:**
```json
{
  "success": true,
  "message": "Dispatches retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "dealId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "vehicleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "status": "InTransit",
      "scheduledPickupTime": "2026-07-25T08:00:00Z",
      "actualPickupTime": "2026-07-25T08:15:00Z",
      "scheduledDeliveryTime": "2026-07-27T17:00:00Z",
      "actualDeliveryTime": null,
      "currentLocation": "Da Nang, Vietnam",
      "createdAt": "2026-07-22T12:30:00Z"
    }
  ],
  "errors": null
}
```

#### 2. Create Dispatch
```http
POST /api/dispatches
Content-Type: application/json
```

**Request Body:**
```json
{
  "dealId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "vehicleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "scheduledPickupTime": "2026-07-25T08:00:00Z",
  "scheduledDeliveryTime": "2026-07-27T17:00:00Z"
}
```

**Response:** HTTP 201 Created with dispatch details

#### 3. Update Dispatch Status
```http
PUT /api/dispatches/{id}/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Completed",
  "actualDeliveryTime": "2026-07-27T16:45:00Z",
  "notes": "Delivered successfully"
}
```

**Response:** HTTP 200 OK with updated dispatch

---

### **Vehicles API**

#### 1. Get All Vehicles
```http
GET /api/vehicles
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "carrierId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "licensePlate": "29A-12345",
      "vehicleType": "Box Truck",
      "capacity": 5000.0,
      "status": "Available",
      "currentLocation": "Hanoi, Vietnam"
    }
  ],
  "errors": null
}
```

#### 2. Register Vehicle
```http
POST /api/vehicles
Content-Type: application/json
```

**Request Body:**
```json
{
  "licensePlate": "29A-12345",
  "vehicleType": "Box Truck",
  "capacity": 5000.0,
  "currentLocation": "Hanoi, Vietnam"
}
```

**Response:** HTTP 201 Created with vehicle details

---

### **Drivers API**

#### 1. Get All Drivers
```http
GET /api/drivers
```

**Response:**
```json
{
  "success": true,
  "message": "Drivers retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "carrierId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Nguyen Van A",
      "licenseNumber": "B2-123456789",
      "phoneNumber": "+84-912-345-678",
      "status": "Available"
    }
  ],
  "errors": null
}
```

#### 2. Register Driver
```http
POST /api/drivers
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nguyen Van A",
  "licenseNumber": "B2-123456789",
  "phoneNumber": "+84-912-345-678"
}
```

**Response:** HTTP 201 Created with driver details

---

## Configuration

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "System.Net.Http.HttpClient": "Information"
    }
  },
  "AllowedHosts": "*",
  "ServiceApi": {
    "BaseUrl": "https://api.logistics-marketplace.com",
    "Timeout": 30
  },
  "Resilience": {
    "RetryCount": 3,
    "CircuitBreakerFailureThreshold": 5,
    "CircuitBreakerDurationSeconds": 30
  },
  "Cors": {
    "AllowedOrigins": [
      "https://app.logistics-marketplace.com",
      "https://dispatcher.logistics-marketplace.com",
      "https://carrier.logistics-marketplace.com"
    ]
  },
  "Authentication": {
    "Authority": "https://auth.logistics-marketplace.com",
    "Audience": "logistics-marketplace-api",
    "RequireHttpsMetadata": true
  }
}
```

### appsettings.Development.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  },
  "ServiceApi": {
    "BaseUrl": "https://localhost:5000",
    "Timeout": 30
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002"
    ]
  },
  "Authentication": {
    "Authority": "https://localhost:5003",
    "Audience": "logistics-marketplace-api",
    "RequireHttpsMetadata": false
  }
}
```

### Environment Variables

Override configuration using environment variables:

```bash
# Service API Configuration
export ServiceApi__BaseUrl="https://api.logistics-marketplace.com"
export ServiceApi__Timeout="30"

# Authentication
export Authentication__Authority="https://auth.logistics-marketplace.com"
export Authentication__Audience="logistics-marketplace-api"

# CORS
export Cors__AllowedOrigins__0="https://app.logistics-marketplace.com"

# Database (if needed in future)
export ConnectionStrings__DefaultConnection="Server=localhost;Database=LogisticsMarketplace;User Id=sa;Password=YourPassword;"
```

---

## Running the Application

### Prerequisites

- **.NET 8 SDK** or later
- **Visual Studio 2022** / **VS Code** / **Rider**
- **Docker** (optional, for containerized deployment)
- **Backend Service API** running (default: https://localhost:5000)

### Local Development

#### 1. Using .NET CLI

```bash
# Navigate to BFF project directory
cd src/BFF/LogisticsMarketplace.BFF.Api

# Restore dependencies
dotnet restore

# Build project
dotnet build

# Run application
dotnet run
```

Application will start at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5001`

#### 2. Using Visual Studio

1. Open `LogisticsMarketplace.sln`
2. Set `LogisticsMarketplace.BFF.Api` as startup project
3. Press `F5` to run with debugging
4. Or `Ctrl+F5` to run without debugging

#### 3. Using Docker

```bash
# Build Docker image
docker build -t logistics-bff:latest -f src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile .

# Run container
docker run -d -p 5001:8080 \
  -e ServiceApi__BaseUrl="https://service-api:5000" \
  --name logistics-bff \
  logistics-bff:latest
```

### Using Docker Compose

Create `docker-compose.override.yml`:

```yaml
version: '3.8'

services:
  bff:
    build:
      context: .
      dockerfile: src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile
    ports:
      - "5001:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ServiceApi__BaseUrl=http://service-api:8080
      - Authentication__RequireHttpsMetadata=false
    depends_on:
      - service-api
    networks:
      - logistics-network

  service-api:
    build:
      context: .
      dockerfile: src/Service/LogisticsMarketplace.Service.Api/Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    networks:
      - logistics-network

networks:
  logistics-network:
    driver: bridge
```

Run with:
```bash
docker-compose up -d
```

### Verify Installation

#### Health Check
```bash
curl https://localhost:5001/health
```

Expected response: `Healthy`

#### Test Endpoint
```bash
# Get listings (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://localhost:5001/api/listings
```

---

## Development Guide

### Adding New Endpoints

#### Step 1: Create Response Model

Create a new file in `Models/` directory:

```csharp
// Models/NotificationResponse.cs
namespace LogisticsMarketplace.BFF.Api.Models;

public class NotificationResponse
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}
```

#### Step 2: Add Service Client Methods

Update `Services/IServiceApiClient.cs`:

```csharp
public interface IServiceApiClient
{
    // Existing methods...
    
    Task<List<NotificationResponse>> GetNotificationsAsync(CancellationToken cancellationToken);
    Task MarkNotificationAsReadAsync(Guid id, CancellationToken cancellationToken);
}
```

Implement in `Services/ServiceApiClient.cs`:

```csharp
public async Task<List<NotificationResponse>> GetNotificationsAsync(CancellationToken cancellationToken)
{
    var response = await _httpClient.GetAsync("/api/notifications", cancellationToken);
    response.EnsureSuccessStatusCode();
    
    var content = await response.Content.ReadAsStringAsync(cancellationToken);
    return JsonSerializer.Deserialize<List<NotificationResponse>>(content, _jsonOptions) 
        ?? new List<NotificationResponse>();
}

public async Task MarkNotificationAsReadAsync(Guid id, CancellationToken cancellationToken)
{
    var response = await _httpClient.PutAsync($"/api/notifications/{id}/read", null, cancellationToken);
    response.EnsureSuccessStatusCode();
}
```

#### Step 3: Create Controller

Create `Controllers/NotificationsController.cs`:

```csharp
using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IServiceApiClient _serviceApiClient;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(
        IServiceApiClient serviceApiClient, 
        ILogger<NotificationsController> logger)
    {
        _serviceApiClient = serviceApiClient;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NotificationResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<NotificationResponse>>>> GetNotifications(
        CancellationToken cancellationToken)
    {
        try
        {
            var notifications = await _serviceApiClient.GetNotificationsAsync(cancellationToken);
            return Ok(ApiResponse<List<NotificationResponse>>.SuccessResult(notifications));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching notifications");
            return StatusCode(500, ApiResponse<List<NotificationResponse>>.FailureResult("Failed to fetch notifications"));
        }
    }

    [HttpPut("{id}/read")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<object>>> MarkAsRead(
        Guid id, 
        CancellationToken cancellationToken)
    {
        try
        {
            await _serviceApiClient.MarkNotificationAsReadAsync(id, cancellationToken);
            return Ok(ApiResponse<object?>.SuccessResult(null, "Notification marked as read"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification {NotificationId} as read", id);
            return StatusCode(500, ApiResponse<object>.FailureResult("Failed to update notification"));
        }
    }
}
```

#### Step 4: Test Endpoint

```bash
# Test new endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://localhost:5001/api/notifications

# Mark as read
curl -X PUT \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://localhost:5001/api/notifications/3fa85f64-5717-4562-b3fc-2c963f66afa6/read
```

### Best Practices

1. **Always use ApiResponse<T> wrapper** for consistent responses
2. **Log all errors** with contextual information
3. **Use CancellationToken** for all async operations
4. **Validate input** before forwarding to service layer
5. **Handle exceptions gracefully** and return meaningful error messages
6. **Use DTOs** instead of domain entities
7. **Apply [Authorize] attribute** to protect endpoints
8. **Document with XML comments** for Swagger generation

---

## Deployment

### Production Checklist

- [ ] Update `appsettings.json` with production URLs
- [ ] Configure production authentication provider
- [ ] Set up HTTPS certificates
- [ ] Configure CORS for production domains
- [ ] Enable Application Insights / logging aggregation
- [ ] Set up health check monitoring
- [ ] Configure rate limiting
- [ ] Review and tune Polly resilience policies
- [ ] Enable response compression
- [ ] Set up API versioning (if needed)

### Docker Deployment

#### 1. Create Production Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/BFF/LogisticsMarketplace.BFF.Api/LogisticsMarketplace.BFF.Api.csproj", "src/BFF/LogisticsMarketplace.BFF.Api/"]
RUN dotnet restore "src/BFF/LogisticsMarketplace.BFF.Api/LogisticsMarketplace.BFF.Api.csproj"
COPY . .
WORKDIR "/src/src/BFF/LogisticsMarketplace.BFF.Api"
RUN dotnet build "LogisticsMarketplace.BFF.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LogisticsMarketplace.BFF.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LogisticsMarketplace.BFF.Api.dll"]
```

#### 2. Build and Push

```bash
# Build image
docker build -t logistics-bff:1.0.0 -f src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile .

# Tag for registry
docker tag logistics-bff:1.0.0 your-registry.azurecr.io/logistics-bff:1.0.0

# Push to registry
docker push your-registry.azurecr.io/logistics-bff:1.0.0
```

### Kubernetes Deployment

Create `k8s/bff-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: logistics-bff
  namespace: logistics-marketplace
spec:
  replicas: 3
  selector:
    matchLabels:
      app: logistics-bff
  template:
    metadata:
      labels:
        app: logistics-bff
    spec:
      containers:
      - name: bff
        image: your-registry.azurecr.io/logistics-bff:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        - name: ServiceApi__BaseUrl
          value: "http://logistics-service-api:8080"
        - name: Authentication__Authority
          valueFrom:
            configMapKeyRef:
              name: auth-config
              key: authority
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: logistics-bff
  namespace: logistics-marketplace
spec:
  selector:
    app: logistics-bff
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f k8s/bff-deployment.yaml
```

### Azure App Service Deployment

```bash
# Create App Service
az webapp create \
  --resource-group logistics-rg \
  --plan logistics-plan \
  --name logistics-bff \
  --runtime "DOTNET|8.0"

# Configure settings
az webapp config appsettings set \
  --resource-group logistics-rg \
  --name logistics-bff \
  --settings ServiceApi__BaseUrl="https://api.logistics.com"

# Deploy
az webapp deployment source config-zip \
  --resource-group logistics-rg \
  --name logistics-bff \
  --src logistics-bff.zip
```

---

## Testing

### Manual Testing with cURL

#### 1. Get Access Token
```bash
# Example with Auth0
curl -X POST https://your-auth0-domain/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "audience": "logistics-marketplace-api",
    "grant_type": "client_credentials"
  }'
```

#### 2. Test Endpoints

```bash
# Store token
export TOKEN="your-jwt-token"

# Get listings
curl -H "Authorization: Bearer $TOKEN" \
  https://localhost:5001/api/listings

# Create listing
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Hanoi",
    "destination": "HCMC",
    "cargoType": "Electronics",
    "weight": 1000,
    "volume": 10,
    "pickupDate": "2026-08-01T08:00:00Z",
    "deliveryDate": "2026-08-03T17:00:00Z",
    "price": 2000000,
    "currency": "VND"
  }' \
  https://localhost:5001/api/listings
```

### Postman Collection

Import this collection for comprehensive testing:

```json
{
  "info": {
    "name": "Logistics Marketplace BFF",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Listings",
      "item": [
        {
          "name": "Get All Listings",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/listings"
          }
        },
        {
          "name": "Create Listing",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/listings",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"origin\": \"Hanoi\",\n  \"destination\": \"HCMC\",\n  \"cargoType\": \"Electronics\",\n  \"weight\": 1000,\n  \"volume\": 10,\n  \"pickupDate\": \"2026-08-01T08:00:00Z\",\n  \"deliveryDate\": \"2026-08-03T17:00:00Z\",\n  \"price\": 2000000,\n  \"currency\": \"VND\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://localhost:5001"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

### Integration Tests (Future)

Create test project:

```bash
dotnet new xunit -n LogisticsMarketplace.BFF.Integration.Tests
```

Example test:

```csharp
public class ListingsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ListingsControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetListings_ReturnsSuccessStatusCode()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", "test-token");

        // Act
        var response = await _client.GetAsync("/api/listings");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"success\":true", content);
    }
}
```

### Load Testing

Use Apache Bench or k6:

```bash
# Apache Bench
ab -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" \
  https://localhost:5001/api/listings

# k6
k6 run --vus 10 --duration 30s load-test.js
```

`load-test.js`:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const params = {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
    },
  };

  const response = http.get('https://localhost:5001/api/listings', params);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## Troubleshooting

### Common Issues

#### 1. 401 Unauthorized
- **Cause**: Missing or invalid JWT token
- **Solution**: Ensure `Authorization: Bearer <token>` header is present and token is valid

#### 2. CORS Errors
- **Cause**: Frontend origin not in allowed list
- **Solution**: Add frontend URL to `Cors:AllowedOrigins` in appsettings.json

#### 3. 503 Service Unavailable
- **Cause**: Backend service API is down or circuit breaker is open
- **Solution**: Check backend service health, wait for circuit breaker to reset

#### 4. Timeout Errors
- **Cause**: Backend service is slow or unresponsive
- **Solution**: Increase `ServiceApi:Timeout` in configuration, check backend performance

---

## Future Enhancements

- [ ] **Response Caching**: Implement Redis caching for frequently accessed data
- [ ] **Rate Limiting**: Add rate limiting per user/IP
- [ ] **API Versioning**: Support multiple API versions
- [ ] **GraphQL Support**: Add GraphQL endpoint for flexible querying
- [ ] **WebSocket Support**: Real-time notifications for bid updates
- [ ] **API Gateway Integration**: Integrate with Azure API Management or Kong
- [ ] **Metrics & Monitoring**: Add Prometheus metrics and Grafana dashboards
- [ ] **Request Validation**: FluentValidation for request DTOs
- [ ] **Pagination**: Implement cursor-based pagination for large datasets
- [ ] **Compression**: Enable response compression (Gzip/Brotli)

---

## Conclusion

The BFF layer serves as a critical abstraction between frontend applications and backend services, providing resilience, security, and a frontend-optimized API surface. This architecture enables independent evolution of frontend and backend components while maintaining a stable contract.

For questions or issues, please refer to the main project README or contact the development team.

**Last Updated**: July 22, 2026  
**Version**: 1.0.0  
**Maintainers**: Logistics Marketplace Development Team
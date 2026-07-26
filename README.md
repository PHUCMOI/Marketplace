# Logistics Marketplace

A freight marketplace connecting shippers, carriers, and dispatchers.

## Business flow

1. A shipper creates and publishes a `Listing`.
2. Carriers submit `Bid`s for an open listing.
3. The shipper awards one pending bid. The listing and bid are closed and a `Deal` is created atomically.
4. The carrier creates a `Dispatch`, assigns an available vehicle and driver, then moves it through pickup, transit, and delivery.
5. Delivery completes the deal and releases the assigned fleet resources.

The API supports the `Shipper`, `Carrier`, `Dispatcher`, `Broker`, and `Admin` roles. Organization ownership is enforced for private data and mutations. Administrator accounts cannot be self-registered.

## Architecture

The Core Service follows DDD and Clean Architecture:

- `Domain`: aggregate roots, value objects, domain invariants, and aggregate-specific repository contracts. It has no EF Core dependency.
- `Application`: use cases, DTOs, ports, transaction boundaries, and orchestration across aggregates.
- `Infrastructure`: EF Core mappings, repository implementations, Unit of Work, migrations, and password hashing.
- `Service.Api`: HTTP/JWT adapter, authorization, claims, and Problem Details error mapping.
- `BFF.Api`: frontend response envelope, Core API aggregation, authorization forwarding, and resilience policies.
- `Frontend`: React/TypeScript micro-frontends using a single shared typed SDK.

Main aggregate roots are `Listing`, `Bid`, `Deal`, `Dispatch`, `Vehicle`, `Driver`, `Organization`, `User`, `Location`, and `Order`. References between aggregates are IDs rather than ORM navigation graphs.

## Stack

- .NET 8, C# 12, ASP.NET Core
- Entity Framework Core 8, PostgreSQL/Npgsql
- JWT bearer authentication and PBKDF2 password hashing
- React 18, TypeScript, Redux Toolkit
- Webpack 5 Module Federation, Lerna, npm workspaces
- xUnit

## Local development without Docker

Prerequisites:

- .NET 8 SDK
- Node.js 18+ and npm 9+
- A local PostgreSQL instance on `localhost:5432`

The default local database is `logistics_db` with user/password `postgres`. Override `ConnectionStrings__DefaultConnection` instead of committing a real credential. Development uses a local-only JWT key; production must provide `Jwt__Secret` through environment configuration.

```powershell
# From repository root
dotnet restore
dotnet tool restore
dotnet tool run dotnet-ef database update `
  --project src\Service\LogisticsMarketplace.Service.Infrastructure\LogisticsMarketplace.Service.Infrastructure.csproj `
  --startup-project src\Service\LogisticsMarketplace.Service.Api\LogisticsMarketplace.Service.Api.csproj

# Terminal 1: Core API on http://localhost:5000
dotnet run --project src\Service\LogisticsMarketplace.Service.Api\LogisticsMarketplace.Service.Api.csproj --launch-profile LogisticsMarketplace.Service.Api

# Terminal 2: BFF on http://localhost:5001
dotnet run --project src\BFF\LogisticsMarketplace.BFF.Api\LogisticsMarketplace.BFF.Api.csproj --launch-profile http

# Terminal 3: shell + three remotes
Set-Location src\Frontend
npm install
npm start
```

Frontend endpoints:

- Shell: `http://localhost:3000`
- Dispatcher remote: `http://localhost:3001`
- Carrier remote: `http://localhost:3002`
- Shipper remote: `http://localhost:3003`

Register a non-admin account from `/register`, then sign in from `/login`.

## Verification

```powershell
# Backend Release build and domain tests
dotnet build LogisticsMarketplace.sln -c Release
dotnet test LogisticsMarketplace.sln

# Validate the EF model against the checked-in migration
dotnet tool run dotnet-ef migrations has-pending-model-changes `
  --project src\Service\LogisticsMarketplace.Service.Infrastructure\LogisticsMarketplace.Service.Infrastructure.csproj `
  --startup-project src\Service\LogisticsMarketplace.Service.Api\LogisticsMarketplace.Service.Api.csproj

# Frontend typecheck and production bundles
Set-Location src\Frontend
npx lerna run type-check --stream
npm run build
```

## Repository layout

```text
src/
  Service/
    LogisticsMarketplace.Service.Domain/
    LogisticsMarketplace.Service.Application/
    LogisticsMarketplace.Service.Infrastructure/
    LogisticsMarketplace.Service.Api/
  BFF/
    LogisticsMarketplace.BFF.Api/
  Frontend/packages/
    shared/
    shell/
    shipper-mfe/
    carrier-mfe/
    dispatcher-mfe/
tests/
  LogisticsMarketplace.Service.Integration.Tests/
```

Docker artifacts remain in the repository but are not required by the local workflow above.
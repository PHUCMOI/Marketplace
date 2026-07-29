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
- single-spa 6, React 18, Webpack 5, Lerna, npm workspaces
- xUnit

## Run locally without Docker (Windows PowerShell)

Run every command below from the repository root unless a step says to open a new terminal. Do not start the frontend from the repository root; its workspace is in `src\Frontend`.

### 1. Install and verify prerequisites

- .NET 8 SDK
- Node.js 18+ and npm 9+
- PostgreSQL listening on `localhost:5432`

```powershell
dotnet --version
node --version
npm.cmd --version
Test-NetConnection localhost -Port 5432
```

`TcpTestSucceeded` must be `True`. If it is `False`, start PostgreSQL from Windows Services before continuing.

The checked-in development configuration expects:

```text
Host: localhost
Port: 5432
Database: logistics_db
Username: postgres
Password: postgres
```

If your PostgreSQL username or password is different, set the connection string in every PowerShell terminal that runs EF migrations or the Core API:

```powershell
$env:ConnectionStrings__DefaultConnection = 'Host=localhost;Port=5432;Database=logistics_db;Username=YOUR_USER;Password=YOUR_PASSWORD'
```

Do not commit a real password. The development JWT key is local-only; production must provide `Jwt__Secret` through environment configuration.

### 2. Restore backend tools and packages

```powershell
dotnet restore LogisticsMarketplace.sln
dotnet tool restore
```

### 3. Create and migrate the local database

Keep the Core API stopped while applying migrations:

```powershell
dotnet tool run dotnet-ef database update `
  --project src\Service\LogisticsMarketplace.Service.Infrastructure\LogisticsMarketplace.Service.Infrastructure.csproj `
  --startup-project src\Service\LogisticsMarketplace.Service.Api\LogisticsMarketplace.Service.Api.csproj
```

A successful run creates or updates `logistics_db` and ends without an exception. This step is required: PostgreSQL may be reachable while the application still fails with `database "logistics_db" does not exist`.

If the PostgreSQL account cannot create databases, create `logistics_db` in pgAdmin first, or use `psql` when it is available on `PATH`:

```powershell
$env:PGPASSWORD = 'postgres'
psql -h localhost -U postgres -d postgres -c 'CREATE DATABASE logistics_db;'
Remove-Item Env:PGPASSWORD
```

Then run the EF migration command again.

### 4. Start the Core Service

Open terminal 1 at the repository root:

```powershell
dotnet run `
  --project src\Service\LogisticsMarketplace.Service.Api\LogisticsMarketplace.Service.Api.csproj `
  --launch-profile LogisticsMarketplace.Service.Api
```

Wait for the application to listen on `http://localhost:5000`, then verify it from another terminal:

```powershell
curl.exe -i http://localhost:5000/health
```

Expected status: `HTTP/1.1 200 OK`.

### 5. Start the BFF

Open terminal 2 at the repository root:

```powershell
dotnet run `
  --project src\BFF\LogisticsMarketplace.BFF.Api\LogisticsMarketplace.BFF.Api.csproj `
  --launch-profile http
```

The BFF calls the Core Service at `http://localhost:5000`. Verify the BFF:

```powershell
curl.exe -i http://localhost:5001/health
```

Expected status: `HTTP/1.1 200 OK`.

### 6. Install and start all microfrontends

Open terminal 3 at the repository root. Run `install` the first time and whenever dependencies change:

```powershell
Set-Location src\Frontend
npm.cmd install
npm.cmd start
```

`npm.cmd start` starts the single-spa shell and all three independently deployable bundle servers in the same terminal:

| Application | URL | Usage |
| --- | --- | --- |
| Shell | `http://localhost:3000` | Main entry point; use this URL |
| Dispatcher bundle | `http://localhost:3001/dispatcher-mfe.js` | Loaded and mounted by the shell |
| Carrier bundle | `http://localhost:3002/carrier-mfe.js` | Loaded and mounted by the shell |
| Shipper bundle | `http://localhost:3003/shipper-mfe.js` | Loaded and mounted by the shell |

Open only `http://localhost:3000` for normal use. The remote ports are not separate user-facing applications.

Each MFE is a `System.register` bundle that exposes `bootstrap`, `mount`, and `unmount`. The shell resolves its module name through the import map in `packages/shell/public/index.html`:

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "@logistics-marketplace/shipper-mfe": "https://cdn.example.com/shipper-mfe.js",
      "@logistics-marketplace/carrier-mfe": "https://cdn.example.com/carrier-mfe.js",
      "@logistics-marketplace/dispatcher-mfe": "https://cdn.example.com/dispatcher-mfe.js"
    }
  }
</script>
```

Run `localStorage.setItem('devtools', 'true')` and reload the shell to show the import-map-overrides panel. Navigating away from `/shipper`, `/carrier`, or `/dispatcher` invokes that bundle's `unmount` lifecycle; SystemJS keeps the downloaded module cached for later mounts.

### 7. Register and sign in

1. Open `http://localhost:3000/register`.
2. Register a non-admin `Shipper`, `Carrier`, or `Dispatcher` account.
3. Open `http://localhost:3000/login` and sign in.
4. The shell redirects to the microfrontend for the authenticated role.

Administrator accounts cannot be self-registered.

### 8. Confirm all local ports

```powershell
Get-NetTCPConnection -State Listen -LocalPort 3000,3001,3002,3003,5000,5001 `
  -ErrorAction SilentlyContinue |
  Sort-Object LocalPort |
  Select-Object LocalAddress,LocalPort,OwningProcess
```

All six ports should be present. Stop each application with `Ctrl+C` in its terminal.

### Vietnam address selection

The create-listing form loads the official 34 province-level administrative units from `GET /api/locations/vietnam-provinces`. Users select a province/city and enter a detailed pickup and delivery address; the Service API creates both `Location` records together with the listing, so no Location UUIDs or seed data are required.

### Troubleshooting

#### `database "logistics_db" does not exist`

Stop the Core API and repeat step 3. The `/health` endpoint is currently a process-level check and does not prove that PostgreSQL or the application schema is ready.

#### The main page is blank

Confirm that `npm.cmd start` is still running and that ports `3000` through `3003` are listening. Then check that these lifecycle bundles respond:

```powershell
curl.exe -I http://localhost:3001/dispatcher-mfe.js
curl.exe -I http://localhost:3002/carrier-mfe.js
curl.exe -I http://localhost:3003/shipper-mfe.js
```

Restart the frontend after rebuilding the shared package if a stale bundle is cached:

```powershell
Set-Location src\Frontend
npm.cmd run build --workspace packages/shared
npm.cmd start
```

#### Login or API requests fail

Check in this order:

1. PostgreSQL is reachable on `5432`.
2. The EF migration in step 3 completed successfully.
3. Core Service health responds on `5000`.
4. BFF health responds on `5001`.
5. The browser is using the shell at `http://localhost:3000`.

#### A port is already in use

Find its process without stopping unrelated applications:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 5000 |
  Select-Object LocalPort,OwningProcess
```

Replace `5000` with the conflicting port, identify the owning process, and stop only the application you intended to restart.

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
npx.cmd lerna run type-check --stream
npm.cmd run build
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

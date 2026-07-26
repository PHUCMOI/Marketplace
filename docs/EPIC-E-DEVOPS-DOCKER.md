
# Epic E: DevOps and Docker Setup

## 📋 Overview

This document details the containerization strategy and DevOps practices for the LogisticsMarketplace platform. Docker containers provide consistent, reproducible environments across development, staging, and production deployments.

### Goals
- **Consistency**: Identical environments across all stages
- **Isolation**: Services run independently with clear boundaries
- **Scalability**: Easy horizontal scaling of services
- **Portability**: Deploy anywhere Docker runs
- **Efficiency**: Optimized images with multi-stage builds

### Benefits
- Simplified onboarding for new developers
- Reduced "works on my machine" issues
- Faster deployment cycles
- Better resource utilization
- Easier rollback and disaster recovery

---

## 🐳 Docker Strategy

### Multi-Stage Builds
We use multi-stage Docker builds to:
- Separate build-time and runtime dependencies
- Minimize final image size
- Improve security by excluding build tools from production images
- Speed up builds with layer caching

### Container Optimization
- Use official base images (Alpine, Debian Slim)
- Minimize layers by combining RUN commands
- Leverage Docker layer caching
- Use `.dockerignore` to exclude unnecessary files
- Run containers as non-root users
- Implement health checks for all services

---

## 📝 Complete Dockerfile Examples

### Service API Dockerfile

Create this file at `src/Service/LogisticsMarketplace.Service.Api/Dockerfile`:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files for better caching
COPY ["Directory.Build.props", "./"]
COPY ["src/Service/LogisticsMarketplace.Service.Api/LogisticsMarketplace.Service.Api.csproj", "src/Service/LogisticsMarketplace.Service.Api/"]
COPY ["src/Service/LogisticsMarketplace.Service.Application/LogisticsMarketplace.Service.Application.csproj", "src/Service/LogisticsMarketplace.Service.Application/"]
COPY ["src/Service/LogisticsMarketplace.Service.Domain/LogisticsMarketplace.Service.Domain.csproj", "src/Service/LogisticsMarketplace.Service.Domain/"]
COPY ["src/Service/LogisticsMarketplace.Service.Infrastructure/LogisticsMarketplace.Service.Infrastructure.csproj", "src/Service/LogisticsMarketplace.Service.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "src/Service/LogisticsMarketplace.Service.Api/LogisticsMarketplace.Service.Api.csproj"

# Copy remaining source code
COPY . .

# Build the application
WORKDIR "/src/src/Service/LogisticsMarketplace.Service.Api"
RUN dotnet build "LogisticsMarketplace.Service.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "LogisticsMarketplace.Service.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy published application
COPY --from=publish /app/publish .

# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point
ENTRYPOINT ["dotnet", "LogisticsMarketplace.Service.Api.dll"]
```

### BFF API Dockerfile

Create this file at `src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile`:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["Directory.Build.props", "./"]
COPY ["src/BFF/LogisticsMarketplace.BFF.Api/LogisticsMarketplace.BFF.Api.csproj", "src/BFF/LogisticsMarketplace.BFF.Api/"]

# Restore dependencies
RUN dotnet restore "src/BFF/LogisticsMarketplace.BFF.Api/LogisticsMarketplace.BFF.Api.csproj"

# Copy remaining source code
COPY . .

# Build the application
WORKDIR "/src/src/BFF/LogisticsMarketplace.BFF.Api"
RUN dotnet build "LogisticsMarketplace.BFF.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "LogisticsMarketplace.BFF.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy published application
COPY --from=publish /app/publish .

# Set ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point
ENTRYPOINT ["dotnet", "LogisticsMarketplace.BFF.Api.dll"]
```

### Frontend Dockerfile

Create this file at `src/Frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package.json lerna.json ./
COPY packages/shell/package.json ./packages/shell/
COPY packages/shipper-mfe/package.json ./packages/shipper-mfe/
COPY packages/carrier-mfe/package.json ./packages/carrier-mfe/
COPY packages/dispatcher-mfe/package.json ./packages/dispatcher-mfe/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm install
RUN npm install -g lerna
RUN lerna bootstrap

# Copy source code
COPY . .

# Build all packages
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY ops/docker/nginx.conf /etc/nginx/nginx.conf

# Copy built files from build stage
COPY --from=build /app/packages/shell/dist /usr/share/nginx/html/
COPY --from=build /app/packages/shipper-mfe/dist /usr/share/nginx/html/shipper
COPY --from=build /app/packages/carrier-mfe/dist /usr/share/nginx/html/carrier
COPY --from=build /app/packages/dispatcher-mfe/dist /usr/share/nginx/html/dispatcher

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -u 1001 -G appuser appuser && \
    chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration for Frontend

Create this file at `ops/docker/nginx.conf`:

```nginx
user appuser;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Main shell application
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Shipper MFE
        location /shipper {
            alias /usr/share/nginx/html/shipper;
            try_files $uri $uri/ /shipper/index.html;
        }

        # Carrier MFE
        location /carrier {
            alias /usr/share/nginx/html/carrier;
            try_files $uri $uri/ /carrier/index.html;
        }

        # Dispatcher MFE
        location /dispatcher {
            alias /usr/share/nginx/html/dispatcher;
            try_files $uri $uri/ /dispatcher/index.html;
        }

        # API proxy to BFF
        location /api {
            proxy_pass http://bff-api:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## 🐋 Docker Compose Configuration

### Development Docker Compose

The current `docker-compose.yml` file is configured for local development. Here's the complete configuration with all services enabled:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: logistics-postgres
    environment:
      POSTGRES_DB: logistics_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./ops/docker/init-db:/docker-entrypoint-initdb.d
    networks:
      - logistics-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: logistics-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@logistics.local
      PGADMIN_DEFAULT_PASSWORD: admin
      PGADMIN_CONFIG_SERVER_MODE: 'False'
      PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    networks:
      - logistics-network
    depends_on:
      - postgres
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: logistics-redis
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - logistics-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # Service API (Backend Core)
  service-api:
    build:
      context: .
      dockerfile: src/Service/LogisticsMarketplace.Service.Api/Dockerfile
    container_name: logistics-service-api
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://+:8080
      ConnectionStrings__DefaultConnection: Host=postgres;Port=5432;Database=logistics_db;Username=postgres;Password=postgres
      Redis__ConnectionString: redis:6379
    ports:
      - "5000:8080"
    networks:
      - logistics-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    volumes:
      - ./logs/service-api:/app/logs

  # BFF API (Backend-for-Frontend)
  bff-api:
    build:
      context: .
      dockerfile: src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile
    container_name: logistics-bff-api
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://+:8080
      ServiceApi__BaseUrl: http://service-api:8080
      Redis__ConnectionString: redis:6379
    ports:
      - "5001:8080"
    networks:
      - logistics-network
    depends_on:
      - service-api
      - redis
    restart: unless-stopped
    volumes:
      - ./logs/bff-api:/app/logs

  # Frontend Web Application
  web:
    build:
      context: ./src/Frontend
      dockerfile: Dockerfile
    container_name: logistics-web
    environment:
      NODE_ENV: production
    ports:
      - "3000:8080"
    networks:
      - logistics-network
    depends_on:
      - bff-api
    restart: unless-stopped

networks:
  logistics-network:
    driver: bridge
    name: logistics-network

volumes:
  postgres-data:
    driver: local
  pgadmin-data:
    driver: local
  redis-data:
    driver: local
```

### Production Docker Compose

Create this file at `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: logistics-postgres-prod
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - logistics-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: logistics-redis-prod
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - logistics-network
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  # Service API
  service-api:
    build:
      context: .
      dockerfile: src/Service/LogisticsMarketplace.Service.Api/Dockerfile
    container_name: logistics-service-api-prod
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ASPNETCORE_URLS: http://+:8080
      ConnectionStrings__DefaultConnection: ${SERVICE_DB_CONNECTION}
      Redis__ConnectionString: ${REDIS_CONNECTION}
      Jwt__Secret: ${JWT_SECRET}
      Jwt__Issuer: ${JWT_ISSUER}
      Jwt__Audience: ${JWT_AUDIENCE}
    networks:
      - logistics-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  # BFF API
  bff-api:
    build:
      context: .
      dockerfile: src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile
    container_name: logistics-bff-api-prod
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ASPNETCORE_URLS: http://+:8080
      ServiceApi__BaseUrl: ${SERVICE_API_URL}
      Redis__ConnectionString: ${REDIS_CONNECTION}
      Jwt__Secret: ${JWT_SECRET}
    networks:
      - logistics-network
    depends_on:
      - service-api
      - redis
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  # Frontend
  web:
    build:
      context: ./src/Frontend
      dockerfile: Dockerfile
      target: production
    container_name: logistics-web-prod
    networks:
      - logistics-network
    depends_on:
      - bff-api
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

  # Nginx Load Balancer
  nginx:
    image: nginx:alpine
    container_name: logistics-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ops/docker/nginx-prod.conf:/etc/nginx/nginx.conf:ro
      - ./ops/docker/ssl:/etc/nginx/ssl:ro
    networks:
      - logistics-network
    depends_on:
      - web
      - bff-api
    restart: always

networks:
  logistics-network:
    driver: bridge
    name: logistics-network-prod

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local
```

---

## 🗄️ Database Containerization

### PostgreSQL Initialization Scripts

Create database initialization scripts at `ops/docker/init-db/01-init.sql`:

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS logistics;

-- Set search path
ALTER DATABASE logistics_db SET search_path TO logistics, public;

-- Create audit table
CREATE TABLE IF NOT EXISTS logistics.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON logistics.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON logistics.audit_log(changed_at);

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA logistics TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA logistics TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA logistics TO postgres;
```

### Database Backup Script

Create at `ops/docker/backup-db.sh`:

```bash
#!/bin/bash

# Database backup script
# Usage: ./backup-db.sh

set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="logistics_db_backup_${TIMESTAMP}.sql"

echo "Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Perform backup
docker exec logistics-postgres pg_dump \
  -U postgres \
  -d logistics_db \
  -F c \
  -f /backups/${BACKUP_FILE}

echo "Backup completed: ${BACKUP_FILE}"

# Compress backup
gzip ${BACKUP_DIR}/${BACKUP_FILE}

echo "Backup compressed: ${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
find ${BACKUP_DIR} -name "logistics_db_backup_*.sql.gz" -mtime +7 -delete

echo "Old backups cleaned up"
```

### Database Restore Script

Create at `ops/docker/restore-db.sh`:

```bash
#!/bin/bash

# Database restore script
# Usage: ./restore-db.sh <backup_file>

set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore-db.sh <backup_file>"
  exit 1
fi

BACKUP_FILE=$1

echo "Restoring database from ${BACKUP_FILE}..."

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
  gunzip -k ${BACKUP_FILE}
  BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restore database
docker exec -i logistics-postgres pg_restore \
  -U postgres \
  -d logistics_db \
  -c \
  < ${BACKUP_FILE}

echo "Database restore completed"
```

---

## 🌐 Networking

### Docker Networks

```bash
# Create custom network
docker network create logistics-network

# Inspect network
docker network inspect logistics-network

# Connect container to network
docker network connect logistics-network container-name

# Disconnect container from network
docker network disconnect logistics-network container-name
```

### Service Discovery

Services communicate using Docker DNS:

```csharp
// In BFF API, connecting to Service API
var serviceApiUrl = "http://service-api:8080";

// In Service API, connecting to PostgreSQL
var connectionString = "Host=postgres;Port=5432;Database=logistics_db";

// In any service, connecting to Redis
var redisConnection = "redis:6379";
```

### Network Isolation

```yaml
# Create separate networks for different layers
networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
  database-network:
    driver: bridge
    internal: true  # No external access

services:
  web:
    networks:
      - frontend-network
  
  bff-api:
    networks:
      - frontend-network
      - backend-network
  
  service-api:
    networks:
      - backend-network
      - database-network
  
  postgres:
    networks:
      - database-network
```

---

## 🔐 Environment Configuration

### Development .env File

Create at `.env.development`:

```env
# Application
ASPNETCORE_ENVIRONMENT=Development
NODE_ENV=development

# Database
POSTGRES_DB=logistics_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_ISSUER=LogisticsMarketplace
JWT_AUDIENCE=LogisticsMarketplaceUsers
JWT_EXPIRATION_MINUTES=60

# Service API
SERVICE_API_URL=http://service-api:8080
SERVICE_DB_CONNECTION=Host=postgres;Port=5432;Database=logistics_db;Username=postgres;Password=postgres

# BFF API
BFF_API_URL=http://bff-api:8080

# Logging
LOG_LEVEL=Information
```

### Production .env File

Create at `.env.production`:

```env
# Application
ASPNETCORE_ENVIRONMENT=Production
NODE_ENV=production

# Database (Use strong passwords!)
POSTGRES_DB=logistics_db
POSTGRES_USER=logistics_admin
POSTGRES_PASSWORD=${POSTGRES_PASSWORD_FROM_SECRETS}
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD_FROM_SECRETS}
REDIS_CONNECTION=redis:6379,password=${REDIS_PASSWORD_FROM_SECRETS}

# JWT
JWT_SECRET=${JWT_SECRET_FROM_SECRETS}
JWT_ISSUER=LogisticsMarketplace
JWT_AUDIENCE=LogisticsMarketplaceUsers
JWT_EXPIRATION_MINUTES=30

# Service API
SERVICE_API_URL=http://service-api:8080
SERVICE_DB_CONNECTION=Host=postgres;Port=5432;Database=logistics_db;Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD_FROM_SECRETS}

# BFF API
BFF_API_URL=http://bff-api:8080

# Logging
LOG_LEVEL=Warning
```

### Docker Secrets Management

```bash
# Create secrets
echo "my-secure-password" | docker secret create postgres_password -
echo "my-jwt-secret-key" | docker secret create jwt_secret -

# Use in Docker Compose
services:
  service-api:
    secrets:
      - postgres_password
      - jwt_secret
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Database=logistics_db;Username=postgres;Password_File=/run/secrets/postgres_password"

secrets:
  postgres_password:
    external: true
  jwt_secret:
    external: true
```

### .dockerignore File

Create at root `.dockerignore`:

```
# Git
.git
.gitignore
.gitattributes

# Documentation
*.md
docs/
README.md

# Build outputs
**/bin/
**/obj/
**/dist/
**/build/
**/node_modules/

# IDE
.vs/
.vscode/
.idea/
*.suo
*.user

# Tests
**/tests/
**/*.Tests/
**/*.Test/

# Logs
*.log
logs/

# Environment files
.env
.env.*

# OS files
.DS_Store
Thumbs.db

# Docker
docker-compose*.yml
Dockerfile*
```

---

## 💾 Volume Management

### Data Persistence

```yaml
volumes:
  # PostgreSQL data
  postgres-data:
    driver: local
    driver_opts:
      type: none
      device: /var/lib/docker/volumes/logistics/postgres
      o: bind

  # Redis data
  redis-data:
    driver: local
    driver_opts:
      type: none
      device: /var/lib/docker/volumes/logistics/redis
      o: bind

  # Application logs
  app-logs:
    driver: local
    driver_opts:
      type: none
      device: /var/log/logistics
      o: bind
```

### Volume Commands

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect postgres-data

# Create volume
docker volume create postgres-data

# Remove volume
docker volume rm postgres-data

# Remove unused volumes
docker volume prune

# Backup volume
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Restore volume
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz -C /data
```

---

## 🎯 Container Orchestration

### Docker Swarm Setup

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml logistics

# List services
docker service ls

# Scale service
docker service scale logistics_service-api=3

# Update service
docker service update --image logistics-service-api:v2 logistics_service-api

# Remove stack
docker stack rm logistics
```

### Docker Swarm Compose File

Create at `docker-compose.swarm.yml`:

```yaml
version: '3.8'

services:
  service-api:
    image: logistics-service-api:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      rollback_config:
        parallelism: 1
        delay: 5s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      placement:
        constraints:
          - node.role == worker
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    networks:
      - logistics-network
```

---

## 📊 Monitoring & Logging

### Container Health Checks

```dockerfile
# Built-in health check in Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

```yaml
# Health check in docker-compose
services:
  service-api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

### Logging Configuration

```yaml
services:
  service-api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service,environment"
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs service-api

# View last 100 lines
docker-compose logs --tail=100 service-api

# View logs with timestamps
docker-compose logs -t service-api
```

### Monitoring Stack (Optional)

Create at `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: logistics-prometheus
    volumes:
      - ./ops/docker/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - logistics-network

  grafana:
    image: grafana/grafana:latest
    container_name: logistics-grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3001:3000"
    networks:
      - logistics-network
    depends_on:
      - prometheus

volumes:
  prometheus-data:
  grafana-data:
```

---

## 🛠️ Development Workflow

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/LogisticsMarketplace.git
cd LogisticsMarketplace

# 2. Copy environment file
cp .env.development .env

# 3. Start infrastructure services
docker-compose up -d postgres redis pgadmin

# 4. Run database migrations (from host)
cd src/Service/LogisticsMarketplace.Service.Api
dotnet ef database update

# 5. Build and run backend services (from host or container)
dotnet run

# 6. Install and run frontend (from host)
cd src/Frontend
npm install
npm start
```

### Hot Reload Development

```yaml
# Development override file: docker-compose.override.yml
version: '3.8'

services:
  service-api:
    volumes:
      - ./src/Service:/app/src/Service
      - ./logs:/app/logs
    environment:
      - DOTNET_USE_POLLING_FILE_WATCHER=true
    command: dotnet watch run

  bff-api:
    volumes:
      - ./src/BFF:/app/src/BFF
      - ./logs:/app/logs
    environment:
      - DOTNET_USE_POLLING_FILE_WATCHER=true
    command: dotnet watch run

  web:
    volumes:
      - ./src/Frontend:/app
      - /app/node_modules
    command: npm start
```

### Running Tests in Docker

```bash
# Run unit tests
docker-compose run --rm service-api dotnet test

# Run integration tests
docker-compose -f docker-compose.yml -f docker-compose.test.yml run --rm integration-tests

# Run frontend tests
docker-compose run --rm web npm test
```

---

## 🚀 Production Deployment

### Best Practices

1. **Use Specific Image Tags**
   ```yaml
   services:
     service-api:
       image: logistics-service-api:1.0.0  # Not 'latest'
   ```

2. **Run as Non-Root User**
   ```dockerfile
   USER appuser
   ```

3. **Limit Resources**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
   ```

4. **Use Health Checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
     interval: 30s
   ```

5. **Enable Restart Policies**
   ```yaml
   restart: always
   ```

6. **Use Secrets for Sensitive Data**
   ```yaml
   secrets:
     - db_password
     - jwt_secret
   ```

### Deployment Steps

```bash
# 1. Build images
docker-compose -f docker-compose.prod.yml build

# 2. Tag images
docker tag logistics-service-api:latest logistics-service-api:1.0.0

# 3. Push to registry
docker push your-registry/logistics-service-api:1.0.0

# 4. Deploy to server
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify deployment
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f

# 6. Run smoke tests
curl http://localhost:5000/health
curl http://localhost:5001/health
curl http://localhost:3000/health
```

### Blue-Green Deployment

```bash
# 1. Start new version (green)
docker-compose -f docker-compose.green.yml up -d

# 2. Run health checks on green
./ops/scripts/health-check.sh green

# 3. Switch traffic to green
./ops/scripts/switch-traffic.sh green

# 4. Stop old version (blue)
docker-compose -f docker-compose.blue.yml down

# 5. Rename green to blue for next deployment
mv docker-compose.green.yml docker-compose.blue.yml
```

### Security Considerations

```bash
# Scan images for vulnerabilities
docker scan logistics-service-api:1.0.0

# Use read-only root filesystem
services:
  service-api:
    read_only: true
    tmpfs:
      - /tmp

# Drop capabilities
services:
  service-api:
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE

# Use security options
services:
  service-api:
    security_opt:
      - no-new-privileges:true
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Create at `.github/workflows/docker-build.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository_owner }}/logistics

jobs:
  build-service-api:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-service-api
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: src/Service/LogisticsMarketplace.Service.Api/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  build-bff-api:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-bff-api
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  build-frontend:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-web
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: src/Frontend
          file: src/Frontend/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs service-api

# Inspect container
docker inspect logistics-service-api

# Check health status
docker ps --filter "name=logistics-service-api"
```

#### 2. Database Connection Failed

```bash
# Test database connection
docker exec -it logistics-postgres psql -U postgres -d logistics_db

# Check network connectivity
docker exec -it logistics-service-api ping postgres

# Verify connection string
docker exec -it logistics-service-api env | grep ConnectionStrings
```

#### 3. Port Already in Use

```bash
# Find process using port
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Stop conflicting service or change port in docker-compose.yml
```

#### 4. Volume Permission Issues

```bash
# Fix volume permissions
docker-compose down
sudo chown -R $USER:$USER ./volumes
docker-compose up -d
```

#### 5. Out of Disk Space

```bash
# Clean up unused resources
docker system prune -a --volumes

# Remove specific items
docker image prune
docker container prune
docker volume prune
docker network prune
```

#### 6. Build Cache Issues

```bash
# Build without cache
docker-compose build --no-cache

# Clear build cache
docker builder prune
```

---

## 📝 Docker Commands Cheat Sheet

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart service
docker-compose restart service-api

# View running containers
docker-compose ps

# View all containers (including stopped)
docker ps -a

# Execute command in container
docker exec -it logistics-service-api bash

# View container logs
docker-compose logs -f service-api

# Inspect container
docker inspect logistics-service-api

# Copy files from/to container
docker cp file.txt logistics-service-api:/app/
docker cp logistics-service-api:/app/file.txt ./
```

### Image Management

```bash
# List images
docker images

# Build image
docker-compose build service-api

# Pull image
docker pull postgres:15-alpine

# Push image
docker push your-registry/logistics-service-api:1.0.0

# Remove image
docker rmi logistics-service-api:latest

# Tag image
docker tag logistics-service-api:latest logistics-service-api:1.0.0

# Save image to file
docker save -o service-api.tar logistics-service-api:latest

# Load image from file
docker load -i service-api.tar
```

### Network Management

```bash
# List networks
docker network ls

# Create network
docker network create logistics-network

# Inspect network
docker network inspect logistics-network

# Connect container to network
docker network connect logistics-network container-name

# Disconnect container from network
docker network disconnect logistics-network container-name
```

### Volume Management

```bash
# List volumes
docker volume ls

# Create volume
docker volume create postgres-data

# Inspect volume
docker volume inspect postgres-data

# Remove volume
docker volume rm postgres-data

# Remove unused volumes
docker volume prune
```

### System Management

```bash
# View disk usage
docker system df

# Clean up everything
docker system prune -a --volumes

# View system info
docker info

# View resource usage
docker stats

# View events
docker events
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Start specific service
docker-compose up -d service-api

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# Scale service
docker-compose up -d --scale service-api=3

# Validate compose file
docker-compose config

# List containers
docker-compose ps

# Execute command
docker-compose exec service-api bash

# Run one-off command
docker-compose run --rm service-api dotnet --version
```

### Debugging Commands

```bash
# View container processes
docker top logistics-service-api

# Attach to container
docker attach logistics-service-api

# View container changes
docker diff logistics-service-api

# Export container filesystem
docker export logistics-service-api > service-api.tar

# View port mappings
docker port logistics-service-api

# Pause/unpause container
docker pause logistics-service-api
docker unpause logistics-service-api
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Multi-stage Builds](https://docs.docker.com/develop/develop-images/multistage-build/)

---

## ✅ Next Steps

1. Create Dockerfiles for all services
2. Set up .dockerignore file
3. Configure environment variables
4. Test local Docker setup
5. Set up CI/CD pipeline
6. Plan production deployment
7. Implement monitoring and logging
8. Document deployment procedures

---

**Last Updated**: 22 July 2026
**Version**: 1.0.0
**Status**: Complete
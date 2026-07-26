
# Epic G: CI/CD with GitHub Actions

## Overview

This document outlines the comprehensive CI/CD pipeline implementation using GitHub Actions for the LogisticsMarketplace platform.

## Table of Contents

1. [CI/CD Pipeline Overview](#cicd-pipeline-overview)
2. [GitHub Actions Workflow Structure](#github-actions-workflow-structure)
3. [Build Workflows](#build-workflows)
4. [Test Workflows](#test-workflows)
5. [Code Quality & Linting](#code-quality--linting)
6. [Security Scanning](#security-scanning)
7. [Docker Build & Push](#docker-build--push)
8. [Deployment Workflows](#deployment-workflows)
9. [Environment Management](#environment-management)
10. [Secrets & Variables](#secrets--variables)
11. [Caching Strategies](#caching-strategies)
12. [Matrix Builds](#matrix-builds)
13. [Automated Releases](#automated-releases)
14. [Pull Request Automation](#pull-request-automation)
15. [Status Badges](#status-badges)
16. [Complete Workflow Examples](#complete-workflow-examples)

---

## CI/CD Pipeline Overview

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Pull Request                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Lint    │→ │  Build   │→ │  Test    │→ │  Security│       │
│  │  Check   │  │  Check   │  │  Suite   │  │  Scan    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Merge to Main/Develop                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Build   │→ │  Test    │→ │  Docker  │→ │  Deploy  │       │
│  │  All     │  │  All     │  │  Build   │  │  Staging │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Release/Tag Creation                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Build   │→ │  Test    │→ │  Docker  │→ │  Deploy  │       │
│  │  Release │  │  Release │  │  Push    │  │  Prod    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Pipeline Goals

1. **Fast Feedback**: PRs get results within 5-10 minutes
2. **Reliability**: Consistent, reproducible builds
3. **Security**: Automated vulnerability scanning
4. **Quality**: Enforce code standards and coverage
5. **Automation**: Minimal manual intervention
6. **Traceability**: Clear deployment history

---

## GitHub Actions Workflow Structure

### Repository Structure

```
.github/
├── workflows/
│   ├── pr-check.yml              # PR validation
│   ├── build-backend.yml         # Backend CI
│   ├── build-frontend.yml        # Frontend CI
│   ├── test-integration.yml      # Integration tests
│   ├── test-e2e.yml             # E2E tests
│   ├── code-quality.yml         # Linting & analysis
│   ├── security-scan.yml        # Security scanning
│   ├── docker-build.yml         # Docker image builds
│   ├── deploy-staging.yml       # Staging deployment
│   ├── deploy-production.yml    # Production deployment
│   └── release.yml              # Release automation
├── actions/                      # Reusable actions
│   ├── setup-dotnet/
│   ├── setup-node/
│   └── notify-deployment/
└── CODEOWNERS                   # Code ownership

.github/workflows/
```

### Workflow Components

```yaml
name: Workflow Name

on:                              # Trigger events
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:                             # Environment variables
  DOTNET_VERSION: '8.0.x'
  NODE_VERSION: '18.x'

jobs:
  job-name:                      # Job definition
    runs-on: ubuntu-latest       # Runner environment
    
    steps:                       # Job steps
      - name: Step Name
        uses: actions/checkout@v4
        
      - name: Another Step
        run: echo "Hello"
```

---

## Build Workflows

### Backend Build Workflow

```yaml
# .github/workflows/build-backend.yml

name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'src/Service/**'
      - 'src/BFF/**'
      - 'tests/**'
      - '*.sln'
      - 'Directory.Build.props'
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/Service/**'
      - 'src/BFF/**'
      - 'tests/**'

env:
  DOTNET_VERSION: '8.0.x'
  DOTNET_SKIP_FIRST_TIME_EXPERIENCE: 1
  DOTNET_NOLOGO: true
  BUILD_CONFIGURATION: Release

jobs:
  build:
    name: Build Backend
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better analysis

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}

      - name: Cache NuGet packages
        uses: actions/cache@v3
        with:
          path: ~/.nuget/packages
          key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}
          restore-keys: |
            ${{ runner.os }}-nuget-

      - name: Restore dependencies
        run: dotnet restore

      - name: Build solution
        run: dotnet build --configuration ${{ env.BUILD_CONFIGURATION }} --no-restore

      - name: Run unit tests
        run: |
          dotnet test \
            --configuration ${{ env.BUILD_CONFIGURATION }} \
            --no-build \
            --verbosity normal \
            --logger "trx;LogFileName=test-results.trx" \
            --collect:"XPlat Code Coverage" \
            -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=cobertura

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: backend-test-results
          path: |
            **/TestResults/*.trx
            **/TestResults/**/*.cobertura.xml

      - name: Publish code coverage
        uses: codecov/codecov-action@v3
        with:
          files: '**/TestResults/**/coverage.cobertura.xml'
          flags: backend
          name: backend-coverage

      - name: Build artifacts
        run: |
          dotnet publish src/Service/LogisticsMarketplace.Service.Api \
            --configuration ${{ env.BUILD_CONFIGURATION }} \
            --output ./artifacts/service-api \
            --no-build
          
          dotnet publish src/BFF/LogisticsMarketplace.BFF.Api \
            --configuration ${{ env.BUILD_CONFIGURATION }} \
            --output ./artifacts/bff-api \
            --no-build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: backend-artifacts
          path: ./artifacts/
          retention-days: 7
```

### Frontend Build Workflow

```yaml
# .github/workflows/build-frontend.yml

name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'src/Frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/Frontend/**'

env:
  NODE_VERSION: '18.x'

jobs:
  build:
    name: Build Frontend
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        package:
          - shell
          - shipper-mfe
          - carrier-mfe
          - dispatcher-mfe
          - shared
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'src/Frontend/package-lock.json'

      - name: Install dependencies
        working-directory: src/Frontend
        run: npm ci

      - name: Lint
        working-directory: src/Frontend/packages/${{ matrix.package }}
        run: npm run lint

      - name: Type check
        working-directory: src/Frontend/packages/${{ matrix.package }}
        run: npm run type-check

      - name: Build
        working-directory: src/Frontend/packages/${{ matrix.package }}
        run: npm run build
        env:
          NODE_ENV: production

      - name: Run tests
        working-directory: src/Frontend/packages/${{ matrix.package }}
        run: npm test -- --ci --coverage --maxWorkers=2

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: src/Frontend/packages/${{ matrix.package }}/coverage/coverage-final.json
          flags: frontend-${{ matrix.package }}
          name: frontend-${{ matrix.package }}-coverage

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-${{ matrix.package }}-build
          path: src/Frontend/packages/${{ matrix.package }}/dist/
          retention-days: 7
```

---

## Test Workflows

### Unit & Integration Tests

```yaml
# .github/workflows/test-integration.yml

name: Integration Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]
  workflow_dispatch:  # Manual trigger

env:
  DOTNET_VERSION: '8.0.x'

jobs:
  integration-tests:
    name: Run Integration Tests
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: logistics_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}

      - name: Restore dependencies
        run: dotnet restore

      - name: Build
        run: dotnet build --configuration Release --no-restore

      - name: Run integration tests
        run: |
          dotnet test \
            tests/LogisticsMarketplace.Service.Integration.Tests \
            --configuration Release \
            --no-build \
            --verbosity normal \
            --logger "trx;LogFileName=integration-results.trx" \
            --collect:"XPlat Code Coverage"
        env:
          ConnectionStrings__DefaultConnection: 'Host=localhost;Port=5432;Database=logistics_test;Username=test;Password=test'

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: integration-test-results
          path: '**/TestResults/**'

      - name: Test Report
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Integration Tests
          path: '**/TestResults/*.trx'
          reporter: dotnet-trx
```

### E2E Tests

```yaml
# .github/workflows/test-e2e.yml

name: E2E Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

env:
  NODE_VERSION: '18.x'
  DOTNET_VERSION: '8.0.x'

jobs:
  e2e-tests:
    name: Run E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: logistics_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install Playwright
        working-directory: src/Frontend
        run: |
          npm ci
          npx playwright install --with-deps

      - name: Build and start backend
        run: |
          dotnet build --configuration Release
          dotnet run --project src/Service/LogisticsMarketplace.Service.Api &
          dotnet run --project src/BFF/LogisticsMarketplace.BFF.Api &
          sleep 30  # Wait for APIs to start
        env:
          ConnectionStrings__DefaultConnection: 'Host=localhost;Port=5432;Database=logistics_db;Username=postgres;Password=postgres'

      - name: Build and start frontend
        working-directory: src/Frontend
        run: |
          npm run build
          npm start &
          sleep 20  # Wait for frontend to start

      - name: Wait for services
        run: |
          curl --retry 10 --retry-delay 5 --retry-connrefused http://localhost:5000/health
          curl --retry 10 --retry-delay 5 --retry-connrefused http://localhost:5001/health
          curl --retry 10 --retry-delay 5 --retry-connrefused http://localhost:3000

      - name: Run Playwright tests
        working-directory: src/Frontend/e2e
        run: npx playwright test

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: src/Frontend/e2e/playwright-report/
          retention-days: 30

      - name: Upload test videos
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-videos
          path: src/Frontend/e2e/test-results/
          retention-days: 7
```

---

## Code Quality & Linting

### Backend Code Quality

```yaml
# .github/workflows/code-quality.yml

name: Code Quality

on:
  pull_request:
    branches: [main, develop]

jobs:
  dotnet-format:
    name: .NET Code Formatting
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore tools
        run: dotnet tool restore

      - name: Check code formatting
        run: dotnet format --verify-no-changes --verbosity diagnostic

      - name: Run StyleCop
        run: dotnet build --configuration Release /p:TreatWarningsAsErrors=true

  sonarcloud:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones disabled for better analysis

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Cache SonarCloud packages
        uses: actions/cache@v3
        with:
          path: ~\sonar\cache
          key: ${{ runner.os }}-sonar
          restore-keys: ${{ runner.os }}-sonar

      - name: Install SonarCloud scanner
        run: dotnet tool install --global dotnet-sonarscanner

      - name: Build and analyze
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        run: |
          dotnet sonarscanner begin \
            /k:"LogisticsMarketplace" \
            /o:"your-org" \
            /d:sonar.login="${{ secrets.SONAR_TOKEN }}" \
            /d:sonar.host.url="https://sonarcloud.io" \
            /d:sonar.cs.opencover.reportsPaths="**/coverage.opencover.xml"
          
          dotnet build --configuration Release
          
          dotnet test \
            --configuration Release \
            --no-build \
            --collect:"XPlat Code Coverage" \
            -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover
          
          dotnet sonarscanner end /d:sonar.login="${{ secrets.SONAR_TOKEN }}"
```

### Frontend Code Quality

```yaml
# .github/workflows/frontend-quality.yml

name: Frontend Code Quality

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'src/Frontend/**'

jobs:
  eslint:
    name: ESLint Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: 'npm'
          cache-dependency-path: 'src/Frontend/package-lock.json'

      - name: Install dependencies
        working-directory: src/Frontend
        run: npm ci

      - name: Run ESLint
        working-directory: src/Frontend
        run: npm run lint -- --format json --output-file eslint-report.json
        continue-on-error: true

      - name: Annotate code with ESLint results
        uses: ataylorme/eslint-annotate-action@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          report-json: src/Frontend/eslint-report.json

  prettier:
    name: Prettier Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'

      - name: Install Prettier
        run: npm install -g prettier

      - name: Check formatting
        working-directory: src/Frontend
        run: prettier --check "**/*.{ts,tsx,js,jsx,json,css,md}"

  type-check:
    name: TypeScript Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: 'npm'
          cache-dependency-path: 'src/Frontend/package-lock.json'

      - name: Install dependencies
        working-directory: src/Frontend
        run: npm ci

      - name: Run TypeScript compiler
        working-directory: src/Frontend
        run: npm run type-check
```

---

## Security Scanning

```yaml
# .github/workflows/security-scan.yml

name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  dependency-scan:
    name: Dependency Vulnerability Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Snyk to check for vulnerabilities (Backend)
        uses: snyk/actions/dotnet@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          command: test

      - name: Run Snyk to check for vulnerabilities (Frontend)
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          command: test

  codeql-analysis:
    name: CodeQL Security Analysis
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      actions: read
      contents: read
    
    strategy:
      matrix:
        language: ['csharp', 'javascript']
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  container-scan:
    name: Container Image Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker images
        run: |
          docker build -t logistics-service-api:latest -f src/Service/LogisticsMarketplace.Service.Api/Dockerfile .
          docker build -t logistics-bff-api:latest -f src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'logistics-service-api:latest'
          format: 'sarif'
          output: 'trivy-service-api-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-service-api-results.sarif'
```

---

## Docker Build & Push

```yaml
# .github/workflows/docker-build.yml

name: Docker Build & Push

on:
  push:
    branches: [main, develop]
    tags:
      - 'v*'
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-service-api:
    name: Build Service API Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/service-api
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: src/Service/LogisticsMarketplace.Service.Api/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  build-bff-api:
    name: Build BFF API Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/bff-api
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: src/BFF/LogisticsMarketplace.BFF.Api/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

  build-frontend:
    name: Build Frontend Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: src/Frontend
          file: src/Frontend/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NODE_ENV=production
          platforms: linux/amd64,linux/arm64
```

---

## Deployment Workflows

### Staging Deployment

```yaml
# .github/workflows/deploy-staging.yml

name: Deploy to Staging

on:
  push:
    branches: [develop]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  deploy-staging:
    name: Deploy to Staging Environment
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.logisticsmarketplace.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Deploy to ECS
        run: |
          # Update ECS task definition
          aws ecs update-service \
            --cluster logistics-staging \
            --service service-api \
            --force-new-deployment
          
          aws ecs update-service \
            --cluster logistics-staging \
            --service bff-api \
            --force-new-deployment
          
          aws ecs update-service \
            --cluster logistics-staging \
            --service frontend \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster logistics-staging \
            --services service-api bff-api frontend

      - name: Run smoke tests
        run: |
          curl -f https://staging-api.logisticsmarketplace.com/health || exit 1
          curl -f https://staging-bff.logisticsmarketplace.com/health || exit 1
          curl -f https://staging.logisticsmarketplace.com || exit 1

      - name: Notify deployment
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Production Deployment

```yaml
# .github/workflows/deploy-production.yml

name: Deploy to Production

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  deploy-production:
    name: Deploy to Production Environment
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.logisticsmarketplace.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Get version
        id: version
        run: |
          if [ "${{ github.event_name }}" == "release" ]; then
            echo "VERSION=${{ github.event.release.tag_name }}" >> $GITHUB_OUTPUT
          else
            echo "VERSION=${{ github.event.inputs.version }}" >> $GITHUB_OUTPUT
          fi

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Create backup
        run: |
          # Backup current deployment
          aws ecs describe-services \
            --cluster logistics-production \
            --services service-api bff-api frontend \
            > deployment-backup-$(date +%Y%m%d-%H%M%S).json

      - name: Deploy Service API
        run: |
          aws ecs update-service \
            --cluster logistics-production \
            --service service-api \
            --task-definition service-api:${{ steps.version.outputs.VERSION }} \
            --force-new-deployment

      - name: Wait for Service API
        run: |
          aws ecs wait services-stable \
            --cluster logistics-production \
            --services service-api

      - name: Deploy BFF API
        run: |
          aws ecs update-service \
            --cluster logistics-production \
            --service bff-api \
            --task-definition bff-api:${{ steps.version.outputs.VERSION }} \
            --force-new-deployment

      - name: Wait for BFF API
        run: |
          aws ecs wait services-stable \
            --cluster logistics-production \
            --services bff-api

      - name: Deploy Frontend
        run: |
          aws ecs update-service \
            --cluster logistics-production \
            --service frontend \
            --task-definition frontend:${{ steps.version.outputs.VERSION }} \
            --force-new-deployment

      - name: Wait for Frontend
        run: |
          aws ecs wait services-stable \
            --cluster logistics-production \
            --services frontend

      - name: Run health checks
        run: |
          # Health check with retries
          for i in {1..5}; do
            if curl -f https://api.logisticsmarketplace.com/health && \
               curl -f https://bff.logisticsmarketplace.com/health && \
               curl -f https://app.logisticsmarketplace.com; then
              echo "Health checks passed"
              exit 0
            fi
            echo "Attempt $i failed, retrying..."
            sleep 10
          done
          echo "Health checks failed"
          exit 1

      - name: Run smoke tests
        run: |
          # Run critical path tests
          npm run test:smoke

      - name: Rollback on failure
        if: failure()
        run: |
          echo "Deployment failed, initiating rollback"
          # Rollback to previous version
          aws ecs update-service \
            --cluster logistics-production \
            --service service-api \
            --force-new-deployment

      - name: Notify deployment success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: '🚀 Production Deployment Successful',
              attachments: [{
                color: 'good',
                fields: [{
                  title: 'Version',
                  value: '${{ steps.version.outputs.VERSION }}',
                  short: true
                }, {
                  title: 'Deployed By',
                  value: '${{ github.actor }}',
                  short: true
                }]
              }]
            }
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notify deployment failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: '❌ Production Deployment Failed',
              attachments: [{
                color: 'danger',
                fields: [{
                  title: 'Version',
                  value: '${{ steps.version.outputs.VERSION }}',
                  short: true
                }, {
                  title: 'Failed Step',
                  value: '${{ github.job }}',
                  short: true
                }]
              }]
            }
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Environment Management

### Environment Configuration

```yaml
# Repository Settings > Environments

# Staging Environment
environment: staging
  url: https://staging.logisticsmarketplace.com
  protection_rules:
    - required_reviewers: 0
    - wait_timer: 0
  secrets:
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - DATABASE_CONNECTION_STRING
  variables:
    - ENVIRONMENT: staging
    - LOG_LEVEL: Debug

# Production Environment
environment: production
  url: https://app.logisticsmarketplace.com
  protection_rules:
    - required_reviewers: 2
    - wait_timer: 5  # minutes
    - deployment_branch_policy: protected_branches
  secrets:
    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - DATABASE_CONNECTION_STRING
    - SMTP_PASSWORD
  variables:
    - ENVIRONMENT: production
    - LOG_LEVEL: Information
```

---

## Secrets & Variables

### Repository Secrets

```yaml
# GitHub Repository Settings > Secrets and Variables > Actions

# Repository Secrets
GITHUB_TOKEN                  # Automatically provided
AWS_ACCESS_KEY_ID             # AWS credentials
AWS_SECRET_ACCESS_KEY         # AWS credentials
SONAR_TOKEN                   # SonarCloud token
SNYK_TOKEN                    # Snyk security token
SLACK_WEBHOOK                 # Slack notifications
CODECOV_TOKEN                 # Code coverage upload
DOCKER_USERNAME               # Docker Hub username
DOCKER_PASSWORD               # Docker Hub password

# Environment Secrets (per environment)
DATABASE_CONNECTION_STRING    # Database connection
SMTP_PASSWORD                 # Email service password
JWT_SECRET_KEY               # Authentication secret
ENCRYPTION_KEY               # Data encryption key
```

### Using Secrets in Workflows

```yaml
steps:
  - name: Deploy to AWS
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    run: |
      aws s3 cp build/ s3://my-bucket/ --recursive

  - name: Run with database
    env:
      ConnectionStrings__DefaultConnection: ${{ secrets.DATABASE_CONNECTION_STRING }}
    run: dotnet run
```

---

## Caching Strategies

### NuGet Package Caching

```yaml
- name: Cache NuGet packages
  uses: actions/cache@v3
  with:
    path: ~/.nuget/packages
    key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}
    restore-keys: |
      ${{ runner.os }}-nuget-
```

### npm Package Caching

```yaml
- name: Setup Node.js with cache
  uses: actions/setup-node@v4
  with:
    node-version: '18.x'
    cache: 'npm'
    cache-dependency-path: 'src/Frontend/package-lock.json'
```

### Docker Layer Caching

```yaml
- name: Build and push with cache
  uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Custom Caching

```yaml
- name: Cache build output
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      **/node_modules
      **/.next/cache
    key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-build-
      ${{ runner.os }}-
```

---

## Matrix Builds

### Multi-Platform Testing

```yaml
jobs:
  test:
    name: Test on ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        dotnet-version: ['7.0.x', '8.0.x']
        node-version: ['16.x', '18.x', '20.x']
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET ${{ matrix.dotnet-version }}
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ matrix.dotnet-version }}
      
      - name: Setup Node ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Run tests
        run: |
          dotnet test
          npm test
```

### Browser Matrix Testing

```yaml
jobs:
  e2e:
    name: E2E on ${{ matrix.browser }}
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        include:
          - browser: chromium
            device: 'Desktop Chrome'
          - browser: firefox
            device: 'Desktop Firefox'
          - browser: webkit
            device: 'Desktop Safari'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Playwright tests
        run: npx playwright test --project=${{ matrix.browser }}
```

---

## Automated Releases

### Semantic Release

```yaml
# .github/workflows/release.yml

name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'

      - name: Install dependencies
        run: npm ci

      - name: Run semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release

      - name: Create GitHub Release
        if: steps.semantic.outputs.new_release_published == 'true'
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.semantic.outputs.new_release_version }}
          release_name: Release v${{ steps.semantic.outputs.new_release_version }}
          body: ${{ steps.semantic.outputs.new_release_notes }}
          draft: false
          prerelease: false
```

### Changelog Generation

```yaml
- name: Generate changelog
  uses: conventional-changelog-action@v3
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    output-file: 'CHANGELOG.md'
    release-count: 0
    config-file-path: '.github/changelog-config.js'

- name: Commit changelog
  run: |
    git config user.name github-actions
    git config user.email github-actions@github.com
    git add CHANGELOG.md
    git commit -m "docs: update changelog" || echo "No changes to commit"
    git push
```

---

## Pull Request Automation

### PR Checks Workflow

```yaml
# .github/workflows/pr-check.yml

name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate-pr:
    name: Validate Pull Request
    runs-on: ubuntu-latest
    
    steps:
      - name: Check PR title
        uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            docs
            style
            refactor
            perf
            test
            chore
          requireScope: false

      - name: Check for merge conflicts
        uses: eps1lon/actions-label-merge-conflict@v2
        with:
          dirtyLabel: 'merge-conflict'
          repoToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Label based on files changed
        uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          configuration-path: .github/labeler.yml

  size-label:
    name: PR Size Labeling
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Apply size labels
        uses: pascalgn/size-label-action@v0.5.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          sizes: >
            {
              "0": "XS",
              "20": "S",
              "50": "M",
              "200": "L",
              "500": "XL",
              "1000": "XXL"
            }

  auto-assign:
    name: Auto-assign Reviewers
    runs-on: ubuntu-latest
    
    steps:
      - name: Auto assign
        uses: kentaro-m/auto-assign-action@v1.2.5
        with:
          configuration-path: '.github/auto-assign.yml'
```

### Auto-labeler Configuration

```yaml
# .github/labeler.yml

backend:
  - 'src/Service/**'
  - 'src/BFF/**'

frontend:
  - 'src/Frontend/**'

documentation:
  - 'docs/**'
  - '**/*.md'

tests:
  - 'tests/**'
  - '**/*.test.ts'
  - '**/*.test.cs'

dependencies:
  - 'package.json'
  - 'package-lock.json'
  - '**/*.csproj'

ci-cd:
  - '.github/**'
```

### Auto-reviewer Configuration

```yaml
# .github/auto-assign.yml

addReviewers: true
addAssignees: false

reviewers:
  - team-lead
  - backend-lead
  - frontend-lead

numberOfReviewers: 2

skipKeywords:
  - wip
  - draft
```

---

## Status Badges

### README Badges

```markdown
<!-- README.md -->

# LogisticsMarketplace

![Build Status](https://github.com/your-org/LogisticsMarketplace/workflows/Backend%20CI/badge.svg)
![Frontend Build](https://github.com/your-org/LogisticsMarketplace/workflows/Frontend%20CI/badge.svg)
![Tests](https://github.com/your-org/LogisticsMarketplace/workflows/E2E%20Tests/badge.svg)
![Code Coverage](https://codecov.io/gh/your-org/LogisticsMarketplace/branch/main/graph/badge.svg)
![Security Scan](https://github.com/your-org/LogisticsMarketplace/workflows/Security%20Scan/badge.svg)
![License](https://img.shields.io/github/license/your-org/LogisticsMarketplace)
![Version](https://img.shields.io/github/v/release/your-org/LogisticsMarketplace)
```

### Custom Status Badges

```yaml
- name: Create status badge
  uses: schneegans/dynamic-badges-action@v1.6.0
  with:
    auth: ${{ secrets.GIST_SECRET }}
    gistID: your-gist-id
    filename: coverage-badge.json
    label: Coverage
    message: ${{ steps.coverage.outputs.percentage }}%
    color: ${{ steps.coverage.outputs.color }}
```

---

## Complete Workflow Examples

### Comprehensive CI/CD Pipeline

```yaml
# .github/workflows/main.yml

name: Main CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  DOTNET_VERSION: '8.0.x'
  NODE_VERSION: '18.x'
  REGISTRY: ghcr.io

jobs:
  # ============================================
  # PR Validation
  # ============================================
  pr-validation:
    name: PR Validation
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate PR title
        uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # ============================================
  # Backend Build & Test
  # ============================================
  backend:
    name: Backend CI
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}
      
      - name: Cache NuGet
        uses: actions/cache@v3
        with:
          path: ~/.nuget/packages
          key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}
      
      - name: Restore
        run: dotnet restore
      
      - name: Build
        run: dotnet build --configuration Release --no-restore
      
      - name: Test
        run: |
          dotnet test \
            --configuration Release \
            --no-build \
            --collect:"XPlat Code Coverage"
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          flags: backend

  # ============================================
  # Frontend Build & Test
  # ============================================
  frontend:
    name: Frontend CI
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: 'src/Frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: src/Frontend
        run: npm ci
      
      - name: Lint
        working-directory: src/Frontend
        run: npm run lint
      
      - name: Build
        working-directory: src/Frontend
        run: npm run build
      
      - name: Test
        working-directory: src/Frontend
        run: npm test -- --ci --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          flags: frontend

  # ============================================
  # Security Scanning
  # ============================================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload to Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # ============================================
  # Docker Build
  # ============================================
  docker:
    name: Docker Build
    if: github.event_name == 'push'
    needs: [backend, frontend, security]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    strategy:
      matrix:
        service: [service-api, bff-api, frontend]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ matrix.service }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ============================================
  # Deploy to Staging
  # ============================================
  deploy-staging:
    name: Deploy Staging
    if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
    needs: [docker]
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.logisticsmarketplace.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # Add deployment commands

  # ============================================
  # Deploy to Production
  # ============================================
  deploy-production:
    name: Deploy Production
    if: github.event_name == 'release'
    needs: [docker]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.logisticsmarketplace.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # Add deployment commands
      
      - name: Notify Success
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: '🚀 Production deployment successful!',
              attachments: [{
                color: 'good',
                fields: [{
                  title: 'Version',
                  value: '${{ github.event.release.tag_name }}'
                }]
              }]
            }
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Best Practices Summary

### Workflow Organization

1. **Separate Workflows by Concern**
   - Build workflows
   - Test workflows
   - Deployment workflows
   - Release workflows

2. **Use Reusable Workflows**
   - Create composite actions
   - Share common steps
   - Reduce duplication

3. **Optimize for Speed**
   - Use caching extensively
   - Run jobs in parallel
   - Fail fast when appropriate

4. **Security First**
   - Never commit secrets
   - Use GitHub Secrets
   - Scan for vulnerabilities
   - Least privilege access

5. **Clear Naming**
   - Descriptive workflow names
   - Meaningful job names
   - Clear step descriptions

6. **Documentation**
   - Comment complex workflows
   - Document required secrets
   - Maintain runbooks

---

## Troubleshooting

### Common Issues

1. **Cache Invalidation**
   ```yaml
   # Force cache refresh
   key: ${{ runner.os }}-build-${{ github.run_number }}
   ```

2. **Timeout Issues**
   ```yaml
   jobs:
     job-name:
       timeout-minutes: 30  # Default is 360
   ```

3. **Dependency Conflicts**
   ```yaml
   - name: Clean install
     run: |
       rm -rf node_modules package-lock.json
       npm install
   ```

4. **Permission Errors**
   ```yaml
   permissions:
     contents: write
     packages: write
     pull-requests: write
   ```

---

## Summary

This comprehensive CI/CD infrastructure provides:

- **Automated Testing**: All tests run on every PR
- **Quality Gates**: Code quality and security checks
- **Fast Feedback**: Developers get results quickly
- **Safe Deployments**: Multi-stage deployment with rollback
- **Visibility**: Clear status and notifications
- **Scalability**: Handles growing codebase and team

### Next Steps

1. Implement basic CI workflows
2. Add security scanning
3. Set up deployment pipelines
4. Configure environment protection
5. Add monitoring and alerts
6. Document deployment procedures
7. Train team on CI/CD practices

---

**Related Documentation:**
- [EPIC-F-TESTING-INFRASTRUCTURE.md](./EPIC-F-TESTING-INFRASTRUCTURE.md)
- [Development Guide](../README.md)
- [Deployment Guide](./DEPLOYMENT.md)
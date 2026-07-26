
# Epic F: Testing Infrastructure

## Overview

This document outlines the comprehensive testing strategy for the LogisticsMarketplace platform, covering all layers from unit tests to end-to-end testing.

## Table of Contents

1. [Testing Strategy & Test Pyramid](#testing-strategy--test-pyramid)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [API Testing](#api-testing)
6. [Test Data Management](#test-data-management)
7. [Code Coverage](#code-coverage)
8. [Performance Testing](#performance-testing)
9. [Test Organization & Structure](#test-organization--structure)
10. [Mocking & Test Doubles](#mocking--test-doubles)
11. [CI Integration](#ci-integration)
12. [Best Practices](#best-practices)

---

## Testing Strategy & Test Pyramid

### Test Pyramid Philosophy

```
        /\
       /  \
      / E2E \          <- Few (5-10%)
     /--------\
    /          \
   / Integration\     <- Some (20-30%)
  /--------------\
 /                \
/   Unit Tests     \   <- Many (60-75%)
--------------------
```

### Testing Principles

1. **Fast Feedback**: Unit tests run in milliseconds
2. **Test Independence**: Each test is isolated and can run independently
3. **Deterministic**: Tests produce consistent results
4. **Maintainable**: Tests are easy to understand and modify
5. **Comprehensive**: Cover happy paths, edge cases, and error scenarios

### Coverage Goals

| Layer | Coverage Target | Test Count Distribution |
|-------|----------------|------------------------|
| Unit Tests | 80-90% | 60-75% of all tests |
| Integration Tests | 70-80% | 20-30% of all tests |
| E2E Tests | Critical paths | 5-10% of all tests |

---

## Unit Testing

### Backend Unit Testing (.NET)

#### Tools & Frameworks

- **xUnit**: Primary test framework
- **Moq**: Mocking framework
- **FluentAssertions**: Assertion library
- **AutoFixture**: Test data generation
- **Bogus**: Fake data generation

#### Project Structure

```
tests/
├── LogisticsMarketplace.Service.Domain.Tests/
│   ├── Entities/
│   │   ├── ListingTests.cs
│   │   ├── BidTests.cs
│   │   └── DealTests.cs
│   ├── ValueObjects/
│   │   ├── MoneyTests.cs
│   │   ├── AddressTests.cs
│   │   └── PhoneNumberTests.cs
│   └── Common/
│       └── EntityTests.cs
├── LogisticsMarketplace.Service.Application.Tests/
│   ├── Services/
│   │   ├── ListingServiceTests.cs
│   │   ├── BidServiceTests.cs
│   │   └── DealServiceTests.cs
│   └── Validators/
│       └── ListingValidatorTests.cs
└── LogisticsMarketplace.BFF.Api.Tests/
    ├── Controllers/
    │   ├── ListingsControllerTests.cs
    │   └── BidsControllerTests.cs
    └── Services/
        └── ServiceApiClientTests.cs
```

#### Example: Domain Entity Unit Test

```csharp
using Xunit;
using FluentAssertions;
using LogisticsMarketplace.Service.Domain.Entities;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Domain.Tests.Entities;

public class ListingTests
{
    [Fact]
    public void Create_ValidListing_ShouldSucceed()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var origin = new Address("123 Main St", "New York", "NY", "10001", "USA");
        var destination = new Address("456 Oak Ave", "Los Angeles", "CA", "90001", "USA");
        var pickupDate = DateTime.UtcNow.AddDays(7);
        var deliveryDate = DateTime.UtcNow.AddDays(10);
        var rate = new Money(1500.00m, "USD");

        // Act
        var listing = new Listing(
            userId,
            origin,
            destination,
            pickupDate,
            deliveryDate,
            rate,
            "Electronics shipment",
            20000m // weight in lbs
        );

        // Assert
        listing.Should().NotBeNull();
        listing.UserId.Should().Be(userId);
        listing.Origin.Should().Be(origin);
        listing.Destination.Should().Be(destination);
        listing.Status.Should().Be(ListingStatus.Open);
        listing.Rate.Amount.Should().Be(1500.00m);
    }

    [Fact]
    public void PlaceBid_WhenListingIsOpen_ShouldSucceed()
    {
        // Arrange
        var listing = CreateValidListing();
        var bidderId = Guid.NewGuid();
        var bidAmount = new Money(1400.00m, "USD");

        // Act
        var bid = listing.PlaceBid(bidderId, bidAmount, "Competitive rate");

        // Assert
        bid.Should().NotBeNull();
        bid.ListingId.Should().Be(listing.Id);
        bid.BidderId.Should().Be(bidderId);
        bid.Status.Should().Be(BidStatus.Pending);
    }

    [Fact]
    public void PlaceBid_WhenListingIsClosed_ShouldThrowException()
    {
        // Arrange
        var listing = CreateValidListing();
        listing.Close();
        var bidderId = Guid.NewGuid();
        var bidAmount = new Money(1400.00m, "USD");

        // Act
        Action act = () => listing.PlaceBid(bidderId, bidAmount, "Late bid");

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot place bid on a closed listing");
    }

    [Theory]
    [InlineData(-100)]
    [InlineData(0)]
    public void Create_WithInvalidRate_ShouldThrowException(decimal amount)
    {
        // Arrange
        var userId = Guid.NewGuid();
        var origin = new Address("123 Main St", "New York", "NY", "10001", "USA");
        var destination = new Address("456 Oak Ave", "Los Angeles", "CA", "90001", "USA");
        var pickupDate = DateTime.UtcNow.AddDays(7);
        var deliveryDate = DateTime.UtcNow.AddDays(10);

        // Act
        Action act = () => new Listing(
            userId,
            origin,
            destination,
            pickupDate,
            deliveryDate,
            new Money(amount, "USD"),
            "Test shipment",
            10000m
        );

        // Assert
        act.Should().Throw<ArgumentException>();
    }

    private Listing CreateValidListing()
    {
        return new Listing(
            Guid.NewGuid(),
            new Address("123 Main St", "New York", "NY", "10001", "USA"),
            new Address("456 Oak Ave", "Los Angeles", "CA", "90001", "USA"),
            DateTime.UtcNow.AddDays(7),
            DateTime.UtcNow.AddDays(10),
            new Money(1500.00m, "USD"),
            "Test shipment",
            20000m
        );
    }
}
```

#### Example: Application Service Unit Test

```csharp
using Xunit;
using Moq;
using FluentAssertions;
using LogisticsMarketplace.Service.Application.Services;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Domain.Entities;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using Microsoft.Extensions.Logging;

namespace LogisticsMarketplace.Service.Application.Tests.Services;

public class ListingServiceTests
{
    private readonly Mock<IRepository<Listing>> _listingRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ListingService>> _loggerMock;
    private readonly ListingService _sut;

    public ListingServiceTests()
    {
        _listingRepositoryMock = new Mock<IRepository<Listing>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ListingService>>();
        
        _unitOfWorkMock.Setup(u => u.Repository<Listing>())
            .Returns(_listingRepositoryMock.Object);

        _sut = new ListingService(_unitOfWorkMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task CreateListingAsync_ValidDto_ShouldReturnListingDto()
    {
        // Arrange
        var createDto = new CreateListingDto
        {
            UserId = Guid.NewGuid(),
            OriginAddress = "123 Main St, New York, NY 10001",
            DestinationAddress = "456 Oak Ave, Los Angeles, CA 90001",
            PickupDate = DateTime.UtcNow.AddDays(7),
            DeliveryDate = DateTime.UtcNow.AddDays(10),
            Rate = 1500.00m,
            Currency = "USD",
            Description = "Electronics shipment",
            Weight = 20000m
        };

        _listingRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Listing>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Listing l, CancellationToken ct) => l);

        // Act
        var result = await _sut.CreateListingAsync(createDto, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be(createDto.UserId);
        result.Rate.Should().Be(createDto.Rate);
        result.Status.Should().Be("Open");

        _listingRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Listing>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetListingByIdAsync_ExistingId_ShouldReturnListingDto()
    {
        // Arrange
        var listingId = Guid.NewGuid();
        var listing = CreateTestListing(listingId);

        _listingRepositoryMock.Setup(r => r.GetByIdAsync(listingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(listing);

        // Act
        var result = await _sut.GetListingByIdAsync(listingId, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(listingId);
    }

    [Fact]
    public async Task GetListingByIdAsync_NonExistingId_ShouldReturnNull()
    {
        // Arrange
        var listingId = Guid.NewGuid();

        _listingRepositoryMock.Setup(r => r.GetByIdAsync(listingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Listing?)null);

        // Act
        var result = await _sut.GetListingByIdAsync(listingId, CancellationToken.None);

        // Assert
        result.Should().BeNull();
    }

    private Listing CreateTestListing(Guid id)
    {
        var listing = new Listing(
            Guid.NewGuid(),
            new Address("123 Main St", "New York", "NY", "10001", "USA"),
            new Address("456 Oak Ave", "Los Angeles", "CA", "90001", "USA"),
            DateTime.UtcNow.AddDays(7),
            DateTime.UtcNow.AddDays(10),
            new Money(1500.00m, "USD"),
            "Test shipment",
            20000m
        );

        typeof(Listing).GetProperty("Id")!.SetValue(listing, id);
        return listing;
    }
}
```

### Frontend Unit Testing (React)

#### Tools & Frameworks

- **Jest**: Test runner and framework
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom matchers

#### Example: React Component Unit Test

```typescript
// src/Frontend/packages/shipper-mfe/src/components/ListingCard.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListingCard } from './ListingCard';
import { Listing } from '../types';

describe('ListingCard', () => {
  const mockListing: Listing = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    origin: '123 Main St, New York, NY 10001',
    destination: '456 Oak Ave, Los Angeles, CA 90001',
    pickupDate: '2026-07-30T10:00:00Z',
    deliveryDate: '2026-08-02T16:00:00Z',
    rate: 1500.00,
    currency: 'USD',
    status: 'Open',
    description: 'Electronics shipment',
    weight: 20000,
    bidCount: 5
  };

  const mockOnViewDetails = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders listing information correctly', () => {
    render(
      <ListingCard
        listing={mockListing}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText(/New York, NY/i)).toBeInTheDocument();
    expect(screen.getByText(/Los Angeles, CA/i)).toBeInTheDocument();
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('5 bids')).toBeInTheDocument();
  });

  it('calls onViewDetails when View Details button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ListingCard
        listing={mockListing}
        onViewDetails={mockOnViewDetails}
      />
    );

    const viewButton = screen.getByRole('button', { name: /view details/i });
    await user.click(viewButton);

    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockListing.id);
  });

  it('displays status badge with correct color', () => {
    const { rerender } = render(
      <ListingCard listing={mockListing} onViewDetails={mockOnViewDetails} />
    );

    expect(screen.getByText('Open')).toHaveClass('badge-success');

    rerender(
      <ListingCard
        listing={{ ...mockListing, status: 'Closed' }}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Closed')).toHaveClass('badge-secondary');
  });

  it('shows edit and close buttons when user is listing owner', () => {
    render(
      <ListingCard
        listing={mockListing}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
        isOwner={true}
      />
    );

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('does not show edit and close buttons when user is not owner', () => {
    render(
      <ListingCard
        listing={mockListing}
        onViewDetails={mockOnViewDetails}
        isOwner={false}
      />
    );

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
});
```

#### Example: React Hook Unit Test

```typescript
// src/Frontend/packages/shared/src/hooks/useListings.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useListings } from './useListings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const server = setupServer(
  rest.get('/api/listings', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: '1',
            origin: 'New York',
            destination: 'Los Angeles',
            rate: 1500,
            status: 'Open'
          }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useListings', () => {
  it('fetches listings successfully', async () => {
    const { result } = renderHook(() => useListings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].origin).toBe('New York');
  });

  it('handles error state', async () => {
    server.use(
      rest.get('/api/listings', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useListings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('filters listings by status', async () => {
    const { result } = renderHook(
      () => useListings({ status: 'Open' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const url = new URL(server.listHandlers()[0].info.path);
    expect(url.searchParams.get('status')).toBe('Open');
  });
});
```

---

## Integration Testing

### Backend Integration Testing

#### Tools & Frameworks

- **xUnit**: Test framework
- **WebApplicationFactory**: In-memory API testing
- **Testcontainers**: Docker containers for dependencies
- **Respawn**: Database cleanup
- **FluentAssertions**: Assertions

#### Setup: Test Fixture

```csharp
// tests/LogisticsMarketplace.Service.Integration.Tests/Infrastructure/IntegrationTestFixture.cs

using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Respawn;
using Xunit;

namespace LogisticsMarketplace.Service.Integration.Tests.Infrastructure;

public class IntegrationTestFixture : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly IContainer _postgresContainer;
    private Respawner _respawner = default!;
    private string _connectionString = default!;

    public IntegrationTestFixture()
    {
        _postgresContainer = new ContainerBuilder()
            .WithImage("postgres:15-alpine")
            .WithEnvironment("POSTGRES_USER", "test")
            .WithEnvironment("POSTGRES_PASSWORD", "test")
            .WithEnvironment("POSTGRES_DB", "logistics_test")
            .WithPortBinding(5432, true)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432))
            .Build();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // Remove existing DbContext
            services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
            services.RemoveAll<ApplicationDbContext>();

            // Add test DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(_connectionString));

            // Build service provider and ensure database is created
            var serviceProvider = services.BuildServiceProvider();
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.Migrate();
        });
    }

    public async Task InitializeAsync()
    {
        await _postgresContainer.StartAsync();
        
        var port = _postgresContainer.GetMappedPublicPort(5432);
        _connectionString = $"Host=localhost;Port={port};Database=logistics_test;Username=test;Password=test";

        _respawner = await Respawner.CreateAsync(_connectionString, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = new[] { "public" }
        });
    }

    public async Task ResetDatabaseAsync()
    {
        await _respawner.ResetAsync(_connectionString);
    }

    public new async Task DisposeAsync()
    {
        await _postgresContainer.DisposeAsync();
    }
}

[CollectionDefinition("Integration Tests")]
public class IntegrationTestCollection : ICollectionFixture<IntegrationTestFixture>
{
}
```

#### Example: API Integration Test

```csharp
// tests/LogisticsMarketplace.Service.Integration.Tests/Controllers/ListingsControllerTests.cs

using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Integration.Tests.Infrastructure;
using Xunit;

namespace LogisticsMarketplace.Service.Integration.Tests.Controllers;

[Collection("Integration Tests")]
public class ListingsControllerTests : IAsyncLifetime
{
    private readonly IntegrationTestFixture _fixture;
    private readonly HttpClient _client;

    public ListingsControllerTests(IntegrationTestFixture fixture)
    {
        _fixture = fixture;
        _client = fixture.CreateClient();
    }

    public Task InitializeAsync() => Task.CompletedTask;
    
    public async Task DisposeAsync() => await _fixture.ResetDatabaseAsync();

    [Fact]
    public async Task CreateListing_ValidRequest_ReturnsCreatedListing()
    {
        // Arrange
        var createDto = new CreateListingDto
        {
            UserId = Guid.NewGuid(),
            OriginAddress = "123 Main St, New York, NY 10001",
            DestinationAddress = "456 Oak Ave, Los Angeles, CA 90001",
            PickupDate = DateTime.UtcNow.AddDays(7),
            DeliveryDate = DateTime.UtcNow.AddDays(10),
            Rate = 1500.00m,
            Currency = "USD",
            Description = "Electronics shipment",
            Weight = 20000m
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/listings", createDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var result = await response.Content.ReadFromJsonAsync<ListingDto>();
        result.Should().NotBeNull();
        result!.Id.Should().NotBeEmpty();
        result.UserId.Should().Be(createDto.UserId);
        result.Rate.Should().Be(createDto.Rate);
        result.Status.Should().Be("Open");
    }

    [Fact]
    public async Task GetListing_ExistingId_ReturnsListing()
    {
        // Arrange
        var listing = await CreateTestListingAsync();

        // Act
        var response = await _client.GetAsync($"/api/listings/{listing.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var result = await response.Content.ReadFromJsonAsync<ListingDto>();
        result.Should().NotBeNull();
        result!.Id.Should().Be(listing.Id);
    }

    [Fact]
    public async Task GetListing_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        var nonExistingId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/listings/{nonExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetAllListings_ReturnsListings()
    {
        // Arrange
        await CreateTestListingAsync();
        await CreateTestListingAsync();

        // Act
        var response = await _client.GetAsync("/api/listings");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var result = await response.Content.ReadFromJsonAsync<List<ListingDto>>();
        result.Should().NotBeNull();
        result!.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task UpdateListing_ValidRequest_ReturnsUpdatedListing()
    {
        // Arrange
        var listing = await CreateTestListingAsync();
        var updateDto = new UpdateListingDto
        {
            Rate = 1600.00m,
            Description = "Updated description"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/listings/{listing.Id}", updateDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var result = await response.Content.ReadFromJsonAsync<ListingDto>();
        result.Should().NotBeNull();
        result!.Rate.Should().Be(1600.00m);
        result.Description.Should().Be("Updated description");
    }

    [Fact]
    public async Task DeleteListing_ExistingId_ReturnsNoContent()
    {
        // Arrange
        var listing = await CreateTestListingAsync();

        // Act
        var response = await _client.DeleteAsync($"/api/listings/{listing.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify deletion
        var getResponse = await _client.GetAsync($"/api/listings/{listing.Id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private async Task<ListingDto> CreateTestListingAsync()
    {
        var createDto = new CreateListingDto
        {
            UserId = Guid.NewGuid(),
            OriginAddress = "123 Main St, New York, NY 10001",
            DestinationAddress = "456 Oak Ave, Los Angeles, CA 90001",
            PickupDate = DateTime.UtcNow.AddDays(7),
            DeliveryDate = DateTime.UtcNow.AddDays(10),
            Rate = 1500.00m,
            Currency = "USD",
            Description = "Test shipment",
            Weight = 20000m
        };

        var response = await _client.PostAsJsonAsync("/api/listings", createDto);
        response.EnsureSuccessStatusCode();
        
        return (await response.Content.ReadFromJsonAsync<ListingDto>())!;
    }
}
```

---

## End-to-End Testing

### Tools & Frameworks

- **Playwright**: Browser automation
- **TypeScript**: Test implementation
- **Page Object Model**: Test structure

#### Setup: Playwright Configuration

```typescript
// src/Frontend/e2e/playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

#### Example: E2E Test with Page Objects

```typescript
// src/Frontend/e2e/pages/ListingsPage.ts

import { Page, Locator } from '@playwright/test';

export class ListingsPage {
  readonly page: Page;
  readonly createListingButton: Locator;
  readonly listingCards: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createListingButton = page.getByRole('button', { name: /create listing/i });
    this.listingCards = page.locator('[data-testid="listing-card"]');
    this.searchInput = page.getByPlaceholder(/search listings/i);
    this.statusFilter = page.getByLabel(/status filter/i);
  }

  async goto() {
    await this.page.goto('/listings');
  }

  async createNewListing(data: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    rate: number;
    weight: number;
    description: string;
  }) {
    await this.createListingButton.click();
    
    await this.page.getByLabel(/origin/i).fill(data.origin);
    await this.page.getByLabel(/destination/i).fill(data.destination);
    await this.page.getByLabel(/pickup date/i).fill(data.pickupDate);
    await this.page.getByLabel(/delivery date/i).fill(data.deliveryDate);
    await this.page.getByLabel(/rate/i).fill(data.rate.toString());
    await this.page.getByLabel(/weight/i).fill(data.weight.toString());
    await this.page.getByLabel(/description/i).fill(data.description);
    
    await this.page.getByRole('button', { name: /submit/i }).click();
  }

  async searchListings(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
  }

  async getListingCount(): Promise<number> {
    return await this.listingCards.count();
  }

  async clickListingByIndex(index: number) {
    await this.listingCards.nth(index).click();
  }
}
```

```typescript
// src/Frontend/e2e/tests/listing-workflow.spec.ts

import { test, expect } from '@playwright/test';
import { ListingsPage } from '../pages/ListingsPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Listing Management Workflow', () => {
  let listingsPage: ListingsPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    listingsPage = new ListingsPage(page);

    // Login as shipper
    await loginPage.goto();
    await loginPage.login('shipper@test.com', 'password123');
  });

  test('should create a new listing successfully', async ({ page }) => {
    await listingsPage.goto();
    
    const listingData = {
      origin: '123 Main St, New York, NY 10001',
      destination: '456 Oak Ave, Los Angeles, CA 90001',
      pickupDate: '2026-08-01',
      deliveryDate: '2026-08-05',
      rate: 1500,
      weight: 20000,
      description: 'Electronics shipment - fragile items'
    };

    await listingsPage.createNewListing(listingData);

    // Verify success message
    await expect(page.getByText(/listing created successfully/i)).toBeVisible();

    // Verify listing appears in list
    await listingsPage.goto();
    const listingCard = page.locator('[data-testid="listing-card"]').first();
    await expect(listingCard).toContainText('New York');
    await expect(listingCard).toContainText('Los Angeles');
    await expect(listingCard).toContainText('$1,500');
  });

  test('should search and filter listings', async ({ page }) => {
    await listingsPage.goto();

    // Search for listings
    await listingsPage.searchListings('New York');
    await page.waitForLoadState('networkidle');

    // Verify search results
    const searchResults = await listingsPage.getListingCount();
    expect(searchResults).toBeGreaterThan(0);

    // Filter by status
    await listingsPage.filterByStatus('Open');
    await page.waitForLoadState('networkidle');

    // Verify all results have "Open" status
    const statusBadges = page.locator('[data-testid="status-badge"]');
    const count = await statusBadges.count();
    for (let i = 0; i < count; i++) {
      await expect(statusBadges.nth(i)).toHaveText('Open');
    }
  });

  test('should view listing details and place bid', async ({ page }) => {
    await listingsPage.goto();
    await listingsPage.clickListingByIndex(0);

    // Verify listing details page
    await expect(page).toHaveURL(/\/listings\/[a-f0-9-]+/);
    await expect(page.getByRole('heading', { name: /listing details/i })).toBeVisible();

    // Place a bid (as carrier)
    await loginPage.logout();
    await loginPage.login('carrier@test.com', 'password123');
    
    await page.getByRole('button', { name: /place bid/i }).click();
    await page.getByLabel(/bid amount/i).fill('1400');
    await page.getByLabel(/notes/i).fill('Competitive rate with excellent service');
    await page.getByRole('button', { name: /submit bid/i }).click();

    // Verify success
    await expect(page.getByText(/bid placed successfully/i)).toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    await listingsPage.goto();
    await listingsPage.createListingButton.click();

    // Try to submit without required fields
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify validation messages
    await expect(page.getByText(/origin is required/i)).toBeVisible();
    await expect(page.getByText(/destination is required/i)).toBeVisible();
    await expect(page.getByText(/pickup date is required/i)).toBeVisible();
  });
});
```

---

## API Testing

### Postman Collections

#### Collection Structure

```json
{
  "info": {
    "name": "LogisticsMarketplace API",
    "description": "Comprehensive API tests for LogisticsMarketplace",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api",
      "type": "string"
    },
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Listings",
      "item": [
        {
          "name": "Create Listing",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 201', function() {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Response has listing ID', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.collectionVariables.set('listingId', jsonData.id);",
                  "});",
                  "",
                  "pm.test('Listing status is Open', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.status).to.equal('Open');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"originAddress\": \"123 Main St, New York, NY 10001\",\n  \"destinationAddress\": \"456 Oak Ave, Los Angeles, CA 90001\",\n  \"pickupDate\": \"2026-08-01T10:00:00Z\",\n  \"deliveryDate\": \"2026-08-05T16:00:00Z\",\n  \"rate\": 1500.00,\n  \"currency\": \"USD\",\n  \"description\": \"Electronics shipment\",\n  \"weight\": 20000\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/listings",
              "host": ["{{baseUrl}}"],
              "path": ["listings"]
            }
          }
        },
        {
          "name": "Get All Listings",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function() {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response is an array', function() {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});",
                  "",
                  "pm.test('Response time is less than 500ms', function() {",
                  "    pm.expect(pm.response.responseTime).to.be.below(500);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/listings?status=Open&page=1&pageSize=20",
              "host": ["{{baseUrl}}"],
              "path": ["listings"],
              "query": [
                {
                  "key": "status",
                  "value": "Open"
                },
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "pageSize",
                  "value": "20"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

### REST Client (.http files)

```http
### Variables
@baseUrl = http://localhost:5000/api
@bffUrl = http://localhost:5001/api
@accessToken = your_access_token_here

### Health Check
GET {{baseUrl}}/health

### Create Listing
# @name createListing
POST {{baseUrl}}/listings
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
  "userId": "{{$guid}}",
  "originAddress": "123 Main St, New York, NY 10001",
  "destinationAddress": "456 Oak Ave, Los Angeles, CA 90001",
  "pickupDate": "2026-08-01T10:00:00Z",
  "deliveryDate": "2026-08-05T16:00:00Z",
  "rate": 1500.00,
  "currency": "USD",
  "description": "Electronics shipment - fragile items",
  "weight": 20000
}

### Get Listing by ID
@listingId = {{createListing.response.body.id}}
GET {{baseUrl}}/listings/{{listingId}}
Authorization: Bearer {{accessToken}}

### Update Listing
PUT {{baseUrl}}/listings/{{listingId}}
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
  "rate": 1600.00,
  "description": "Updated: Electronics shipment - urgent delivery"
}

### Get Bids for Listing
GET {{baseUrl}}/bids/listing/{{listingId}}
Authorization: Bearer {{accessToken}}

### Place Bid
POST {{baseUrl}}/bids
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
  "listingId": "{{listingId}}",
  "bidderId": "{{$guid}}",
  "amount": 1400.00,
  "currency": "USD",
  "notes": "Competitive rate with excellent service record"
}

### Accept Bid and Create Deal
POST {{baseUrl}}/deals
Content-Type: application/json
Authorization: Bearer {{accessToken}}

{
  "listingId": "{{listingId}}",
  "bidId": "bid-id-here",
  "terms": "Standard terms and conditions apply"
}
```

---

## Test Data Management

### Test Data Builders

```csharp
// tests/LogisticsMarketplace.Service.Tests.Common/Builders/ListingBuilder.cs

using LogisticsMarketplace.Service.Domain.Entities;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Tests.Common.Builders;

public class ListingBuilder
{
    private Guid _userId = Guid.NewGuid();
    private Address _origin = new("123 Main St", "New York", "NY", "10001", "USA");
    private Address _destination = new("456 Oak Ave", "Los Angeles", "CA", "90001", "USA");
    private DateTime _pickupDate = DateTime.UtcNow.AddDays(7);
    private DateTime _deliveryDate = DateTime.UtcNow.AddDays(10);
    private Money _rate = new(1500.00m, "USD");
    private string _description = "Test shipment";
    private decimal _weight = 20000m;

    public ListingBuilder WithUserId(Guid userId)
    {
        _userId = userId;
        return this;
    }

    public ListingBuilder WithOrigin(Address origin)
    {
        _origin = origin;
        return this;
    }

    public ListingBuilder WithDestination(Address destination)
    {
        _destination = destination;
        return this;
    }

    public ListingBuilder WithRate(decimal amount, string currency = "USD")
    {
        _rate = new Money(amount, currency);
        return this;
    }

    public ListingBuilder WithPickupDate(DateTime pickupDate)
    {
        _pickupDate = pickupDate;
        return this;
    }

    public ListingBuilder WithDeliveryDate(DateTime deliveryDate)
    {
        _deliveryDate = deliveryDate;
        return this;
    }

    public ListingBuilder WithDescription(string description)
    {
        _description = description;
        return this;
    }

    public ListingBuilder WithWeight(decimal weight)
    {
        _weight = weight;
        return this;
    }

    public Listing Build()
    {
        return new Listing(
            _userId,
            _origin,
            _destination,
            _pickupDate,
            _deliveryDate,
            _rate,
            _description,
            _weight
        );
    }
}

// Usage:
var listing = new ListingBuilder()
    .WithRate(2000.00m)
    .WithWeight(30000m)
    .WithDescription("Heavy machinery transport")
    .Build();
```

### Test Data Fixtures

```typescript
// src/Frontend/packages/shared/src/test-utils/fixtures.ts

import { Listing, Bid, Deal, Vehicle, Driver } from '../types';

export const mockListings: Listing[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '987fcdeb-51a2-43d7-b456-426614174111',
    origin: '123 Main St, New York, NY 10001',
    destination: '456 Oak Ave, Los Angeles, CA 90001',
    pickupDate: '2026-08-01T10:00:00Z',
    deliveryDate: '2026-08-05T16:00:00Z',
    rate: 1500.00,
    currency: 'USD',
    status: 'Open',
    description: 'Electronics shipment',
    weight: 20000,
    bidCount: 5,
    createdAt: '2026-07-22T08:00:00Z',
    updatedAt: '2026-07-22T08:00:00Z'
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    userId: '987fcdeb-51a2-43d7-b456-426614174111',
    origin: '789 Oak Blvd, Chicago, IL 60601',
    destination: '321 Pine Rd, Miami, FL 33101',
    pickupDate: '2026-08-10T09:00:00Z',
    deliveryDate: '2026-08-13T17:00:00Z',
    rate: 2200.00,
    currency: 'USD',
    status: 'Closed',
    description: 'Furniture shipment',
    weight: 35000,
    bidCount: 8,
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-21T14:30:00Z'
  }
];

export const createMockListing = (overrides?: Partial<Listing>): Listing => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  userId: '987fcdeb-51a2-43d7-b456-426614174111',
  origin: '123 Main St, New York, NY 10001',
  destination: '456 Oak Ave, Los Angeles, CA 90001',
  pickupDate: '2026-08-01T10:00:00Z',
  deliveryDate: '2026-08-05T16:00:00Z',
  rate: 1500.00,
  currency: 'USD',
  status: 'Open',
  description: 'Test shipment',
  weight: 20000,
  bidCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});
```

---

## Code Coverage

### Backend Coverage (.NET)

#### Tools
- **Coverlet**: Coverage collector
- **ReportGenerator**: Coverage report generation

#### Configuration

```xml
<!-- Directory.Build.props -->
<Project>
  <PropertyGroup>
    <CollectCoverage>true</CollectCoverage>
    <CoverletOutputFormat>cobertura</CoverletOutputFormat>
    <CoverletOutput>./TestResults/coverage.cobertura.xml</CoverletOutput>
    <Exclude>[*]*.Migrations.*,[*]*.Program,[*]*.Startup</Exclude>
    <ExcludeByAttribute>ExcludeFromCodeCoverage,GeneratedCode</ExcludeByAttribute>
  </PropertyGroup>
</Project>
```

#### Running Coverage

```bash
# Run tests with coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura

# Generate HTML report
reportgenerator \
  -reports:"**/TestResults/coverage.cobertura.xml" \
  -targetdir:"TestResults/CoverageReport" \
  -reporttypes:"Html;Badges"

# Open report
start TestResults/CoverageReport/index.html
```

### Frontend Coverage (Jest)

#### Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.tsx',
    '!src/test-utils/**'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  }
};
```

#### Running Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

---

## Performance Testing

### Backend Performance Tests

```csharp
// tests/LogisticsMarketplace.Service.Performance.Tests/ListingPerformanceTests.cs

using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using LogisticsMarketplace.Service.Application.Services;
using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Performance.Tests;

[MemoryDiagnoser]
[SimpleJob(warmupCount: 3, iterationCount: 10)]
public class ListingPerformanceTests
{
    private ListingService _listingService = default!;
    private List<CreateListingDto> _testData = default!;

    [GlobalSetup]
    public void Setup()
    {
        // Setup test service and data
        _testData = GenerateTestListings(1000);
    }

    [Benchmark]
    public async Task CreateListings_1000_Sequential()
    {
        foreach (var dto in _testData)
        {
            await _listingService.CreateListingAsync(dto, CancellationToken.None);
        }
    }

    [Benchmark]
    public async Task CreateListings_1000_Parallel()
    {
        var tasks = _testData.Select(dto =>
            _listingService.CreateListingAsync(dto, CancellationToken.None)
        );
        await Task.WhenAll(tasks);
    }

    [Benchmark]
    public async Task GetListings_WithPagination()
    {
        await _listingService.GetListingsAsync(1, 100, CancellationToken.None);
    }

    private List<CreateListingDto> GenerateTestListings(int count)
    {
        // Generate test data
        return Enumerable.Range(0, count)
            .Select(i => new CreateListingDto
            {
                UserId = Guid.NewGuid(),
                OriginAddress = $"Origin {i}",
                DestinationAddress = $"Destination {i}",
                PickupDate = DateTime.UtcNow.AddDays(7),
                DeliveryDate = DateTime.UtcNow.AddDays(10),
                Rate = 1500.00m + i,
                Currency = "USD",
                Description = $"Test shipment {i}",
                Weight = 20000m
            })
            .ToList();
    }
}

// Program.cs
public class Program
{
    public static void Main(string[] args)
    {
        BenchmarkRunner.Run<ListingPerformanceTests>();
    }
}
```

### Load Testing (k6)

```javascript
// tests/Performance/load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    failed_requests: ['rate<0.05'],   // Error rate must be below 5%
  },
};

const BASE_URL = 'http://localhost:5001/api';

export default function () {
  // Get all listings
  let res = http.get(`${BASE_URL}/listings`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  }) || failureRate.add(1);

  sleep(1);

  // Create listing
  const payload = JSON.stringify({
    userId: '123e4567-e89b-12d3-a456-426614174000',
    originAddress: '123 Main St, New York, NY 10001',
    destinationAddress: '456 Oak Ave, Los Angeles, CA 90001',
    pickupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    rate: 1500.00,
    currency: 'USD',
    description: 'Load test shipment',
    weight: 20000
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  res = http.post(`${BASE_URL}/listings`, payload, params);
  
  check(res, {
    'create status is 201': (r) => r.status === 201,
    'create response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || failureRate.add(1);

  sleep(1);
}
```

---

## Test Organization & Structure

### Test Naming Conventions

#### Backend (.NET)
```
MethodName_StateUnderTest_ExpectedBehavior

Examples:
- CreateListing_ValidDto_ReturnsListingDto
- PlaceBid_ClosedListing_ThrowsInvalidOperationException
- GetListingById_NonExistingId_ReturnsNull
- UpdateListing_ValidUpdate_UpdatesSuccessfully
```

#### Frontend (Jest/React Testing Library)
```
"should [expected behavior] when [state/action]"

Examples:
- "should render listing card with correct information"
- "should call onViewDetails when button is clicked"
- "should display error message when API call fails"
- "should filter listings by status"
```

### Test File Organization

```
tests/
├── Unit/                          # Unit tests
│   ├── Domain/
│   ├── Application/
│   └── Infrastructure/
├── Integration/                   # Integration tests
│   ├── Api/
│   ├── Database/
│   └── Infrastructure/
├── E2E/                          # End-to-end tests
│   ├── pages/                    # Page objects
│   └── tests/                    # Test scenarios
├── Performance/                   # Performance tests
│   ├── Benchmarks/
│   └── LoadTests/
└── Common/                       # Shared test utilities
    ├── Builders/
    ├── Fixtures/
    └── Helpers/
```

---

## Mocking & Test Doubles

### Backend Mocking Strategies

#### Repository Mocking
```csharp
var mockRepository = new Mock<IRepository<Listing>>();

mockRepository
    .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
    .ReturnsAsync(new Listing(/* ... */));

mockRepository
    .Setup(r => r.AddAsync(It.IsAny<Listing>(), It.IsAny<CancellationToken>()))
    .ReturnsAsync((Listing l, CancellationToken ct) => l);

mockRepository
    .Verify(r => r.AddAsync(It.IsAny<Listing>(), It.IsAny<CancellationToken>()), Times.Once);
```

#### HTTP Client Mocking
```csharp
var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

mockHttpMessageHandler
    .Protected()
    .Setup<Task<HttpResponseMessage>>(
        "SendAsync",
        ItExpr.IsAny<HttpRequestMessage>(),
        ItExpr.IsAny<CancellationToken>()
    )
    .ReturnsAsync(new HttpResponseMessage
    {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(responseData))
    });

var httpClient = new HttpClient(mockHttpMessageHandler.Object);
```

### Frontend Mocking Strategies

#### API Mocking with MSW
```typescript
// src/Frontend/packages/shared/src/test-utils/mocks/handlers.ts

import { rest } from 'msw';

export const handlers = [
  rest.get('/api/listings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockListings
      })
    );
  }),

  rest.post('/api/listings', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { ...body, id: '123', status: 'Open' }
      })
    );
  }),

  rest.get('/api/listings/:id', (req, res, ctx) => {
    const { id } = req.params;
    const listing = mockListings.find(l => l.id === id);
    
    if (!listing) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, error: 'Not found' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ success: true, data: listing })
    );
  }),
];
```

```typescript
// src/Frontend/packages/shared/src/test-utils/mocks/server.ts

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// src/Frontend/packages/shipper-mfe/src/setupTests.ts

import '@testing-library/jest-dom';
import { server } from '@logistics/shared/test-utils/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## CI Integration

### Running Tests in CI

```yaml
# .github/workflows/tests.yml (partial)

- name: Run Backend Unit Tests
  run: dotnet test --no-build --verbosity normal --logger "trx;LogFileName=test-results.trx"

- name: Run Backend Integration Tests
  run: dotnet test tests/LogisticsMarketplace.Service.Integration.Tests --logger "trx;LogFileName=integration-results.trx"

- name: Run Frontend Tests
  working-directory: src/Frontend
  run: npm test -- --ci --coverage --maxWorkers=2

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      **/TestResults/*.trx
      **/coverage/
      **/test-results/
```

---

## Best Practices

### General Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
   ```csharp
   [Fact]
   public void Test_Method()
   {
       // Arrange
       var sut = new SystemUnderTest();
       var input = "test";

       // Act
       var result = sut.Method(input);

       // Assert
       result.Should().Be("expected");
   }
   ```

2. **One Assertion Per Test** (when possible)
   - Focus each test on a single behavior
   - Makes failures easier to diagnose

3. **Test Independence**
   - Tests should not depend on each other
   - Each test should set up its own data

4. **Avoid Test Logic**
   - No conditional statements in tests
   - Tests should be straightforward and readable

5. **Use Meaningful Test Names**
   - Test names should describe what is being tested
   - Include the expected outcome

### Domain-Driven Design Testing

1. **Test Business Rules in Domain Layer**
   ```csharp
   [Fact]
   public void Listing_CannotAcceptBid_WhenClosed()
   {
       var listing = CreateListing();
       listing.Close();
       
       Action act = () => listing.AcceptBid(bidId);
       
       act.Should().Throw<DomainException>()
           .WithMessage("Cannot accept bid on closed listing");
   }
   ```

2. **Test Aggregate Consistency**
   - Verify invariants are maintained
   - Test state transitions

3. **Test Value Objects**
   - Test equality
   - Test validation
   - Test immutability

### Performance Testing Best Practices

1. **Establish Baselines**
   - Measure current performance
   - Set realistic targets

2. **Test Realistic Scenarios**
   - Use production-like data volumes
   - Simulate real user behavior

3. **Monitor Resource Usage**
   - CPU, Memory, Database connections
   - Identify bottlenecks

4. **Automate Performance Tests**
   - Run regularly in CI/CD
   - Alert on regressions

### Test Data Management

1. **Use Test Data Builders**
   - Improves test readability
   - Reduces duplication

2. **Isolate Test Data**
   - Use separate test database
   - Clean up after tests

3. **Use Realistic Data**
   - Mirror production data structure
   - Test edge cases

### Code Coverage Guidelines

1. **Aim for High Coverage**
   - Domain layer: 90%+
   - Application layer: 80%+
   - Infrastructure layer: 70%+

2. **Focus on Critical Paths**
   - Business logic
   - Error handling
   - Edge cases

3. **Don't Obsess Over 100%**
   - Some code is not worth testing
   - Focus on meaningful coverage

---

## Summary

This comprehensive testing infrastructure ensures:
- **Quality**: Catch bugs early in development
- **Confidence**: Safe refactoring and changes
- **Documentation**: Tests serve as living documentation
- **Speed**: Fast feedback loop
- **Reliability**: Consistent, reproducible results

### Next Steps

1. Implement unit tests for all domain entities
2. Set up integration test infrastructure
3. Create E2E test scenarios for critical workflows
4. Configure code coverage reporting
5. Integrate tests into CI/CD pipeline
6. Establish performance baselines
7. Create test data management utilities

---

**Related Documentation:**
- [EPIC-G-CICD-GITHUB-ACTIONS.md](./EPIC-G-CICD-GITHUB-ACTIONS.md)
- [Development Guide](../README.md)
- [API Documentation](../docs/API.md)
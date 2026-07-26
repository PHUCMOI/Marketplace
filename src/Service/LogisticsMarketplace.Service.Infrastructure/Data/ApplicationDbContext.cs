using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.LocationAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.OrderAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.UserAggregate;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Data;

public sealed class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<Bid> Bids => Set<Bid>();
    public DbSet<Deal> Deals => Set<Deal>();
    public DbSet<Dispatch> Dispatches => Set<Dispatch>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
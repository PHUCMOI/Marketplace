using LogisticsMarketplace.Service.Domain.Aggregates.LocationAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class LocationRepository : ILocationRepository
{
    private readonly ApplicationDbContext _context;

    public LocationRepository(ApplicationDbContext context) => _context = context;

    public async Task AddAsync(Location location, CancellationToken cancellationToken = default) =>
        await _context.Locations.AddAsync(location, cancellationToken);
}

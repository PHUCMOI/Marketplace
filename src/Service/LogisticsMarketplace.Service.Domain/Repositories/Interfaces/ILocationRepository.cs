using LogisticsMarketplace.Service.Domain.Aggregates.LocationAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface ILocationRepository
{
    Task AddAsync(Location location, CancellationToken cancellationToken = default);
}

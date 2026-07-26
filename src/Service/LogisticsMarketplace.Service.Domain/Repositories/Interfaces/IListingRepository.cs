using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IListingRepository
{
    Task<Listing?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Listing>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Listing>> GetOpenAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Listing>> GetByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default);
    Task AddAsync(Listing listing, CancellationToken cancellationToken = default);
    void Remove(Listing listing);
}
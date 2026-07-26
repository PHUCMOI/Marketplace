using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IDealRepository
{
    Task<Deal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Deal?> GetByListingIdAsync(Guid listingId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Deal>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Deal>> GetByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Deal>> GetByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task AddAsync(Deal deal, CancellationToken cancellationToken = default);
    void Remove(Deal deal);
}
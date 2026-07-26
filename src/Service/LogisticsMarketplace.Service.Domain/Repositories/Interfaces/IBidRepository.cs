using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IBidRepository
{
    Task<Bid?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Bid>> GetForListingAsync(Guid listingId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Bid>> GetForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Bid>> GetPendingForListingAsync(Guid listingId, CancellationToken cancellationToken = default);
    Task<bool> HasActiveBidAsync(Guid listingId, Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task AddAsync(Bid bid, CancellationToken cancellationToken = default);
}
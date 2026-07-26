using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IDealService
{
    Task<IEnumerable<DealDto>> GetAllDealsAsync(CancellationToken cancellationToken = default);
    Task<DealDto?> GetDealByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DealDto?> GetDealByListingIdAsync(Guid listingId, CancellationToken cancellationToken = default);
    Task<IEnumerable<DealDto>> GetDealsByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default);
    Task<IEnumerable<DealDto>> GetDealsByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task CompleteDealAsync(Guid dealId, Guid completedByUserId, CancellationToken cancellationToken = default);
    Task CancelDealAsync(Guid dealId, Guid cancelledByUserId, CancellationToken cancellationToken = default);
}
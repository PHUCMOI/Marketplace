using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IBidService
{
    Task<BidDto?> GetBidByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidDto>> GetBidsForListingAsync(Guid listingId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BidDto>> GetBidsForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task<BidDto> PlaceBidAsync(CreateBidDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task WithdrawBidAsync(Guid bidId, CancellationToken cancellationToken = default);
}
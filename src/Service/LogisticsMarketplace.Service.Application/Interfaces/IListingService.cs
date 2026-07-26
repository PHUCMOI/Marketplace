using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IListingService
{
    Task<IEnumerable<ListingDto>> GetAllListingsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ListingDto>> GetOpenListingsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ListingDto>> GetListingsByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default);
    Task<ListingDto?> GetListingByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ListingDto> CreateListingAsync(CreateListingDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<ListingDto> UpdateListingAsync(Guid id, UpdateListingDto dto, CancellationToken cancellationToken = default);
    Task PublishListingAsync(Guid id, CancellationToken cancellationToken = default);
    Task CancelListingAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeleteListingAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DealDto> AwardDealAsync(Guid listingId, Guid bidId, CancellationToken cancellationToken = default);
}
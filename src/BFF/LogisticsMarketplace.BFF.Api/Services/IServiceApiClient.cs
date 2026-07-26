using LogisticsMarketplace.BFF.Api.Models;

namespace LogisticsMarketplace.BFF.Api.Services;

public interface IServiceApiClient
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    Task<List<ListingResponse>> GetOpenListingsAsync(CancellationToken cancellationToken = default);
    Task<List<ListingResponse>> GetListingsForShipperAsync(Guid shipperOrgId, CancellationToken cancellationToken = default);
    Task<ListingDetailResponse?> GetListingByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ListingResponse> CreateListingAsync(CreateListingRequest request, CancellationToken cancellationToken = default);
    Task<ListingResponse> UpdateListingAsync(Guid id, UpdateListingRequest request, CancellationToken cancellationToken = default);
    Task DeleteListingAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DealResponse> AwardListingAsync(Guid listingId, Guid bidId, CancellationToken cancellationToken = default);

    Task<List<BidResponse>> GetBidsForListingAsync(Guid listingId, CancellationToken cancellationToken = default);
    Task<List<BidResponse>> GetBidsForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task<BidResponse> CreateBidAsync(CreateBidRequest request, CancellationToken cancellationToken = default);
    Task DeleteBidAsync(Guid bidId, CancellationToken cancellationToken = default);

    Task<List<DealResponse>> GetDealsAsync(CancellationToken cancellationToken = default);
    Task<List<DealResponse>> GetDealsForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task<List<DealResponse>> GetDealsForShipperAsync(Guid shipperOrgId, CancellationToken cancellationToken = default);
    Task<DealResponse?> GetDealByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task CancelDealAsync(Guid id, CancellationToken cancellationToken = default);

    Task<List<DispatchResponse>> GetDispatchesForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task<DispatchResponse> CreateDispatchAsync(CreateDispatchRequest request, CancellationToken cancellationToken = default);
    Task<DispatchResponse> AssignDispatchAsync(Guid dispatchId, AssignDispatchRequest request, CancellationToken cancellationToken = default);
    Task<DispatchResponse> UpdateDispatchStatusAsync(Guid dispatchId, UpdateDispatchStatusRequest request, CancellationToken cancellationToken = default);

    Task<List<VehicleResponse>> GetVehiclesAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<VehicleResponse> CreateVehicleAsync(CreateVehicleRequest request, CancellationToken cancellationToken = default);
    Task<List<DriverResponse>> GetDriversAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<DriverResponse> CreateDriverAsync(CreateDriverRequest request, CancellationToken cancellationToken = default);
}
using System.Net.Http.Json;
using System.Text.Json;
using LogisticsMarketplace.BFF.Api.Models;

namespace LogisticsMarketplace.BFF.Api.Services;

public sealed class ServiceApiClient : IServiceApiClient
{
    private readonly HttpClient _client;
    private readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    public ServiceApiClient(HttpClient client) => _client = client;

    public Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<AuthResponse>("/api/auth/login", request, cancellationToken);

    public Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<AuthResponse>("/api/auth/register", request, cancellationToken);

    public Task<List<VietnamProvinceResponse>> GetVietnamProvincesAsync(CancellationToken cancellationToken = default) =>
        GetListAsync<VietnamProvinceResponse>("/api/locations/vietnam-provinces", cancellationToken);

    public Task<List<ListingResponse>> GetOpenListingsAsync(CancellationToken cancellationToken = default) =>
        GetListAsync<ListingResponse>("/api/listings/open", cancellationToken);

    public Task<List<ListingResponse>> GetListingsForShipperAsync(Guid shipperOrgId, CancellationToken cancellationToken = default) =>
        GetListAsync<ListingResponse>($"/api/listings/shipper/{shipperOrgId}", cancellationToken);

    public async Task<ListingDetailResponse?> GetListingByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var listing = await GetAsync<ListingResponse>($"/api/listings/{id}", cancellationToken);
        if (listing is null)
            return null;

        var bids = await GetListAsync<BidResponse>($"/api/bids/listing/{id}", cancellationToken);
        return new ListingDetailResponse
        {
            Id = listing.Id,
            ShipperOrgId = listing.ShipperOrgId,
            PickupLocationId = listing.PickupLocationId,
            DeliveryLocationId = listing.DeliveryLocationId,
            PickupDate = listing.PickupDate,
            DeliveryDate = listing.DeliveryDate,
            CargoDescription = listing.CargoDescription,
            Weight = listing.Weight,
            Status = listing.Status,
            PriceAmount = listing.PriceAmount,
            PriceCurrency = listing.PriceCurrency,
            CreatedBy = listing.CreatedBy,
            CreatedAt = listing.CreatedAt,
            Bids = bids,
            BidsCount = bids.Count,
            LowestBidAmount = bids.Count == 0 ? null : bids.Min(x => x.ProposedPriceAmount)
        };
    }

    public Task<ListingResponse> CreateListingAsync(CreateListingRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<ListingResponse>("/api/listings", request, cancellationToken);

    public Task<ListingResponse> UpdateListingAsync(Guid id, UpdateListingRequest request, CancellationToken cancellationToken = default) =>
        PutAsync<ListingResponse>($"/api/listings/{id}", request, cancellationToken);

    public Task DeleteListingAsync(Guid id, CancellationToken cancellationToken = default) =>
        DeleteAsync($"/api/listings/{id}", cancellationToken);

    public Task<DealResponse> AwardListingAsync(Guid listingId, Guid bidId, CancellationToken cancellationToken = default) =>
        PostAsync<DealResponse>($"/api/listings/{listingId}/award", new { bidId }, cancellationToken);

    public Task<List<BidResponse>> GetBidsForListingAsync(Guid listingId, CancellationToken cancellationToken = default) =>
        GetListAsync<BidResponse>($"/api/bids/listing/{listingId}", cancellationToken);
    public Task<List<BidResponse>> GetBidsForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        GetListAsync<BidResponse>($"/api/bids/carrier/{carrierOrgId}", cancellationToken);

    public Task<BidResponse> CreateBidAsync(CreateBidRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<BidResponse>("/api/bids", request, cancellationToken);

    public Task DeleteBidAsync(Guid bidId, CancellationToken cancellationToken = default) =>
        DeleteAsync($"/api/bids/{bidId}", cancellationToken);

    public Task<List<DealResponse>> GetDealsAsync(CancellationToken cancellationToken = default) =>
        GetListAsync<DealResponse>("/api/deals", cancellationToken);
    public Task<List<DealResponse>> GetDealsForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        GetListAsync<DealResponse>($"/api/deals/carrier/{carrierOrgId}", cancellationToken);

    public Task<List<DealResponse>> GetDealsForShipperAsync(Guid shipperOrgId, CancellationToken cancellationToken = default) =>
        GetListAsync<DealResponse>($"/api/deals/shipper/{shipperOrgId}", cancellationToken);

    public Task<DealResponse?> GetDealByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        GetAsync<DealResponse>($"/api/deals/{id}", cancellationToken);

    public async Task CancelDealAsync(Guid id, CancellationToken cancellationToken = default)
    {
        using var response = await _client.PostAsync($"/api/deals/{id}/cancel", null, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    public Task<List<DispatchResponse>> GetDispatchesForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        GetListAsync<DispatchResponse>($"/api/dispatches/carrier/{carrierOrgId}", cancellationToken);

    public Task<DispatchResponse> CreateDispatchAsync(CreateDispatchRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<DispatchResponse>("/api/dispatches", request, cancellationToken);

    public Task<DispatchResponse> AssignDispatchAsync(Guid dispatchId, AssignDispatchRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<DispatchResponse>($"/api/dispatches/{dispatchId}/assign", request, cancellationToken);

    public Task<DispatchResponse> UpdateDispatchStatusAsync(Guid dispatchId, UpdateDispatchStatusRequest request, CancellationToken cancellationToken = default) =>
        PatchAsync<DispatchResponse>($"/api/dispatches/{dispatchId}/status", request, cancellationToken);

    public Task<List<VehicleResponse>> GetVehiclesAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        GetListAsync<VehicleResponse>($"/api/vehicles/organization/{organizationId}", cancellationToken);

    public Task<VehicleResponse> CreateVehicleAsync(CreateVehicleRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<VehicleResponse>("/api/vehicles", request, cancellationToken);

    public Task<List<DriverResponse>> GetDriversAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        GetListAsync<DriverResponse>($"/api/drivers/organization/{organizationId}", cancellationToken);

    public Task<DriverResponse> CreateDriverAsync(CreateDriverRequest request, CancellationToken cancellationToken = default) =>
        PostAsync<DriverResponse>("/api/drivers", request, cancellationToken);

    private async Task<T?> GetAsync<T>(string uri, CancellationToken cancellationToken)
    {
        using var response = await _client.GetAsync(uri, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return default;
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>(_json, cancellationToken);
    }

    private async Task<List<T>> GetListAsync<T>(string uri, CancellationToken cancellationToken) =>
        await GetAsync<List<T>>(uri, cancellationToken) ?? new List<T>();

    private async Task<T> PostAsync<T>(string uri, object payload, CancellationToken cancellationToken)
    {
        using var response = await _client.PostAsJsonAsync(uri, payload, _json, cancellationToken);
        return await ReadRequiredAsync<T>(response, cancellationToken);
    }

    private async Task<T> PutAsync<T>(string uri, object payload, CancellationToken cancellationToken)
    {
        using var response = await _client.PutAsJsonAsync(uri, payload, _json, cancellationToken);
        return await ReadRequiredAsync<T>(response, cancellationToken);
    }

    private async Task<T> PatchAsync<T>(string uri, object payload, CancellationToken cancellationToken)
    {
        using var response = await _client.PatchAsJsonAsync(uri, payload, _json, cancellationToken);
        return await ReadRequiredAsync<T>(response, cancellationToken);
    }

    private async Task DeleteAsync(string uri, CancellationToken cancellationToken)
    {
        using var response = await _client.DeleteAsync(uri, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    private async Task<T> ReadRequiredAsync<T>(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>(_json, cancellationToken)
            ?? throw new InvalidOperationException($"Service API returned an empty {typeof(T).Name} response.");
    }
}
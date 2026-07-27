namespace LogisticsMarketplace.BFF.Api.Models;

public class ListingResponse
{
    public Guid Id { get; set; }
    public Guid ShipperOrgId { get; set; }
    public Guid PickupLocationId { get; set; }
    public Guid DeliveryLocationId { get; set; }
    public DateTime PickupDate { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string CargoDescription { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal? PriceAmount { get; set; }
    public string? PriceCurrency { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class ListingDetailResponse : ListingResponse
{
    public int BidsCount { get; set; }
    public decimal? LowestBidAmount { get; set; }
    public List<BidResponse> Bids { get; set; } = new();
}

public sealed class CreateListingRequest
{
    public Guid ShipperOrgId { get; set; }
    public Guid? PickupLocationId { get; set; }
    public Guid? DeliveryLocationId { get; set; }
    public ListingLocationRequest? PickupLocation { get; set; }
    public ListingLocationRequest? DeliveryLocation { get; set; }
    public DateTime PickupDate { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string CargoDescription { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal? PriceAmount { get; set; }
    public string? PriceCurrency { get; set; }
    public bool PublishImmediately { get; set; } = true;
}

public sealed class UpdateListingRequest
{
    public DateTime? PickupDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? CargoDescription { get; set; }
    public decimal? Weight { get; set; }
    public decimal? PriceAmount { get; set; }
    public string? PriceCurrency { get; set; }
}

public sealed class AwardListingRequest
{
    public Guid BidId { get; set; }
}
namespace LogisticsMarketplace.BFF.Api.Models;

/// <summary>
/// Deal response model for frontend
/// </summary>
public class DealResponse
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid AcceptedBidId { get; set; }
    public Guid ShipperOrgId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public decimal AgreedPriceAmount { get; set; }
    public string AgreedPriceCurrency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

/// <summary>
/// Detailed deal response with listing and bid information
/// </summary>
public class DealDetailResponse : DealResponse
{
    public ListingResponse? Listing { get; set; }
    public BidResponse? AcceptedBid { get; set; }
}

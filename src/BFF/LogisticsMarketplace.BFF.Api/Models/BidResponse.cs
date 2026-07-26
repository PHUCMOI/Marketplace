
namespace LogisticsMarketplace.BFF.Api.Models;

/// <summary>
/// Bid response model for frontend
/// </summary>
public class BidResponse
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public decimal ProposedPriceAmount { get; set; }
    public string ProposedPriceCurrency { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Create bid request
/// </summary>
public class CreateBidRequest
{
    public Guid ListingId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public decimal ProposedPriceAmount { get; set; }
    public string ProposedPriceCurrency { get; set; } = "USD";
    public string? Message { get; set; }
}

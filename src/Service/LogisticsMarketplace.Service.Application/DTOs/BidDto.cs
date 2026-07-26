using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.DTOs;

/// <summary>
/// Bid data transfer object
/// </summary>
public class BidDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public decimal ProposedPriceAmount { get; set; }
    public string ProposedPriceCurrency { get; set; } = string.Empty;
    public string? Message { get; set; }
    public BidStatus Status { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Create bid DTO
/// </summary>
public class CreateBidDto
{
    public Guid ListingId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public decimal ProposedPriceAmount { get; set; }
    public string ProposedPriceCurrency { get; set; } = "USD";
    public string? Message { get; set; }
}

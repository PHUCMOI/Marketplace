
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.DTOs;

/// <summary>
/// Deal data transfer object
/// </summary>
public class DealDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid AcceptedBidId { get; set; }
    public Guid ShipperOrgId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public decimal AgreedPriceAmount { get; set; }
    public string AgreedPriceCurrency { get; set; } = string.Empty;
    public DealStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

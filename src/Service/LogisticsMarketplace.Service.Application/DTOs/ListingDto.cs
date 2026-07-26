using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.DTOs;

public class ListingDto
{
    public Guid Id { get; set; }
    public Guid ShipperOrgId { get; set; }
    public Guid PickupLocationId { get; set; }
    public Guid DeliveryLocationId { get; set; }
    public DateTime PickupDate { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string CargoDescription { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public ListingStatus Status { get; set; }
    public decimal? PriceAmount { get; set; }
    public string? PriceCurrency { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateListingDto
{
    public Guid ShipperOrgId { get; set; }
    public Guid PickupLocationId { get; set; }
    public Guid DeliveryLocationId { get; set; }
    public DateTime PickupDate { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string CargoDescription { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal? PriceAmount { get; set; }
    public string? PriceCurrency { get; set; }
    public bool PublishImmediately { get; set; } = true;
}

public class UpdateListingDto
{
    public DateTime? PickupDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? CargoDescription { get; set; }
    public decimal? Weight { get; set; }
    public decimal? PriceAmount { get; set; }
    public string? PriceCurrency { get; set; }
}
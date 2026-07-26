namespace LogisticsMarketplace.BFF.Api.Models;

public sealed class DispatchResponse
{
    public Guid Id { get; set; }
    public Guid DealId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public Guid? VehicleId { get; set; }
    public Guid? DriverId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime ScheduledPickup { get; set; }
    public DateTime ScheduledDelivery { get; set; }
    public DateTime? ActualPickup { get; set; }
    public DateTime? ActualDelivery { get; set; }
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class CreateDispatchRequest
{
    public Guid DealId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public DateTime ScheduledPickup { get; set; }
    public DateTime ScheduledDelivery { get; set; }
    public string? Notes { get; set; }
}

public sealed class AssignDispatchRequest
{
    public Guid VehicleId { get; set; }
    public Guid DriverId { get; set; }
}

public sealed class UpdateDispatchStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.DTOs;

public class DispatchDto
{
    public Guid Id { get; set; }
    public Guid DealId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public Guid? VehicleId { get; set; }
    public Guid? DriverId { get; set; }
    public DispatchStatus Status { get; set; }
    public DateTime ScheduledPickup { get; set; }
    public DateTime ScheduledDelivery { get; set; }
    public DateTime? ActualPickup { get; set; }
    public DateTime? ActualDelivery { get; set; }
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateDispatchDto
{
    public Guid DealId { get; set; }
    public Guid CarrierOrgId { get; set; }
    public DateTime ScheduledPickup { get; set; }
    public DateTime ScheduledDelivery { get; set; }
    public string? Notes { get; set; }
    public Guid CreatedByUserId { get; set; }
}

public class UpdateDispatchStatusDto
{
    public DispatchStatus Status { get; set; }
    public string? Notes { get; set; }
    public Guid UpdatedByUserId { get; set; }
}

public class AssignVehicleAndDriverDto
{
    public Guid VehicleId { get; set; }
    public Guid DriverId { get; set; }
    public Guid AssignedByUserId { get; set; }
}
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.DTOs;

public class VehicleDto
{
    public Guid Id { get; set; }
    public string PlateNumber { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public VehicleStatus Status { get; set; }
    public Guid OrganizationId { get; set; }
    public string? CurrentLocation { get; set; }
}

public class CreateVehicleDto
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public Guid OrganizationId { get; set; }
}

public class UpdateVehicleDto
{
    public string? PlateNumber { get; set; }
    public string? Type { get; set; }
    public decimal? Capacity { get; set; }
    public VehicleStatus? Status { get; set; }
    public string? CurrentLocation { get; set; }
}
namespace LogisticsMarketplace.BFF.Api.Models;

public sealed class VehicleResponse
{
    public Guid Id { get; set; }
    public string PlateNumber { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid OrganizationId { get; set; }
    public string? CurrentLocation { get; set; }
}

public sealed class CreateVehicleRequest
{
    public string PlateNumber { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public Guid OrganizationId { get; set; }
}
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.DTOs;

public class DriverDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public DriverStatus Status { get; set; }
    public string Phone { get; set; } = string.Empty;
    public Guid OrganizationId { get; set; }
}

public class CreateDriverDto
{
    public Guid UserId { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Guid OrganizationId { get; set; }
}

public class UpdateDriverDto
{
    public string? LicenseNumber { get; set; }
    public string? Phone { get; set; }
    public DriverStatus? Status { get; set; }
}
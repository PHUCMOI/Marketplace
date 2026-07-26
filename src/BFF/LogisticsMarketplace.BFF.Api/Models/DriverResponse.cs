namespace LogisticsMarketplace.BFF.Api.Models;

public sealed class DriverResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Guid OrganizationId { get; set; }
}

public sealed class CreateDriverRequest
{
    public Guid UserId { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Guid OrganizationId { get; set; }
}
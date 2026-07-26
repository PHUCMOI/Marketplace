using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;

public sealed class Driver : Entity<Guid>
{
    public Guid UserId { get; private set; }
    public string LicenseNumber { get; private set; } = string.Empty;
    public DriverStatus Status { get; private set; }
    public PhoneNumber Phone { get; private set; } = null!;
    public Guid OrganizationId { get; private set; }

    private Driver() { }

    public Driver(Guid userId, string licenseNumber, PhoneNumber phone, Guid organizationId)
    {
        if (string.IsNullOrWhiteSpace(licenseNumber))
            throw new ArgumentException("License number is required.", nameof(licenseNumber));
        Id = Guid.NewGuid();
        UserId = userId;
        LicenseNumber = licenseNumber.Trim();
        Phone = phone ?? throw new ArgumentNullException(nameof(phone));
        OrganizationId = organizationId;
        Status = DriverStatus.Available;
    }

    public void UpdateLicense(string licenseNumber)
    {
        if (string.IsNullOrWhiteSpace(licenseNumber))
            throw new ArgumentException("License number is required.", nameof(licenseNumber));
        LicenseNumber = licenseNumber.Trim();
    }

    public void UpdatePhone(PhoneNumber phone) =>
        Phone = phone ?? throw new ArgumentNullException(nameof(phone));

    public void UpdateStatus(DriverStatus status) => Status = status;

    public bool IsAvailableForDispatch() => Status == DriverStatus.Available;
}
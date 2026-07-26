using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;

public sealed class Vehicle : Entity<Guid>
{
    public string PlateNumber { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty;
    public decimal Capacity { get; private set; }
    public VehicleStatus Status { get; private set; }
    public Guid OrganizationId { get; private set; }
    public string? CurrentLocation { get; private set; }

    private Vehicle() { }

    public Vehicle(string plateNumber, string type, decimal capacity, Guid organizationId)
    {
        Validate(plateNumber, type, capacity);
        Id = Guid.NewGuid();
        PlateNumber = plateNumber.Trim();
        Type = type.Trim();
        Capacity = capacity;
        OrganizationId = organizationId;
        Status = VehicleStatus.Available;
    }

    public void UpdateDetails(string? plateNumber, string? type, decimal? capacity)
    {
        var nextPlate = plateNumber ?? PlateNumber;
        var nextType = type ?? Type;
        var nextCapacity = capacity ?? Capacity;
        Validate(nextPlate, nextType, nextCapacity);
        PlateNumber = nextPlate.Trim();
        Type = nextType.Trim();
        Capacity = nextCapacity;
    }

    public void UpdateStatus(VehicleStatus status) => Status = status;

    public void UpdateLocation(string? location) =>
        CurrentLocation = string.IsNullOrWhiteSpace(location) ? null : location.Trim();

    public bool IsAvailableForDispatch() => Status == VehicleStatus.Available;

    private static void Validate(string plateNumber, string type, decimal capacity)
    {
        if (string.IsNullOrWhiteSpace(plateNumber))
            throw new ArgumentException("Plate number is required.", nameof(plateNumber));
        if (string.IsNullOrWhiteSpace(type))
            throw new ArgumentException("Vehicle type is required.", nameof(type));
        if (capacity <= 0)
            throw new ArgumentOutOfRangeException(nameof(capacity), "Capacity must be greater than zero.");
    }
}
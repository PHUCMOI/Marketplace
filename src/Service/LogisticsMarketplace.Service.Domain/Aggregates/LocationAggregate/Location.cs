using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.LocationAggregate;

public sealed class Location : Entity<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public Address Address { get; private set; } = null!;
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }
    public string Type { get; private set; } = string.Empty;

    private Location() { }

    public Location(string name, Address address, double latitude, double longitude, string type)
    {
        ValidateCoordinates(latitude, longitude);
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Location name is required.", nameof(name));
        if (string.IsNullOrWhiteSpace(type))
            throw new ArgumentException("Location type is required.", nameof(type));

        Id = Guid.NewGuid();
        Name = name.Trim();
        Address = address ?? throw new ArgumentNullException(nameof(address));
        Latitude = latitude;
        Longitude = longitude;
        Type = type.Trim();
    }

    public void UpdateCoordinates(double latitude, double longitude)
    {
        ValidateCoordinates(latitude, longitude);
        Latitude = latitude;
        Longitude = longitude;
    }

    private static void ValidateCoordinates(double latitude, double longitude)
    {
        if (latitude is < -90 or > 90)
            throw new ArgumentOutOfRangeException(nameof(latitude));
        if (longitude is < -180 or > 180)
            throw new ArgumentOutOfRangeException(nameof(longitude));
    }
}
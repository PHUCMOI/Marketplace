using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;

public sealed class Listing : Entity<Guid>
{
    public Guid ShipperOrgId { get; private set; }
    public Guid PickupLocationId { get; private set; }
    public Guid DeliveryLocationId { get; private set; }
    public DateTime PickupDate { get; private set; }
    public DateTime DeliveryDate { get; private set; }
    public string CargoDescription { get; private set; } = string.Empty;
    public decimal Weight { get; private set; }
    public ListingStatus Status { get; private set; }
    public Money? Price { get; private set; }
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Listing() { }

    public Listing(
        Guid shipperOrgId,
        Guid pickupLocationId,
        Guid deliveryLocationId,
        DateTime pickupDate,
        DateTime deliveryDate,
        string cargoDescription,
        decimal weight,
        Money? price,
        Guid createdBy)
    {
        ValidateDetails(pickupDate, deliveryDate, cargoDescription, weight);
        Id = Guid.NewGuid();
        ShipperOrgId = shipperOrgId;
        PickupLocationId = pickupLocationId;
        DeliveryLocationId = deliveryLocationId;
        PickupDate = pickupDate;
        DeliveryDate = deliveryDate;
        CargoDescription = cargoDescription.Trim();
        Weight = weight;
        Price = price;
        CreatedBy = createdBy;
        CreatedAt = DateTime.UtcNow;
        Status = ListingStatus.Draft;
    }

    public void UpdateDetails(
        DateTime? pickupDate,
        DateTime? deliveryDate,
        string? cargoDescription,
        decimal? weight,
        Money? price)
    {
        if (Status is not (ListingStatus.Draft or ListingStatus.Open))
            throw new InvalidOperationException("Only draft or open listings can be updated.");

        var nextPickup = pickupDate ?? PickupDate;
        var nextDelivery = deliveryDate ?? DeliveryDate;
        var nextDescription = cargoDescription ?? CargoDescription;
        var nextWeight = weight ?? Weight;
        ValidateDetails(nextPickup, nextDelivery, nextDescription, nextWeight);

        PickupDate = nextPickup;
        DeliveryDate = nextDelivery;
        CargoDescription = nextDescription.Trim();
        Weight = nextWeight;
        if (price is not null)
            Price = price;
    }

    public void Publish()
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Only draft listings can be published.");
        Status = ListingStatus.Open;
    }

    public void Award()
    {
        if (Status != ListingStatus.Open)
            throw new InvalidOperationException("Only open listings can be awarded.");
        Status = ListingStatus.Awarded;
    }

    public void Cancel()
    {
        if (Status == ListingStatus.Awarded)
            throw new InvalidOperationException("An awarded listing cannot be cancelled.");
        if (Status == ListingStatus.Cancelled)
            return;
        Status = ListingStatus.Cancelled;
    }

    public void Expire()
    {
        if (Status == ListingStatus.Open)
            Status = ListingStatus.Expired;
    }

    private static void ValidateDetails(
        DateTime pickupDate,
        DateTime deliveryDate,
        string cargoDescription,
        decimal weight)
    {
        if (string.IsNullOrWhiteSpace(cargoDescription))
            throw new ArgumentException("Cargo description is required.", nameof(cargoDescription));
        if (weight <= 0)
            throw new ArgumentOutOfRangeException(nameof(weight), "Weight must be greater than zero.");
        if (deliveryDate <= pickupDate)
            throw new ArgumentException("Delivery date must be after pickup date.", nameof(deliveryDate));
    }
}
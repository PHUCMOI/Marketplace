using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;

public sealed class Deal : Entity<Guid>
{
    public Guid ListingId { get; private set; }
    public Guid AcceptedBidId { get; private set; }
    public Guid ShipperOrgId { get; private set; }
    public Guid CarrierOrgId { get; private set; }
    public Money AgreedPrice { get; private set; } = null!;
    public DealStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    private Deal() { }

    public Deal(
        Guid listingId,
        Guid acceptedBidId,
        Guid shipperOrgId,
        Guid carrierOrgId,
        Money agreedPrice)
    {
        Id = Guid.NewGuid();
        ListingId = listingId;
        AcceptedBidId = acceptedBidId;
        ShipperOrgId = shipperOrgId;
        CarrierOrgId = carrierOrgId;
        AgreedPrice = agreedPrice ?? throw new ArgumentNullException(nameof(agreedPrice));
        CreatedAt = DateTime.UtcNow;
        Status = DealStatus.Active;
    }

    public void Complete()
    {
        if (Status != DealStatus.Active)
            throw new InvalidOperationException("Only active deals can be completed.");
        Status = DealStatus.Completed;
        CompletedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status == DealStatus.Completed)
            throw new InvalidOperationException("A completed deal cannot be cancelled.");
        if (Status == DealStatus.Cancelled)
            return;
        Status = DealStatus.Cancelled;
    }
}
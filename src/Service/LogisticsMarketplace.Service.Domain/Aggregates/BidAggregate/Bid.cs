using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;

public sealed class Bid : Entity<Guid>
{
    public Guid ListingId { get; private set; }
    public Guid CarrierOrgId { get; private set; }
    public Money ProposedPrice { get; private set; } = null!;
    public string? Message { get; private set; }
    public BidStatus Status { get; private set; }
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Bid() { }

    public Bid(Guid listingId, Guid carrierOrgId, Money proposedPrice, string? message, Guid createdBy)
    {
        Id = Guid.NewGuid();
        ListingId = listingId;
        CarrierOrgId = carrierOrgId;
        ProposedPrice = proposedPrice ?? throw new ArgumentNullException(nameof(proposedPrice));
        Message = string.IsNullOrWhiteSpace(message) ? null : message.Trim();
        CreatedBy = createdBy;
        CreatedAt = DateTime.UtcNow;
        Status = BidStatus.Pending;
    }

    public void Accept()
    {
        EnsurePending();
        Status = BidStatus.Accepted;
    }

    public void Reject()
    {
        EnsurePending();
        Status = BidStatus.Rejected;
    }

    public void Withdraw()
    {
        EnsurePending();
        Status = BidStatus.Withdrawn;
    }

    private void EnsurePending()
    {
        if (Status != BidStatus.Pending)
            throw new InvalidOperationException("Only pending bids can change status.");
    }
}
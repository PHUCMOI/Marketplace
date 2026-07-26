using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Integration.Tests;

public sealed class DomainAggregateTests
{
    [Fact]
    public void Listing_follows_publish_and_award_lifecycle()
    {
        var listing = CreateListing();
        Assert.Equal(ListingStatus.Draft, listing.Status);
        listing.Publish();
        listing.Award();
        Assert.Equal(ListingStatus.Awarded, listing.Status);
        Assert.Throws<InvalidOperationException>(listing.Cancel);
    }

    [Fact]
    public void Listing_rejects_delivery_before_pickup()
    {
        var now = DateTime.UtcNow;
        Assert.Throws<ArgumentException>(() => new Listing(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), now.AddDays(2), now.AddDays(1), "Cargo", 10, null, Guid.NewGuid()));
    }

    [Fact]
    public void Accepted_bid_is_terminal()
    {
        var bid = new Bid(Guid.NewGuid(), Guid.NewGuid(), new Money(100, "USD"), null, Guid.NewGuid());
        bid.Accept();
        Assert.Equal(BidStatus.Accepted, bid.Status);
        Assert.Throws<InvalidOperationException>(bid.Withdraw);
    }

    [Fact]
    public void Dispatch_requires_ordered_state_transitions()
    {
        var now = DateTime.UtcNow;
        var dispatch = new Dispatch(Guid.NewGuid(), Guid.NewGuid(), now.AddHours(1), now.AddHours(5), Guid.NewGuid());
        Assert.Throws<InvalidOperationException>(dispatch.CompleteDelivery);
        dispatch.Assign(Guid.NewGuid(), Guid.NewGuid());
        dispatch.MarkPickedUp();
        dispatch.StartEnRoute();
        dispatch.CompleteDelivery();
        Assert.Equal(DispatchStatus.Delivered, dispatch.Status);
        Assert.NotNull(dispatch.ActualPickup);
        Assert.NotNull(dispatch.ActualDelivery);
    }

    private static Listing CreateListing()
    {
        var now = DateTime.UtcNow;
        return new Listing(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), now.AddDays(1), now.AddDays(2), "Electronics", 500, new Money(2_000, "USD"), Guid.NewGuid());
    }
}
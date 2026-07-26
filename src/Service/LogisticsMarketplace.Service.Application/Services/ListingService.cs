using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class ListingService : IListingService
{
    private readonly IListingRepository _listings;
    private readonly IBidRepository _bids;
    private readonly IDealRepository _deals;
    private readonly IUnitOfWork _unitOfWork;

    public ListingService(
        IListingRepository listings,
        IBidRepository bids,
        IDealRepository deals,
        IUnitOfWork unitOfWork)
    {
        _listings = listings;
        _bids = bids;
        _deals = deals;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ListingDto>> GetAllListingsAsync(CancellationToken cancellationToken = default) =>
        (await _listings.GetAllAsync(cancellationToken)).Select(Map);

    public async Task<IEnumerable<ListingDto>> GetOpenListingsAsync(CancellationToken cancellationToken = default) =>
        (await _listings.GetOpenAsync(cancellationToken)).Select(Map);

    public async Task<IEnumerable<ListingDto>> GetListingsByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default) =>
        (await _listings.GetByShipperOrgIdAsync(shipperOrgId, cancellationToken)).Select(Map);

    public async Task<ListingDto?> GetListingByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var listing = await _listings.GetByIdAsync(id, cancellationToken);
        return listing is null ? null : Map(listing);
    }

    public async Task<ListingDto> CreateListingAsync(CreateListingDto dto, Guid userId, CancellationToken cancellationToken = default)
    {
        var listing = new Listing(
            dto.ShipperOrgId,
            dto.PickupLocationId,
            dto.DeliveryLocationId,
            dto.PickupDate,
            dto.DeliveryDate,
            dto.CargoDescription,
            dto.Weight,
            CreateMoney(dto.PriceAmount, dto.PriceCurrency),
            userId);

        if (dto.PublishImmediately)
            listing.Publish();

        await _listings.AddAsync(listing, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(listing);
    }

    public async Task<ListingDto> UpdateListingAsync(Guid id, UpdateListingDto dto, CancellationToken cancellationToken = default)
    {
        var listing = await RequireListingAsync(id, cancellationToken);
        listing.UpdateDetails(
            dto.PickupDate,
            dto.DeliveryDate,
            dto.CargoDescription,
            dto.Weight,
            MergeMoney(listing.Price, dto.PriceAmount, dto.PriceCurrency));

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(listing);
    }

    public async Task PublishListingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var listing = await RequireListingAsync(id, cancellationToken);
        listing.Publish();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task CancelListingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var listing = await RequireListingAsync(id, cancellationToken);
        listing.Cancel();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteListingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var listing = await RequireListingAsync(id, cancellationToken);
        if (listing.Status is not (ListingStatus.Draft or ListingStatus.Cancelled))
            throw new InvalidOperationException("Only draft or cancelled listings can be deleted.");
        _listings.Remove(listing);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<DealDto> AwardDealAsync(Guid listingId, Guid bidId, CancellationToken cancellationToken = default)
    {
        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var listing = await RequireListingAsync(listingId, cancellationToken);
            var bid = await _bids.GetByIdAsync(bidId, cancellationToken)
                ?? throw new KeyNotFoundException($"Bid {bidId} was not found.");

            if (bid.ListingId != listingId)
                throw new InvalidOperationException("The bid does not belong to this listing.");

            listing.Award();
            bid.Accept();

            foreach (var competingBid in await _bids.GetPendingForListingAsync(listingId, cancellationToken))
            {
                if (competingBid.Id != bid.Id)
                    competingBid.Reject();
            }

            var deal = new Deal(
                listing.Id,
                bid.Id,
                listing.ShipperOrgId,
                bid.CarrierOrgId,
                bid.ProposedPrice);

            await _deals.AddAsync(deal, cancellationToken);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            return DealService.Map(deal);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    private async Task<Listing> RequireListingAsync(Guid id, CancellationToken cancellationToken) =>
        await _listings.GetByIdAsync(id, cancellationToken)
        ?? throw new KeyNotFoundException($"Listing {id} was not found.");

    private static Money? CreateMoney(decimal? amount, string? currency)
    {
        if (!amount.HasValue)
            return null;
        if (string.IsNullOrWhiteSpace(currency))
            throw new ArgumentException("Currency is required when a price is provided.", nameof(currency));
        return new Money(amount.Value, currency);
    }

    private static Money? MergeMoney(Money? current, decimal? amount, string? currency)
    {
        if (!amount.HasValue && string.IsNullOrWhiteSpace(currency))
            return null;
        var nextAmount = amount ?? current?.Amount
            ?? throw new ArgumentException("Price amount is required.");
        var nextCurrency = currency ?? current?.Currency
            ?? throw new ArgumentException("Price currency is required.");
        return new Money(nextAmount, nextCurrency);
    }

    private static ListingDto Map(Listing listing) => new()
    {
        Id = listing.Id,
        ShipperOrgId = listing.ShipperOrgId,
        PickupLocationId = listing.PickupLocationId,
        DeliveryLocationId = listing.DeliveryLocationId,
        PickupDate = listing.PickupDate,
        DeliveryDate = listing.DeliveryDate,
        CargoDescription = listing.CargoDescription,
        Weight = listing.Weight,
        Status = listing.Status,
        PriceAmount = listing.Price?.Amount,
        PriceCurrency = listing.Price?.Currency,
        CreatedBy = listing.CreatedBy,
        CreatedAt = listing.CreatedAt
    };
}
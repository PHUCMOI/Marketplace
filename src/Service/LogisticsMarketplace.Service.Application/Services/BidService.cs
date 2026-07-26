using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class BidService : IBidService
{
    private readonly IBidRepository _bids;
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _unitOfWork;

    public BidService(IBidRepository bids, IListingRepository listings, IUnitOfWork unitOfWork)
    {
        _bids = bids;
        _listings = listings;
        _unitOfWork = unitOfWork;
    }

    public async Task<BidDto?> GetBidByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var bid = await _bids.GetByIdAsync(id, cancellationToken);
        return bid is null ? null : Map(bid);
    }

    public async Task<IEnumerable<BidDto>> GetBidsForListingAsync(Guid listingId, CancellationToken cancellationToken = default) =>
        (await _bids.GetForListingAsync(listingId, cancellationToken)).Select(Map);

    public async Task<IEnumerable<BidDto>> GetBidsForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        (await _bids.GetForCarrierAsync(carrierOrgId, cancellationToken)).Select(Map);

    public async Task<BidDto> PlaceBidAsync(CreateBidDto dto, Guid userId, CancellationToken cancellationToken = default)
    {
        var listing = await _listings.GetByIdAsync(dto.ListingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Listing {dto.ListingId} was not found.");

        if (listing.Status != ListingStatus.Open)
            throw new InvalidOperationException("Bids can only be placed on open listings.");
        if (listing.ShipperOrgId == dto.CarrierOrgId)
            throw new InvalidOperationException("A shipper organization cannot bid on its own listing.");
        if (await _bids.HasActiveBidAsync(dto.ListingId, dto.CarrierOrgId, cancellationToken))
            throw new InvalidOperationException("This carrier already has a pending bid for the listing.");

        var bid = new Bid(
            dto.ListingId,
            dto.CarrierOrgId,
            new Money(dto.ProposedPriceAmount, dto.ProposedPriceCurrency),
            dto.Message,
            userId);

        await _bids.AddAsync(bid, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(bid);
    }

    public async Task WithdrawBidAsync(Guid bidId, CancellationToken cancellationToken = default)
    {
        var bid = await _bids.GetByIdAsync(bidId, cancellationToken)
            ?? throw new KeyNotFoundException($"Bid {bidId} was not found.");
        bid.Withdraw();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static BidDto Map(Bid bid) => new()
    {
        Id = bid.Id,
        ListingId = bid.ListingId,
        CarrierOrgId = bid.CarrierOrgId,
        ProposedPriceAmount = bid.ProposedPrice.Amount,
        ProposedPriceCurrency = bid.ProposedPrice.Currency,
        Message = bid.Message,
        Status = bid.Status,
        CreatedBy = bid.CreatedBy,
        CreatedAt = bid.CreatedAt
    };
}
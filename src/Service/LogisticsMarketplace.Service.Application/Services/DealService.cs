using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class DealService : IDealService
{
    private readonly IDealRepository _deals;
    private readonly IUnitOfWork _unitOfWork;

    public DealService(IDealRepository deals, IUnitOfWork unitOfWork)
    {
        _deals = deals;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<DealDto>> GetAllDealsAsync(CancellationToken cancellationToken = default) =>
        (await _deals.GetAllAsync(cancellationToken)).Select(Map);

    public async Task<DealDto?> GetDealByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var deal = await _deals.GetByIdAsync(id, cancellationToken);
        return deal is null ? null : Map(deal);
    }

    public async Task<DealDto?> GetDealByListingIdAsync(Guid listingId, CancellationToken cancellationToken = default)
    {
        var deal = await _deals.GetByListingIdAsync(listingId, cancellationToken);
        return deal is null ? null : Map(deal);
    }

    public async Task<IEnumerable<DealDto>> GetDealsByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default) =>
        (await _deals.GetByShipperOrgIdAsync(shipperOrgId, cancellationToken)).Select(Map);

    public async Task<IEnumerable<DealDto>> GetDealsByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        (await _deals.GetByCarrierOrgIdAsync(carrierOrgId, cancellationToken)).Select(Map);

    public async Task CompleteDealAsync(Guid dealId, Guid completedByUserId, CancellationToken cancellationToken = default)
    {
        var deal = await RequireDealAsync(dealId, cancellationToken);
        deal.Complete();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task CancelDealAsync(Guid dealId, Guid cancelledByUserId, CancellationToken cancellationToken = default)
    {
        var deal = await RequireDealAsync(dealId, cancellationToken);
        deal.Cancel();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Deal> RequireDealAsync(Guid id, CancellationToken cancellationToken) =>
        await _deals.GetByIdAsync(id, cancellationToken)
        ?? throw new KeyNotFoundException($"Deal {id} was not found.");

    internal static DealDto Map(Deal deal) => new()
    {
        Id = deal.Id,
        ListingId = deal.ListingId,
        AcceptedBidId = deal.AcceptedBidId,
        ShipperOrgId = deal.ShipperOrgId,
        CarrierOrgId = deal.CarrierOrgId,
        AgreedPriceAmount = deal.AgreedPrice.Amount,
        AgreedPriceCurrency = deal.AgreedPrice.Currency,
        Status = deal.Status,
        CreatedAt = deal.CreatedAt,
        CompletedAt = deal.CompletedAt
    };
}
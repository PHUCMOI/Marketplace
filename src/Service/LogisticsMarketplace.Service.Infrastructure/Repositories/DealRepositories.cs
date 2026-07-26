using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class DealRepository : IDealRepository
{
    private readonly ApplicationDbContext _context;
    public DealRepository(ApplicationDbContext context) => _context = context;

    public Task<Deal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Deals.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<Deal?> GetByListingIdAsync(Guid listingId, CancellationToken cancellationToken = default) =>
        _context.Deals.SingleOrDefaultAsync(x => x.ListingId == listingId, cancellationToken);

    public async Task<IReadOnlyCollection<Deal>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Deals.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Deal>> GetByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default) =>
        await _context.Deals.Where(x => x.ShipperOrgId == shipperOrgId).OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Deal>> GetByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        await _context.Deals.Where(x => x.CarrierOrgId == carrierOrgId).OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task AddAsync(Deal deal, CancellationToken cancellationToken = default) =>
        await _context.Deals.AddAsync(deal, cancellationToken);

    public void Remove(Deal deal) => _context.Deals.Remove(deal);
}
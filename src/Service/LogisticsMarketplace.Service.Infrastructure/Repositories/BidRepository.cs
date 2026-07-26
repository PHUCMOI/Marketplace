using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class BidRepository : IBidRepository
{
    private readonly ApplicationDbContext _context;
    public BidRepository(ApplicationDbContext context) => _context = context;

    public Task<Bid?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Bids.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<Bid>> GetForListingAsync(Guid listingId, CancellationToken cancellationToken = default) =>
        await _context.Bids.Where(x => x.ListingId == listingId).OrderBy(x => x.ProposedPrice.Amount).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Bid>> GetForCarrierAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        await _context.Bids.Where(x => x.CarrierOrgId == carrierOrgId).OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Bid>> GetPendingForListingAsync(Guid listingId, CancellationToken cancellationToken = default) =>
        await _context.Bids.Where(x => x.ListingId == listingId && x.Status == BidStatus.Pending).ToListAsync(cancellationToken);

    public Task<bool> HasActiveBidAsync(Guid listingId, Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        _context.Bids.AnyAsync(x => x.ListingId == listingId && x.CarrierOrgId == carrierOrgId && x.Status == BidStatus.Pending, cancellationToken);

    public async Task AddAsync(Bid bid, CancellationToken cancellationToken = default) =>
        await _context.Bids.AddAsync(bid, cancellationToken);
}
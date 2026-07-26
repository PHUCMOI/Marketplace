using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class ListingRepository : IListingRepository
{
    private readonly ApplicationDbContext _context;
    public ListingRepository(ApplicationDbContext context) => _context = context;

    public Task<Listing?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Listings.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<Listing>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Listings.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Listing>> GetOpenAsync(CancellationToken cancellationToken = default) =>
        await _context.Listings.Where(x => x.Status == ListingStatus.Open).OrderBy(x => x.PickupDate).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Listing>> GetByShipperOrgIdAsync(Guid shipperOrgId, CancellationToken cancellationToken = default) =>
        await _context.Listings.Where(x => x.ShipperOrgId == shipperOrgId).OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task AddAsync(Listing listing, CancellationToken cancellationToken = default) =>
        await _context.Listings.AddAsync(listing, cancellationToken);

    public void Remove(Listing listing) => _context.Listings.Remove(listing);
}
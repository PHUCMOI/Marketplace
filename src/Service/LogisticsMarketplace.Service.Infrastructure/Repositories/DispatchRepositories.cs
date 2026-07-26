using LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class DispatchRepository : IDispatchRepository
{
    private readonly ApplicationDbContext _context;
    public DispatchRepository(ApplicationDbContext context) => _context = context;

    public Task<Dispatch?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Dispatches.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<Dispatch?> GetByDealIdAsync(Guid dealId, CancellationToken cancellationToken = default) =>
        _context.Dispatches.SingleOrDefaultAsync(x => x.DealId == dealId, cancellationToken);

    public async Task<IReadOnlyCollection<Dispatch>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Dispatches.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Dispatch>> GetByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        await _context.Dispatches.Where(x => x.CarrierOrgId == carrierOrgId).OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);

    public async Task AddAsync(Dispatch dispatch, CancellationToken cancellationToken = default) =>
        await _context.Dispatches.AddAsync(dispatch, cancellationToken);

    public void Remove(Dispatch dispatch) => _context.Dispatches.Remove(dispatch);
}
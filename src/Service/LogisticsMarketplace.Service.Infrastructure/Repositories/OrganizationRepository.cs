using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class OrganizationRepository : IOrganizationRepository
{
    private readonly ApplicationDbContext _context;
    public OrganizationRepository(ApplicationDbContext context) => _context = context;

    public Task<Organization?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Organizations.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(Organization organization, CancellationToken cancellationToken = default) =>
        await _context.Organizations.AddAsync(organization, cancellationToken);
}
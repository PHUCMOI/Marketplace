using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class DriverRepository : IDriverRepository
{
    private readonly ApplicationDbContext _context;
    public DriverRepository(ApplicationDbContext context) => _context = context;

    public Task<Driver?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Drivers.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<Driver>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Drivers.OrderBy(x => x.LicenseNumber).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Driver>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        await _context.Drivers.Where(x => x.OrganizationId == organizationId).OrderBy(x => x.LicenseNumber).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Driver>> GetAvailableAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        await _context.Drivers.Where(x => x.OrganizationId == organizationId && x.Status == DriverStatus.Available).OrderBy(x => x.LicenseNumber).ToListAsync(cancellationToken);

    public Task<bool> LicenseNumberExistsAsync(string licenseNumber, Guid? excludingId = null, CancellationToken cancellationToken = default) =>
        _context.Drivers.AnyAsync(x => x.LicenseNumber == licenseNumber && (!excludingId.HasValue || x.Id != excludingId), cancellationToken);

    public async Task AddAsync(Driver driver, CancellationToken cancellationToken = default) =>
        await _context.Drivers.AddAsync(driver, cancellationToken);

    public void Remove(Driver driver) => _context.Drivers.Remove(driver);
}
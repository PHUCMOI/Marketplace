using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class VehicleRepository : IVehicleRepository
{
    private readonly ApplicationDbContext _context;
    public VehicleRepository(ApplicationDbContext context) => _context = context;

    public Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Vehicles.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<Vehicle>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Vehicles.OrderBy(x => x.PlateNumber).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Vehicle>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        await _context.Vehicles.Where(x => x.OrganizationId == organizationId).OrderBy(x => x.PlateNumber).ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Vehicle>> GetAvailableAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        await _context.Vehicles.Where(x => x.OrganizationId == organizationId && x.Status == VehicleStatus.Available).OrderBy(x => x.PlateNumber).ToListAsync(cancellationToken);

    public Task<bool> PlateNumberExistsAsync(string plateNumber, Guid? excludingId = null, CancellationToken cancellationToken = default) =>
        _context.Vehicles.AnyAsync(x => x.PlateNumber == plateNumber && (!excludingId.HasValue || x.Id != excludingId), cancellationToken);

    public async Task AddAsync(Vehicle vehicle, CancellationToken cancellationToken = default) =>
        await _context.Vehicles.AddAsync(vehicle, cancellationToken);

    public void Remove(Vehicle vehicle) => _context.Vehicles.Remove(vehicle);
}
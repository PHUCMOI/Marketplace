using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IVehicleRepository
{
    Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Vehicle>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Vehicle>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Vehicle>> GetAvailableAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<bool> PlateNumberExistsAsync(string plateNumber, Guid? excludingId = null, CancellationToken cancellationToken = default);
    Task AddAsync(Vehicle vehicle, CancellationToken cancellationToken = default);
    void Remove(Vehicle vehicle);
}
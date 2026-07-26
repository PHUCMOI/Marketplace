using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;

namespace LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

public interface IDriverRepository
{
    Task<Driver?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Driver>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Driver>> GetByOrganizationIdAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Driver>> GetAvailableAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<bool> LicenseNumberExistsAsync(string licenseNumber, Guid? excludingId = null, CancellationToken cancellationToken = default);
    Task AddAsync(Driver driver, CancellationToken cancellationToken = default);
    void Remove(Driver driver);
}
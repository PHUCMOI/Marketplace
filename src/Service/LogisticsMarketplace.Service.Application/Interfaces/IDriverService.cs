using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IDriverService
{
    Task<IEnumerable<DriverDto>> GetAllDriversAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<DriverDto>> GetDriversForOrganizationAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<IEnumerable<DriverDto>> GetAvailableDriversAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<DriverDto?> GetDriverByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DriverDto> CreateDriverAsync(CreateDriverDto dto, CancellationToken cancellationToken = default);
    Task<DriverDto> UpdateDriverAsync(Guid id, UpdateDriverDto dto, CancellationToken cancellationToken = default);
    Task DeleteDriverAsync(Guid id, CancellationToken cancellationToken = default);
}
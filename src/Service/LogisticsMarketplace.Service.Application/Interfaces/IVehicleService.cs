using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IVehicleService
{
    Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<VehicleDto>> GetVehiclesForOrganizationAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<IEnumerable<VehicleDto>> GetAvailableVehiclesAsync(Guid organizationId, CancellationToken cancellationToken = default);
    Task<VehicleDto?> GetVehicleByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto, CancellationToken cancellationToken = default);
    Task<VehicleDto> UpdateVehicleAsync(Guid id, UpdateVehicleDto dto, CancellationToken cancellationToken = default);
    Task DeleteVehicleAsync(Guid id, CancellationToken cancellationToken = default);
}
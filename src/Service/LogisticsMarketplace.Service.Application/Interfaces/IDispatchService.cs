using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IDispatchService
{
    Task<IEnumerable<DispatchDto>> GetAllDispatchesAsync(CancellationToken cancellationToken = default);
    Task<DispatchDto?> GetDispatchByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DispatchDto?> GetDispatchByDealIdAsync(Guid dealId, CancellationToken cancellationToken = default);
    Task<IEnumerable<DispatchDto>> GetDispatchesByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default);
    Task<DispatchDto> CreateDispatchAsync(CreateDispatchDto dto, CancellationToken cancellationToken = default);
    Task<DispatchDto> AssignVehicleAndDriverAsync(Guid dispatchId, Guid vehicleId, Guid driverId, Guid assignedByUserId, CancellationToken cancellationToken = default);
    Task<DispatchDto> UpdateDispatchStatusAsync(Guid dispatchId, DispatchStatus status, string? notes, Guid updatedByUserId, CancellationToken cancellationToken = default);
}
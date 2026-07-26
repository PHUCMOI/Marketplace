using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicles;
    private readonly IUnitOfWork _unitOfWork;

    public VehicleService(IVehicleRepository vehicles, IUnitOfWork unitOfWork)
    {
        _vehicles = vehicles;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync(CancellationToken cancellationToken = default) =>
        (await _vehicles.GetAllAsync(cancellationToken)).Select(Map);

    public async Task<IEnumerable<VehicleDto>> GetVehiclesForOrganizationAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        (await _vehicles.GetByOrganizationIdAsync(organizationId, cancellationToken)).Select(Map);

    public async Task<IEnumerable<VehicleDto>> GetAvailableVehiclesAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        (await _vehicles.GetAvailableAsync(organizationId, cancellationToken)).Select(Map);

    public async Task<VehicleDto?> GetVehicleByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var vehicle = await _vehicles.GetByIdAsync(id, cancellationToken);
        return vehicle is null ? null : Map(vehicle);
    }

    public async Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto, CancellationToken cancellationToken = default)
    {
        if (await _vehicles.PlateNumberExistsAsync(dto.PlateNumber, cancellationToken: cancellationToken))
            throw new InvalidOperationException($"Vehicle plate {dto.PlateNumber} already exists.");

        var vehicle = new Vehicle(dto.PlateNumber, dto.Type, dto.Capacity, dto.OrganizationId);
        await _vehicles.AddAsync(vehicle, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(vehicle);
    }

    public async Task<VehicleDto> UpdateVehicleAsync(Guid id, UpdateVehicleDto dto, CancellationToken cancellationToken = default)
    {
        var vehicle = await RequireVehicleAsync(id, cancellationToken);
        var nextPlate = dto.PlateNumber ?? vehicle.PlateNumber;
        if (await _vehicles.PlateNumberExistsAsync(nextPlate, id, cancellationToken))
            throw new InvalidOperationException($"Vehicle plate {nextPlate} already exists.");

        vehicle.UpdateDetails(dto.PlateNumber, dto.Type, dto.Capacity);
        if (dto.Status.HasValue)
            vehicle.UpdateStatus(dto.Status.Value);
        if (dto.CurrentLocation is not null)
            vehicle.UpdateLocation(dto.CurrentLocation);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(vehicle);
    }

    public async Task DeleteVehicleAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var vehicle = await RequireVehicleAsync(id, cancellationToken);
        if (!vehicle.IsAvailableForDispatch())
            throw new InvalidOperationException("Only available vehicles can be deleted.");
        _vehicles.Remove(vehicle);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Vehicle> RequireVehicleAsync(Guid id, CancellationToken cancellationToken) =>
        await _vehicles.GetByIdAsync(id, cancellationToken)
        ?? throw new KeyNotFoundException($"Vehicle {id} was not found.");

    internal static VehicleDto Map(Vehicle vehicle) => new()
    {
        Id = vehicle.Id,
        PlateNumber = vehicle.PlateNumber,
        Type = vehicle.Type,
        Capacity = vehicle.Capacity,
        Status = vehicle.Status,
        OrganizationId = vehicle.OrganizationId,
        CurrentLocation = vehicle.CurrentLocation
    };
}
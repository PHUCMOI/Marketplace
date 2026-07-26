using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class DispatchService : IDispatchService
{
    private readonly IDispatchRepository _dispatches;
    private readonly IDealRepository _deals;
    private readonly IVehicleRepository _vehicles;
    private readonly IDriverRepository _drivers;
    private readonly IUnitOfWork _unitOfWork;

    public DispatchService(
        IDispatchRepository dispatches,
        IDealRepository deals,
        IVehicleRepository vehicles,
        IDriverRepository drivers,
        IUnitOfWork unitOfWork)
    {
        _dispatches = dispatches;
        _deals = deals;
        _vehicles = vehicles;
        _drivers = drivers;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<DispatchDto>> GetAllDispatchesAsync(CancellationToken cancellationToken = default) =>
        (await _dispatches.GetAllAsync(cancellationToken)).Select(Map);

    public async Task<DispatchDto?> GetDispatchByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dispatch = await _dispatches.GetByIdAsync(id, cancellationToken);
        return dispatch is null ? null : Map(dispatch);
    }

    public async Task<DispatchDto?> GetDispatchByDealIdAsync(Guid dealId, CancellationToken cancellationToken = default)
    {
        var dispatch = await _dispatches.GetByDealIdAsync(dealId, cancellationToken);
        return dispatch is null ? null : Map(dispatch);
    }

    public async Task<IEnumerable<DispatchDto>> GetDispatchesByCarrierOrgIdAsync(Guid carrierOrgId, CancellationToken cancellationToken = default) =>
        (await _dispatches.GetByCarrierOrgIdAsync(carrierOrgId, cancellationToken)).Select(Map);

    public async Task<DispatchDto> CreateDispatchAsync(CreateDispatchDto dto, CancellationToken cancellationToken = default)
    {
        var deal = await _deals.GetByIdAsync(dto.DealId, cancellationToken)
            ?? throw new KeyNotFoundException($"Deal {dto.DealId} was not found.");

        if (deal.Status != DealStatus.Active)
            throw new InvalidOperationException("A dispatch can only be created for an active deal.");
        if (deal.CarrierOrgId != dto.CarrierOrgId)
            throw new InvalidOperationException("The dispatch carrier must match the awarded deal.");
        if (await _dispatches.GetByDealIdAsync(dto.DealId, cancellationToken) is not null)
            throw new InvalidOperationException("A dispatch already exists for this deal.");

        var dispatch = new Dispatch(
            dto.DealId,
            dto.CarrierOrgId,
            dto.ScheduledPickup,
            dto.ScheduledDelivery,
            dto.CreatedByUserId,
            dto.Notes);

        await _dispatches.AddAsync(dispatch, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(dispatch);
    }

    public async Task<DispatchDto> AssignVehicleAndDriverAsync(
        Guid dispatchId,
        Guid vehicleId,
        Guid driverId,
        Guid assignedByUserId,
        CancellationToken cancellationToken = default)
    {
        var dispatch = await RequireDispatchAsync(dispatchId, cancellationToken);
        var vehicle = await _vehicles.GetByIdAsync(vehicleId, cancellationToken)
            ?? throw new KeyNotFoundException($"Vehicle {vehicleId} was not found.");
        var driver = await _drivers.GetByIdAsync(driverId, cancellationToken)
            ?? throw new KeyNotFoundException($"Driver {driverId} was not found.");

        if (vehicle.OrganizationId != dispatch.CarrierOrgId || driver.OrganizationId != dispatch.CarrierOrgId)
            throw new InvalidOperationException("Vehicle and driver must belong to the deal carrier.");
        if (!vehicle.IsAvailableForDispatch())
            throw new InvalidOperationException("Vehicle is not available.");
        if (!driver.IsAvailableForDispatch())
            throw new InvalidOperationException("Driver is not available.");

        dispatch.Assign(vehicleId, driverId);
        vehicle.UpdateStatus(VehicleStatus.InUse);
        driver.UpdateStatus(DriverStatus.OnDuty);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(dispatch);
    }

    public async Task<DispatchDto> UpdateDispatchStatusAsync(
        Guid dispatchId,
        DispatchStatus status,
        string? notes,
        Guid updatedByUserId,
        CancellationToken cancellationToken = default)
    {
        var dispatch = await RequireDispatchAsync(dispatchId, cancellationToken);

        switch (status)
        {
            case DispatchStatus.PickedUp:
                dispatch.MarkPickedUp();
                break;
            case DispatchStatus.EnRoute:
                dispatch.StartEnRoute();
                break;
            case DispatchStatus.Delivered:
                dispatch.CompleteDelivery();
                await CompleteDealAsync(dispatch.DealId, cancellationToken);
                await ReleaseResourcesAsync(dispatch, cancellationToken);
                break;
            case DispatchStatus.Failed:
                dispatch.MarkFailed(notes ?? "Unspecified failure");
                await ReleaseResourcesAsync(dispatch, cancellationToken);
                break;
            case DispatchStatus.Cancelled:
                dispatch.Cancel();
                await ReleaseResourcesAsync(dispatch, cancellationToken);
                break;
            default:
                throw new InvalidOperationException($"Status transition to {status} is not supported by this operation.");
        }

        if (notes is not null && status != DispatchStatus.Failed)
            dispatch.UpdateNotes(notes);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(dispatch);
    }

    private async Task CompleteDealAsync(Guid dealId, CancellationToken cancellationToken)
    {
        var deal = await _deals.GetByIdAsync(dealId, cancellationToken)
            ?? throw new KeyNotFoundException($"Deal {dealId} was not found.");
        if (deal.Status == DealStatus.Active)
            deal.Complete();
    }

    private async Task ReleaseResourcesAsync(Dispatch dispatch, CancellationToken cancellationToken)
    {
        if (dispatch.VehicleId.HasValue)
        {
            var vehicle = await _vehicles.GetByIdAsync(dispatch.VehicleId.Value, cancellationToken);
            vehicle?.UpdateStatus(VehicleStatus.Available);
        }

        if (dispatch.DriverId.HasValue)
        {
            var driver = await _drivers.GetByIdAsync(dispatch.DriverId.Value, cancellationToken);
            driver?.UpdateStatus(DriverStatus.Available);
        }
    }

    private async Task<Dispatch> RequireDispatchAsync(Guid id, CancellationToken cancellationToken) =>
        await _dispatches.GetByIdAsync(id, cancellationToken)
        ?? throw new KeyNotFoundException($"Dispatch {id} was not found.");

    private static DispatchDto Map(Dispatch dispatch) => new()
    {
        Id = dispatch.Id,
        DealId = dispatch.DealId,
        CarrierOrgId = dispatch.CarrierOrgId,
        VehicleId = dispatch.VehicleId,
        DriverId = dispatch.DriverId,
        Status = dispatch.Status,
        ScheduledPickup = dispatch.ScheduledPickup,
        ScheduledDelivery = dispatch.ScheduledDelivery,
        ActualPickup = dispatch.ActualPickup,
        ActualDelivery = dispatch.ActualDelivery,
        Notes = dispatch.Notes,
        CreatedBy = dispatch.CreatedBy,
        CreatedAt = dispatch.CreatedAt,
        UpdatedAt = dispatch.UpdatedAt
    };
}
using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;

namespace LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;

public sealed class Dispatch : Entity<Guid>
{
    public Guid DealId { get; private set; }
    public Guid CarrierOrgId { get; private set; }
    public Guid? VehicleId { get; private set; }
    public Guid? DriverId { get; private set; }
    public DispatchStatus Status { get; private set; }
    public DateTime ScheduledPickup { get; private set; }
    public DateTime ScheduledDelivery { get; private set; }
    public DateTime? ActualPickup { get; private set; }
    public DateTime? ActualDelivery { get; private set; }
    public string? Notes { get; private set; }
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Dispatch() { }

    public Dispatch(
        Guid dealId,
        Guid carrierOrgId,
        DateTime scheduledPickup,
        DateTime scheduledDelivery,
        Guid createdBy,
        string? notes = null)
    {
        if (scheduledDelivery <= scheduledPickup)
            throw new ArgumentException("Scheduled delivery must be after scheduled pickup.", nameof(scheduledDelivery));

        Id = Guid.NewGuid();
        DealId = dealId;
        CarrierOrgId = carrierOrgId;
        ScheduledPickup = scheduledPickup;
        ScheduledDelivery = scheduledDelivery;
        CreatedBy = createdBy;
        Notes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
        Status = DispatchStatus.Pending;
    }

    public void Assign(Guid vehicleId, Guid driverId)
    {
        if (Status != DispatchStatus.Pending)
            throw new InvalidOperationException("Only pending dispatches can be assigned.");
        VehicleId = vehicleId;
        DriverId = driverId;
        Status = DispatchStatus.Assigned;
        Touch();
    }

    public void MarkPickedUp()
    {
        if (Status != DispatchStatus.Assigned)
            throw new InvalidOperationException("Only assigned dispatches can be picked up.");
        ActualPickup = DateTime.UtcNow;
        Status = DispatchStatus.PickedUp;
        Touch();
    }

    public void StartEnRoute()
    {
        if (Status is not (DispatchStatus.Assigned or DispatchStatus.PickedUp))
            throw new InvalidOperationException("Only assigned or picked-up dispatches can start transit.");
        ActualPickup ??= DateTime.UtcNow;
        Status = DispatchStatus.EnRoute;
        Touch();
    }

    public void CompleteDelivery()
    {
        if (Status != DispatchStatus.EnRoute)
            throw new InvalidOperationException("Only in-transit dispatches can be delivered.");
        ActualDelivery = DateTime.UtcNow;
        Status = DispatchStatus.Delivered;
        Touch();
    }

    public void MarkFailed(string reason)
    {
        if (Status is DispatchStatus.Delivered or DispatchStatus.Cancelled)
            throw new InvalidOperationException("A terminal dispatch cannot fail.");
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Failure reason is required.", nameof(reason));
        Notes = string.IsNullOrWhiteSpace(Notes) ? $"Failed: {reason.Trim()}" : $"{Notes}{Environment.NewLine}Failed: {reason.Trim()}";
        Status = DispatchStatus.Failed;
        Touch();
    }

    public void Cancel()
    {
        if (Status == DispatchStatus.Delivered)
            throw new InvalidOperationException("A delivered dispatch cannot be cancelled.");
        if (Status == DispatchStatus.Cancelled)
            return;
        Status = DispatchStatus.Cancelled;
        Touch();
    }

    public void UpdateNotes(string? notes)
    {
        Notes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
        Touch();
    }

    private void Touch() => UpdatedAt = DateTime.UtcNow;
}
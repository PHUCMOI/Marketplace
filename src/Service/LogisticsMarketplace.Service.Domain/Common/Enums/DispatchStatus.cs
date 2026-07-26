
namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// Dispatch status enumeration
/// </summary>
public enum DispatchStatus
{
    /// <summary>
    /// Pending - awaiting assignment
    /// </summary>
    Pending = 1,

    /// <summary>
    /// Assigned - vehicle and driver assigned
    /// </summary>
    Assigned = 2,

    PickedUp = 3,

    /// <summary>
    /// EnRoute - in transit
    /// </summary>
    EnRoute = 4,

    /// <summary>
    /// Delivered - successfully delivered
    /// </summary>
    Delivered = 5,

    /// <summary>
    /// Failed - delivery failed
    /// </summary>
    Failed = 6,

    /// <summary>
    /// Cancelled - dispatch cancelled
    /// </summary>
    Cancelled = 7
}

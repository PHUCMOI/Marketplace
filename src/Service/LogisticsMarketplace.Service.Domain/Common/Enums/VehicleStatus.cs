
namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// Vehicle status enumeration
/// </summary>
public enum VehicleStatus
{
    /// <summary>
    /// Available - ready for assignment
    /// </summary>
    Available = 1,

    /// <summary>
    /// InUse - currently assigned to dispatch
    /// </summary>
    InUse = 2,

    /// <summary>
    /// Maintenance - under maintenance
    /// </summary>
    Maintenance = 3,

    /// <summary>
    /// Retired - no longer in service
    /// </summary>
    Retired = 4
}

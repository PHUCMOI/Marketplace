
namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// Driver status enumeration
/// </summary>
public enum DriverStatus
{
    /// <summary>
    /// Available - ready for assignment
    /// </summary>
    Available = 1,

    /// <summary>
    /// OnDuty - currently on duty
    /// </summary>
    OnDuty = 2,

    /// <summary>
    /// OffDuty - off duty
    /// </summary>
    OffDuty = 3,

    /// <summary>
    /// OnLeave - on leave
    /// </summary>
    OnLeave = 4
}

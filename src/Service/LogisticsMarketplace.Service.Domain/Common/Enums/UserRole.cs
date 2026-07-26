namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// User role enumeration
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Shipper role - creates listings
    /// </summary>
    Shipper = 1,

    /// <summary>
    /// Carrier role - places bids
    /// </summary>
    Carrier = 2,

    /// <summary>
    /// Broker role - intermediary
    /// </summary>
    Broker = 3,

    /// <summary>
    /// Dispatcher role - manages dispatch operations
    /// </summary>
    Dispatcher = 4,

    /// <summary>
    /// Admin role - full system access
    /// </summary>
    Admin = 5
}

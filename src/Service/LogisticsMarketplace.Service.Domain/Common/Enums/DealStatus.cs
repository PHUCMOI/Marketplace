namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// Deal status enumeration
/// </summary>
public enum DealStatus
{
    /// <summary>
    /// Active - deal in progress
    /// </summary>
    Active = 1,

    /// <summary>
    /// Completed - deal successfully completed
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Cancelled - deal cancelled
    /// </summary>
    Cancelled = 3
}

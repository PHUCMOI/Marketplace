namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// Bid status enumeration
/// </summary>
public enum BidStatus
{
    /// <summary>
    /// Pending - awaiting decision
    /// </summary>
    Pending = 1,

    /// <summary>
    /// Accepted - bid accepted
    /// </summary>
    Accepted = 2,

    /// <summary>
    /// Rejected - bid rejected
    /// </summary>
    Rejected = 3,

    /// <summary>
    /// Withdrawn - bid withdrawn by carrier
    /// </summary>
    Withdrawn = 4
}

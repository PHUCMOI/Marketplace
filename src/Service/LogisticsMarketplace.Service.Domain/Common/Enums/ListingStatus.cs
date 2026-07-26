namespace LogisticsMarketplace.Service.Domain.Common.Enums;

/// <summary>
/// Listing status enumeration
/// </summary>
public enum ListingStatus
{
    /// <summary>
    /// Draft - not yet published
    /// </summary>
    Draft = 1,

    /// <summary>
    /// Open - accepting bids
    /// </summary>
    Open = 2,

    /// <summary>
    /// Awarded - bid accepted, deal created
    /// </summary>
    Awarded = 3,

    /// <summary>
    /// Cancelled - listing cancelled
    /// </summary>
    Cancelled = 4,

    /// <summary>
    /// Expired - listing expired without award
    /// </summary>
    Expired = 5
}

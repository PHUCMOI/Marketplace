namespace LogisticsMarketplace.Service.Domain.Common;

/// <summary>
/// Base entity class with generic Id
/// </summary>
/// <typeparam name="TId">Type of the entity identifier</typeparam>
public abstract class Entity<TId> where TId : notnull
{
    /// <summary>
    /// Entity identifier
    /// </summary>
    public TId Id { get; protected set; } = default!;

    /// <summary>
    /// Checks equality based on Id
    /// </summary>
    public override bool Equals(object? obj)
    {
        if (obj is not Entity<TId> other)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (GetType() != other.GetType())
            return false;

        return Id.Equals(other.Id);
    }

    /// <summary>
    /// Gets hash code based on Id
    /// </summary>
    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }

    public static bool operator ==(Entity<TId>? left, Entity<TId>? right)
    {
        if (left is null && right is null)
            return true;

        if (left is null || right is null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(Entity<TId>? left, Entity<TId>? right)
    {
        return !(left == right);
    }
}

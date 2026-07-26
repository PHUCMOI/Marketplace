using System.Text.RegularExpressions;

namespace LogisticsMarketplace.Service.Domain.Common.ValueObjects;

/// <summary>
/// Email value object
/// </summary>
public partial record Email
{
    /// <summary>
    /// Email address value
    /// </summary>
    public string Value { get; init; }

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailRegex();

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Email cannot be empty", nameof(value));

        if (!EmailRegex().IsMatch(value))
            throw new ArgumentException("Invalid email format", nameof(value));

        Value = value.ToLowerInvariant();
    }

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;
}

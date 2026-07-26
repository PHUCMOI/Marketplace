using System.Text.RegularExpressions;

namespace LogisticsMarketplace.Service.Domain.Common.ValueObjects;

/// <summary>
/// Phone number value object
/// </summary>
public partial record PhoneNumber
{
    /// <summary>
    /// Phone number value
    /// </summary>
    public string Value { get; init; }

    [GeneratedRegex(@"^\+?[1-9]\d{1,14}$")]
    private static partial Regex PhoneRegex();

    public PhoneNumber(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Phone number cannot be empty", nameof(value));

        var cleaned = value.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
        
        if (!PhoneRegex().IsMatch(cleaned))
            throw new ArgumentException("Invalid phone number format", nameof(value));

        Value = cleaned;
    }

    public override string ToString() => Value;

    public static implicit operator string(PhoneNumber phoneNumber) => phoneNumber.Value;
}

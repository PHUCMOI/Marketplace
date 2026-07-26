namespace LogisticsMarketplace.Service.Domain.Common.ValueObjects;

/// <summary>
/// Address value object
/// </summary>
public record Address
{
    /// <summary>
    /// Street address
    /// </summary>
    public string Street { get; init; }

    /// <summary>
    /// City name
    /// </summary>
    public string City { get; init; }

    /// <summary>
    /// State or province
    /// </summary>
    public string State { get; init; }

    /// <summary>
    /// Postal/ZIP code
    /// </summary>
    public string ZipCode { get; init; }

    /// <summary>
    /// Country name
    /// </summary>
    public string Country { get; init; }

    public Address(string street, string city, string state, string zipCode, string country)
    {
        if (string.IsNullOrWhiteSpace(street))
            throw new ArgumentException("Street cannot be empty", nameof(street));
        
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("City cannot be empty", nameof(city));
        
        if (string.IsNullOrWhiteSpace(state))
            throw new ArgumentException("State cannot be empty", nameof(state));
        
        if (string.IsNullOrWhiteSpace(zipCode))
            throw new ArgumentException("ZIP code cannot be empty", nameof(zipCode));
        
        if (string.IsNullOrWhiteSpace(country))
            throw new ArgumentException("Country cannot be empty", nameof(country));

        Street = street;
        City = city;
        State = state;
        ZipCode = zipCode;
        Country = country;
    }

    /// <summary>
    /// Returns full address as formatted string
    /// </summary>
    public override string ToString()
    {
        return $"{Street}, {City}, {State} {ZipCode}, {Country}";
    }
}

namespace LogisticsMarketplace.BFF.Api.Models;

public sealed class VietnamProvinceResponse
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public sealed class ListingLocationRequest
{
    public string AddressLine { get; set; } = string.Empty;
    public string ProvinceCode { get; set; } = string.Empty;
}

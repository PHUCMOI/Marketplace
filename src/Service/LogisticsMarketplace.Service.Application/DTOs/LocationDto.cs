namespace LogisticsMarketplace.Service.Application.DTOs;

public sealed class ListingLocationInputDto
{
    public string AddressLine { get; set; } = string.Empty;
    public string ProvinceCode { get; set; } = string.Empty;
}

public sealed record VietnamProvinceDto(
    string Code,
    string Name,
    double Latitude,
    double Longitude);

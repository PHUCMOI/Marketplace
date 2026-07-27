using LogisticsMarketplace.Service.Application.Services;

namespace LogisticsMarketplace.Service.Integration.Tests;

public sealed class VietnamProvinceCatalogTests
{
    [Fact]
    public void Catalog_contains_34_unique_official_province_codes()
    {
        var provinces = VietnamProvinceCatalog.GetAll();

        Assert.Equal(34, provinces.Count);
        Assert.Equal(34, provinces.Select(x => x.Code).Distinct().Count());
        Assert.Equal("01", VietnamProvinceCatalog.GetRequired("01").Code);
        Assert.Equal("79", VietnamProvinceCatalog.GetRequired("79").Code);
    }

    [Fact]
    public void Catalog_rejects_unknown_province_code()
    {
        Assert.Throws<ArgumentException>(() => VietnamProvinceCatalog.GetRequired("00"));
    }
}

using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Services;

public static class VietnamProvinceCatalog
{
    private static readonly IReadOnlyList<VietnamProvinceDto> Provinces =
    [
        new("01", "Thành phố Hà Nội", 21.0285, 105.8542),
        new("04", "Tỉnh Cao Bằng", 22.6666, 106.2640),
        new("08", "Tỉnh Tuyên Quang", 21.8236, 105.2180),
        new("11", "Tỉnh Điện Biên", 21.3860, 103.0230),
        new("12", "Tỉnh Lai Châu", 22.3860, 103.4700),
        new("14", "Tỉnh Sơn La", 21.3270, 103.9140),
        new("15", "Tỉnh Lào Cai", 22.4856, 103.9707),
        new("19", "Tỉnh Thái Nguyên", 21.5942, 105.8482),
        new("20", "Tỉnh Lạng Sơn", 21.8537, 106.7615),
        new("22", "Tỉnh Quảng Ninh", 20.9510, 107.0800),
        new("24", "Tỉnh Bắc Ninh", 21.1861, 106.0763),
        new("25", "Tỉnh Phú Thọ", 21.3227, 105.4019),
        new("31", "Thành phố Hải Phòng", 20.8449, 106.6881),
        new("33", "Tỉnh Hưng Yên", 20.6464, 106.0511),
        new("37", "Tỉnh Ninh Bình", 20.2506, 105.9745),
        new("38", "Tỉnh Thanh Hóa", 19.8067, 105.7852),
        new("40", "Tỉnh Nghệ An", 18.6796, 105.6813),
        new("42", "Tỉnh Hà Tĩnh", 18.3559, 105.8877),
        new("44", "Tỉnh Quảng Trị", 16.8163, 107.1003),
        new("46", "Thành phố Huế", 16.4637, 107.5909),
        new("48", "Thành phố Đà Nẵng", 16.0544, 108.2022),
        new("51", "Tỉnh Quảng Ngãi", 15.1214, 108.8044),
        new("52", "Tỉnh Gia Lai", 13.9718, 108.0151),
        new("56", "Tỉnh Khánh Hòa", 12.2388, 109.1967),
        new("66", "Tỉnh Đắk Lắk", 12.6667, 108.0500),
        new("68", "Tỉnh Lâm Đồng", 11.9404, 108.4583),
        new("75", "Tỉnh Đồng Nai", 10.9574, 106.8427),
        new("79", "Thành phố Hồ Chí Minh", 10.7769, 106.7009),
        new("80", "Tỉnh Tây Ninh", 11.3352, 106.1099),
        new("82", "Tỉnh Đồng Tháp", 10.4938, 105.6882),
        new("86", "Tỉnh Vĩnh Long", 10.2537, 105.9722),
        new("91", "Tỉnh An Giang", 10.3759, 105.4185),
        new("92", "Thành phố Cần Thơ", 10.0452, 105.7469),
        new("96", "Tỉnh Cà Mau", 9.1768, 105.1524)
    ];

    public static IReadOnlyList<VietnamProvinceDto> GetAll() => Provinces;

    public static VietnamProvinceDto GetRequired(string code) =>
        Provinces.FirstOrDefault(x => x.Code == code?.Trim())
        ?? throw new ArgumentException("Tỉnh/thành phố không hợp lệ.", nameof(code));
}

using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class DriverService : IDriverService
{
    private readonly IDriverRepository _drivers;
    private readonly IUnitOfWork _unitOfWork;

    public DriverService(IDriverRepository drivers, IUnitOfWork unitOfWork)
    {
        _drivers = drivers;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<DriverDto>> GetAllDriversAsync(CancellationToken cancellationToken = default) =>
        (await _drivers.GetAllAsync(cancellationToken)).Select(Map);

    public async Task<IEnumerable<DriverDto>> GetDriversForOrganizationAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        (await _drivers.GetByOrganizationIdAsync(organizationId, cancellationToken)).Select(Map);

    public async Task<IEnumerable<DriverDto>> GetAvailableDriversAsync(Guid organizationId, CancellationToken cancellationToken = default) =>
        (await _drivers.GetAvailableAsync(organizationId, cancellationToken)).Select(Map);

    public async Task<DriverDto?> GetDriverByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var driver = await _drivers.GetByIdAsync(id, cancellationToken);
        return driver is null ? null : Map(driver);
    }

    public async Task<DriverDto> CreateDriverAsync(CreateDriverDto dto, CancellationToken cancellationToken = default)
    {
        if (await _drivers.LicenseNumberExistsAsync(dto.LicenseNumber, cancellationToken: cancellationToken))
            throw new InvalidOperationException($"Driver license {dto.LicenseNumber} already exists.");

        var driver = new Driver(dto.UserId, dto.LicenseNumber, new PhoneNumber(dto.Phone), dto.OrganizationId);
        await _drivers.AddAsync(driver, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(driver);
    }

    public async Task<DriverDto> UpdateDriverAsync(Guid id, UpdateDriverDto dto, CancellationToken cancellationToken = default)
    {
        var driver = await RequireDriverAsync(id, cancellationToken);
        var nextLicense = dto.LicenseNumber ?? driver.LicenseNumber;
        if (await _drivers.LicenseNumberExistsAsync(nextLicense, id, cancellationToken))
            throw new InvalidOperationException($"Driver license {nextLicense} already exists.");

        if (dto.LicenseNumber is not null)
            driver.UpdateLicense(dto.LicenseNumber);
        if (dto.Phone is not null)
            driver.UpdatePhone(new PhoneNumber(dto.Phone));
        if (dto.Status.HasValue)
            driver.UpdateStatus(dto.Status.Value);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(driver);
    }

    public async Task DeleteDriverAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var driver = await RequireDriverAsync(id, cancellationToken);
        if (!driver.IsAvailableForDispatch())
            throw new InvalidOperationException("Only available drivers can be deleted.");
        _drivers.Remove(driver);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Driver> RequireDriverAsync(Guid id, CancellationToken cancellationToken) =>
        await _drivers.GetByIdAsync(id, cancellationToken)
        ?? throw new KeyNotFoundException($"Driver {id} was not found.");

    internal static DriverDto Map(Driver driver) => new()
    {
        Id = driver.Id,
        UserId = driver.UserId,
        LicenseNumber = driver.LicenseNumber,
        Status = driver.Status,
        Phone = driver.Phone.Value,
        OrganizationId = driver.OrganizationId
    };
}
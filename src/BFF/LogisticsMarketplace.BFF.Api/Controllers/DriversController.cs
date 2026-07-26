using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/drivers")]
[Authorize]
public sealed class DriversController : ControllerBase
{
    private readonly IServiceApiClient _service;
    public DriversController(IServiceApiClient service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<DriverResponse>>>> Get([FromQuery] Guid organizationId, CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<DriverResponse>>.SuccessResult(await _service.GetDriversAsync(organizationId, cancellationToken)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<DriverResponse>>> Create(CreateDriverRequest request, CancellationToken cancellationToken) =>
        Ok(ApiResponse<DriverResponse>.SuccessResult(await _service.CreateDriverAsync(request, cancellationToken)));
}
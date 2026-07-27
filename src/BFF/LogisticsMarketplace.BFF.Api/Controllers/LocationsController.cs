using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/locations")]
[Authorize]
public sealed class LocationsController : ControllerBase
{
    private readonly IServiceApiClient _service;

    public LocationsController(IServiceApiClient service) => _service = service;

    [HttpGet("vietnam-provinces")]
    public async Task<ActionResult<ApiResponse<List<VietnamProvinceResponse>>>> GetVietnamProvinces(
        CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<VietnamProvinceResponse>>.SuccessResult(
            await _service.GetVietnamProvincesAsync(cancellationToken)));
}

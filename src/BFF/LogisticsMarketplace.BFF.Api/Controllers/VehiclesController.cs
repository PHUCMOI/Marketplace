using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/vehicles")]
[Authorize]
public sealed class VehiclesController : ControllerBase
{
    private readonly IServiceApiClient _service;
    public VehiclesController(IServiceApiClient service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<VehicleResponse>>>> Get([FromQuery] Guid organizationId, CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<VehicleResponse>>.SuccessResult(await _service.GetVehiclesAsync(organizationId, cancellationToken)));

    [HttpPost]
    public async Task<ActionResult<ApiResponse<VehicleResponse>>> Create(CreateVehicleRequest request, CancellationToken cancellationToken) =>
        Ok(ApiResponse<VehicleResponse>.SuccessResult(await _service.CreateVehicleAsync(request, cancellationToken)));
}
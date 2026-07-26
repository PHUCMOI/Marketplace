using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/deals")]
[Authorize]
public sealed class DealsController : ControllerBase
{
    private readonly IServiceApiClient _service;
    public DealsController(IServiceApiClient service) => _service = service;

    [HttpGet]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<ApiResponse<List<DealResponse>>>> GetAll(CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<DealResponse>>.SuccessResult(await _service.GetDealsAsync(cancellationToken)));
    [HttpGet("carrier/{carrierOrgId:guid}")]
    public async Task<ActionResult<ApiResponse<List<DealResponse>>>> GetForCarrier(Guid carrierOrgId, CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<DealResponse>>.SuccessResult(await _service.GetDealsForCarrierAsync(carrierOrgId, cancellationToken)));

    [HttpGet("shipper/{shipperOrgId:guid}")]
    public async Task<ActionResult<ApiResponse<List<DealResponse>>>> GetForShipper(Guid shipperOrgId, CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<DealResponse>>.SuccessResult(await _service.GetDealsForShipperAsync(shipperOrgId, cancellationToken)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<DealResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var deal = await _service.GetDealByIdAsync(id, cancellationToken);
        return deal is null
            ? NotFound(ApiResponse<DealResponse>.FailureResult("Deal not found."))
            : Ok(ApiResponse<DealResponse>.SuccessResult(deal));
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, CancellationToken cancellationToken)
    {
        await _service.CancelDealAsync(id, cancellationToken);
        return NoContent();
    }
}
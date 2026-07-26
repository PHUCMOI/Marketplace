using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.BFF.Api.Controllers;
[ApiController,Route("api/dispatches"),Authorize]
public sealed class DispatchesController:ControllerBase
{
    private readonly IServiceApiClient _service;public DispatchesController(IServiceApiClient service)=>_service=service;
    [HttpGet("carrier/{carrierOrgId:guid}")]
    public async Task<ActionResult<ApiResponse<List<DispatchResponse>>>> GetForCarrier(Guid carrierOrgId,CancellationToken ct)=>Ok(ApiResponse<List<DispatchResponse>>.SuccessResult(await _service.GetDispatchesForCarrierAsync(carrierOrgId,ct)));
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DispatchResponse>>> Create(CreateDispatchRequest request,CancellationToken ct){var item=await _service.CreateDispatchAsync(request,ct);return CreatedAtAction(nameof(GetForCarrier),new{carrierOrgId=item.CarrierOrgId},ApiResponse<DispatchResponse>.SuccessResult(item));}
    [HttpPost("{id:guid}/assign")]
    public async Task<ActionResult<ApiResponse<DispatchResponse>>> Assign(Guid id,AssignDispatchRequest request,CancellationToken ct)=>Ok(ApiResponse<DispatchResponse>.SuccessResult(await _service.AssignDispatchAsync(id,request,ct)));
    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiResponse<DispatchResponse>>> UpdateStatus(Guid id,UpdateDispatchStatusRequest request,CancellationToken ct)=>Ok(ApiResponse<DispatchResponse>.SuccessResult(await _service.UpdateDispatchStatusAsync(id,request,ct)));
}
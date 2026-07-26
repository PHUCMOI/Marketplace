using LogisticsMarketplace.Service.Api.Security;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.Service.Api.Controllers;
[ApiController,Route("api/dispatches"),Authorize]
public sealed class DispatchesController:ControllerBase
{
    private readonly IDispatchService _dispatches;public DispatchesController(IDispatchService dispatches)=>_dispatches=dispatches;
    [HttpGet,Authorize(Roles="Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<DispatchDto>>> GetAll(CancellationToken ct)=>Ok(await _dispatches.GetAllDispatchesAsync(ct));
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DispatchDto>> GetById(Guid id,CancellationToken ct){var item=await _dispatches.GetDispatchByIdAsync(id,ct);if(item is null)return NotFound();return User.CanReadOrganization(item.CarrierOrgId)?Ok(item):Forbid();}
    [HttpGet("deal/{dealId:guid}")]
    public async Task<ActionResult<DispatchDto>> GetByDeal(Guid dealId,CancellationToken ct){var item=await _dispatches.GetDispatchByDealIdAsync(dealId,ct);if(item is null)return NotFound();return User.CanReadOrganization(item.CarrierOrgId)?Ok(item):Forbid();}
    [HttpGet("carrier/{carrierOrgId:guid}")]
    public async Task<ActionResult<IEnumerable<DispatchDto>>> GetForCarrier(Guid carrierOrgId,CancellationToken ct)=>User.CanReadOrganization(carrierOrgId)?Ok(await _dispatches.GetDispatchesByCarrierOrgIdAsync(carrierOrgId,ct)):Forbid();
    [HttpPost,Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<DispatchDto>> Create(CreateDispatchDto dto,CancellationToken ct){if(!User.IsAdmin())dto.CarrierOrgId=User.GetOrganizationId()??throw new UnauthorizedAccessException("A carrier organization is required.");dto.CreatedByUserId=User.GetUserId();var item=await _dispatches.CreateDispatchAsync(dto,ct);return CreatedAtAction(nameof(GetById),new{id=item.Id},item);}
    [HttpPost("{id:guid}/assign"),Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<DispatchDto>> Assign(Guid id,AssignVehicleAndDriverDto dto,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();return Ok(await _dispatches.AssignVehicleAndDriverAsync(id,dto.VehicleId,dto.DriverId,User.GetUserId(),ct));}
    [HttpPatch("{id:guid}/status"),Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<DispatchDto>> UpdateStatus(Guid id,UpdateDispatchStatusDto dto,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();return Ok(await _dispatches.UpdateDispatchStatusAsync(id,dto.Status,dto.Notes,User.GetUserId(),ct));}
    private async Task<bool> CanManage(Guid id,CancellationToken ct){var item=await _dispatches.GetDispatchByIdAsync(id,ct)??throw new KeyNotFoundException($"Dispatch {id} was not found.");return User.CanManageOrganization(item.CarrierOrgId);}
}
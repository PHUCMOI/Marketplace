using LogisticsMarketplace.Service.Api.Security;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.Service.Api.Controllers;
[ApiController, Route("api/vehicles"), Authorize]
public sealed class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicles; public VehiclesController(IVehicleService vehicles)=>_vehicles=vehicles;
    [HttpGet, Authorize(Roles="Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<VehicleDto>>> GetAll(CancellationToken ct)=>Ok(await _vehicles.GetAllVehiclesAsync(ct));
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VehicleDto>> GetById(Guid id,CancellationToken ct){var item=await _vehicles.GetVehicleByIdAsync(id,ct);if(item is null)return NotFound();return User.CanReadOrganization(item.OrganizationId)?Ok(item):Forbid();}
    [HttpGet("organization/{organizationId:guid}")]
    public async Task<ActionResult<IEnumerable<VehicleDto>>> GetForOrganization(Guid organizationId,CancellationToken ct)=>User.CanReadOrganization(organizationId)?Ok(await _vehicles.GetVehiclesForOrganizationAsync(organizationId,ct)):Forbid();
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<VehicleDto>>> GetAvailable([FromQuery]Guid organizationId,CancellationToken ct)=>User.CanReadOrganization(organizationId)?Ok(await _vehicles.GetAvailableVehiclesAsync(organizationId,ct)):Forbid();
    [HttpPost, Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<VehicleDto>> Create(CreateVehicleDto dto,CancellationToken ct){if(!User.IsAdmin())dto.OrganizationId=User.GetOrganizationId()??throw new UnauthorizedAccessException("A carrier organization is required.");var item=await _vehicles.CreateVehicleAsync(dto,ct);return CreatedAtAction(nameof(GetById),new{id=item.Id},item);}
    [HttpPut("{id:guid}"), Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<VehicleDto>> Update(Guid id,UpdateVehicleDto dto,CancellationToken ct){var item=await _vehicles.GetVehicleByIdAsync(id,ct);if(item is null)return NotFound();if(!User.CanManageOrganization(item.OrganizationId))return Forbid();return Ok(await _vehicles.UpdateVehicleAsync(id,dto,ct));}
    [HttpDelete("{id:guid}"), Authorize(Roles="Carrier,Admin")]
    public async Task<IActionResult> Delete(Guid id,CancellationToken ct){var item=await _vehicles.GetVehicleByIdAsync(id,ct);if(item is null)return NotFound();if(!User.CanManageOrganization(item.OrganizationId))return Forbid();await _vehicles.DeleteVehicleAsync(id,ct);return NoContent();}
}
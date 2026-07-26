using LogisticsMarketplace.Service.Api.Security;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.Service.Api.Controllers;
[ApiController, Route("api/drivers"), Authorize]
public sealed class DriversController : ControllerBase
{
    private readonly IDriverService _drivers; public DriversController(IDriverService drivers)=>_drivers=drivers;
    [HttpGet, Authorize(Roles="Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<DriverDto>>> GetAll(CancellationToken ct)=>Ok(await _drivers.GetAllDriversAsync(ct));
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DriverDto>> GetById(Guid id,CancellationToken ct){var item=await _drivers.GetDriverByIdAsync(id,ct);if(item is null)return NotFound();return User.CanReadOrganization(item.OrganizationId)?Ok(item):Forbid();}
    [HttpGet("organization/{organizationId:guid}")]
    public async Task<ActionResult<IEnumerable<DriverDto>>> GetForOrganization(Guid organizationId,CancellationToken ct)=>User.CanReadOrganization(organizationId)?Ok(await _drivers.GetDriversForOrganizationAsync(organizationId,ct)):Forbid();
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<DriverDto>>> GetAvailable([FromQuery]Guid organizationId,CancellationToken ct)=>User.CanReadOrganization(organizationId)?Ok(await _drivers.GetAvailableDriversAsync(organizationId,ct)):Forbid();
    [HttpPost, Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<DriverDto>> Create(CreateDriverDto dto,CancellationToken ct){if(!User.IsAdmin())dto.OrganizationId=User.GetOrganizationId()??throw new UnauthorizedAccessException("A carrier organization is required.");var item=await _drivers.CreateDriverAsync(dto,ct);return CreatedAtAction(nameof(GetById),new{id=item.Id},item);}
    [HttpPut("{id:guid}"), Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<DriverDto>> Update(Guid id,UpdateDriverDto dto,CancellationToken ct){var item=await _drivers.GetDriverByIdAsync(id,ct);if(item is null)return NotFound();if(!User.CanManageOrganization(item.OrganizationId))return Forbid();return Ok(await _drivers.UpdateDriverAsync(id,dto,ct));}
    [HttpDelete("{id:guid}"), Authorize(Roles="Carrier,Admin")]
    public async Task<IActionResult> Delete(Guid id,CancellationToken ct){var item=await _drivers.GetDriverByIdAsync(id,ct);if(item is null)return NotFound();if(!User.CanManageOrganization(item.OrganizationId))return Forbid();await _drivers.DeleteDriverAsync(id,ct);return NoContent();}
}
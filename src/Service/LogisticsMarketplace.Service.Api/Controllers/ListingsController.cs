using LogisticsMarketplace.Service.Api.Security;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.Service.Api.Controllers;
[ApiController,Route("api/listings"),Authorize]
public sealed class ListingsController:ControllerBase
{
    private readonly IListingService _listings; public ListingsController(IListingService listings)=>_listings=listings;
    [HttpGet,Authorize(Roles="Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetAll(CancellationToken ct)=>Ok(await _listings.GetAllListingsAsync(ct));
    [HttpGet("open")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetOpen(CancellationToken ct)=>Ok(await _listings.GetOpenListingsAsync(ct));
    [HttpGet("shipper/{shipperOrgId:guid}")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetForShipper(Guid shipperOrgId,CancellationToken ct)=>User.CanReadOrganization(shipperOrgId)?Ok(await _listings.GetListingsByShipperOrgIdAsync(shipperOrgId,ct)):Forbid();
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ListingDto>> GetById(Guid id,CancellationToken ct){var item=await _listings.GetListingByIdAsync(id,ct);return item is null?NotFound():Ok(item);}
    [HttpPost,Authorize(Roles="Shipper,Admin")]
    public async Task<ActionResult<ListingDto>> Create(CreateListingDto dto,CancellationToken ct){if(!User.IsAdmin())dto.ShipperOrgId=User.GetOrganizationId()??throw new UnauthorizedAccessException("A shipper organization is required.");var item=await _listings.CreateListingAsync(dto,User.GetUserId(),ct);return CreatedAtAction(nameof(GetById),new{id=item.Id},item);}
    [HttpPut("{id:guid}"),Authorize(Roles="Shipper,Admin")]
    public async Task<ActionResult<ListingDto>> Update(Guid id,UpdateListingDto dto,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();return Ok(await _listings.UpdateListingAsync(id,dto,ct));}
    [HttpPost("{id:guid}/publish"),Authorize(Roles="Shipper,Admin")]
    public async Task<IActionResult> Publish(Guid id,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();await _listings.PublishListingAsync(id,ct);return NoContent();}
    [HttpPost("{id:guid}/cancel"),Authorize(Roles="Shipper,Admin")]
    public async Task<IActionResult> Cancel(Guid id,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();await _listings.CancelListingAsync(id,ct);return NoContent();}
    [HttpPost("{id:guid}/award"),Authorize(Roles="Shipper,Admin")]
    public async Task<ActionResult<DealDto>> Award(Guid id,AwardListingDto request,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();return Ok(await _listings.AwardDealAsync(id,request.BidId,ct));}
    [HttpDelete("{id:guid}"),Authorize(Roles="Shipper,Admin")]
    public async Task<IActionResult> Delete(Guid id,CancellationToken ct){if(!await CanManage(id,ct))return Forbid();await _listings.DeleteListingAsync(id,ct);return NoContent();}
    private async Task<bool> CanManage(Guid id,CancellationToken ct){var item=await _listings.GetListingByIdAsync(id,ct);if(item is null)throw new KeyNotFoundException($"Listing {id} was not found.");return User.CanManageOrganization(item.ShipperOrgId);}
}
public sealed class AwardListingDto{public Guid BidId{get;set;}}
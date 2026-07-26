using LogisticsMarketplace.Service.Api.Security;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.Service.Api.Controllers;
[ApiController,Route("api/deals"),Authorize]
public sealed class DealsController:ControllerBase
{
    private readonly IDealService _deals;public DealsController(IDealService deals)=>_deals=deals;
    [HttpGet,Authorize(Roles="Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<DealDto>>> GetAll(CancellationToken ct)=>Ok(await _deals.GetAllDealsAsync(ct));
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DealDto>> GetById(Guid id,CancellationToken ct){var item=await _deals.GetDealByIdAsync(id,ct);if(item is null)return NotFound();return CanRead(item)?Ok(item):Forbid();}
    [HttpGet("listing/{listingId:guid}")]
    public async Task<ActionResult<DealDto>> GetByListing(Guid listingId,CancellationToken ct){var item=await _deals.GetDealByListingIdAsync(listingId,ct);if(item is null)return NotFound();return CanRead(item)?Ok(item):Forbid();}
    [HttpGet("shipper/{shipperOrgId:guid}")]
    public async Task<ActionResult<IEnumerable<DealDto>>> GetForShipper(Guid shipperOrgId,CancellationToken ct)=>User.CanReadOrganization(shipperOrgId)?Ok(await _deals.GetDealsByShipperOrgIdAsync(shipperOrgId,ct)):Forbid();
    [HttpGet("carrier/{carrierOrgId:guid}")]
    public async Task<ActionResult<IEnumerable<DealDto>>> GetForCarrier(Guid carrierOrgId,CancellationToken ct)=>User.CanReadOrganization(carrierOrgId)?Ok(await _deals.GetDealsByCarrierOrgIdAsync(carrierOrgId,ct)):Forbid();
    [HttpPost("{id:guid}/complete"),Authorize(Roles="Admin,Dispatcher")]
    public async Task<IActionResult> Complete(Guid id,CancellationToken ct){await _deals.CompleteDealAsync(id,User.GetUserId(),ct);return NoContent();}
    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id,CancellationToken ct){var item=await _deals.GetDealByIdAsync(id,ct)??throw new KeyNotFoundException($"Deal {id} was not found.");if(!CanRead(item))return Forbid();await _deals.CancelDealAsync(id,User.GetUserId(),ct);return NoContent();}
    private bool CanRead(DealDto item)=>User.IsAdmin()||User.IsDispatcher()||User.GetOrganizationId() is Guid org&&(org==item.ShipperOrgId||org==item.CarrierOrgId);
}
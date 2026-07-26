using LogisticsMarketplace.Service.Api.Security;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.Service.Api.Controllers;
[ApiController,Route("api/bids"),Authorize]
public sealed class BidsController:ControllerBase
{
    private readonly IBidService _bids;public BidsController(IBidService bids)=>_bids=bids;
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BidDto>> GetById(Guid id,CancellationToken ct){var item=await _bids.GetBidByIdAsync(id,ct);if(item is null)return NotFound();return User.CanReadOrganization(item.CarrierOrgId)?Ok(item):Forbid();}
    [HttpGet("listing/{listingId:guid}")]
    public async Task<ActionResult<IEnumerable<BidDto>>> GetForListing(Guid listingId,CancellationToken ct)=>Ok(await _bids.GetBidsForListingAsync(listingId,ct));
    [HttpGet("carrier/{carrierOrgId:guid}")]
    public async Task<ActionResult<IEnumerable<BidDto>>> GetForCarrier(Guid carrierOrgId,CancellationToken ct)=>User.CanReadOrganization(carrierOrgId)?Ok(await _bids.GetBidsForCarrierAsync(carrierOrgId,ct)):Forbid();
    [HttpPost,Authorize(Roles="Carrier,Admin")]
    public async Task<ActionResult<BidDto>> Place(CreateBidDto dto,CancellationToken ct){if(!User.IsAdmin())dto.CarrierOrgId=User.GetOrganizationId()??throw new UnauthorizedAccessException("A carrier organization is required.");var item=await _bids.PlaceBidAsync(dto,User.GetUserId(),ct);return CreatedAtAction(nameof(GetById),new{id=item.Id},item);}
    [HttpDelete("{id:guid}"),Authorize(Roles="Carrier,Admin")]
    public async Task<IActionResult> Withdraw(Guid id,CancellationToken ct){var item=await _bids.GetBidByIdAsync(id,ct)??throw new KeyNotFoundException($"Bid {id} was not found.");if(!User.CanManageOrganization(item.CarrierOrgId))return Forbid();await _bids.WithdrawBidAsync(id,ct);return NoContent();}
}
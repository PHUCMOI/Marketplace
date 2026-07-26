using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LogisticsMarketplace.BFF.Api.Controllers;
[ApiController,Route("api/bids"),Authorize]
public sealed class BidsController:ControllerBase
{
    private readonly IServiceApiClient _service;public BidsController(IServiceApiClient service)=>_service=service;
    [HttpGet("listing/{listingId:guid}")]
    public async Task<ActionResult<ApiResponse<List<BidResponse>>>> GetForListing(Guid listingId,CancellationToken ct)=>Ok(ApiResponse<List<BidResponse>>.SuccessResult(await _service.GetBidsForListingAsync(listingId,ct)));
    [HttpGet("carrier/{carrierOrgId:guid}")]
    public async Task<ActionResult<ApiResponse<List<BidResponse>>>> GetForCarrier(Guid carrierOrgId,CancellationToken ct)=>Ok(ApiResponse<List<BidResponse>>.SuccessResult(await _service.GetBidsForCarrierAsync(carrierOrgId,ct)));
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BidResponse>>> Create(CreateBidRequest request,CancellationToken ct){var item=await _service.CreateBidAsync(request,ct);return CreatedAtAction(nameof(GetForListing),new{listingId=item.ListingId},ApiResponse<BidResponse>.SuccessResult(item));}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id,CancellationToken ct){await _service.DeleteBidAsync(id,ct);return NoContent();}
}
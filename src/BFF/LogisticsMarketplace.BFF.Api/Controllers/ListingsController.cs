using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/listings")]
[Authorize]
public sealed class ListingsController : ControllerBase
{
    private readonly IServiceApiClient _service;
    public ListingsController(IServiceApiClient service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ListingResponse>>>> GetOpen(CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<ListingResponse>>.SuccessResult(await _service.GetOpenListingsAsync(cancellationToken)));

    [HttpGet("shipper/{shipperOrgId:guid}")]
    public async Task<ActionResult<ApiResponse<List<ListingResponse>>>> GetForShipper(Guid shipperOrgId, CancellationToken cancellationToken) =>
        Ok(ApiResponse<List<ListingResponse>>.SuccessResult(await _service.GetListingsForShipperAsync(shipperOrgId, cancellationToken)));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ListingDetailResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var listing = await _service.GetListingByIdAsync(id, cancellationToken);
        return listing is null
            ? NotFound(ApiResponse<ListingDetailResponse>.FailureResult("Listing not found."))
            : Ok(ApiResponse<ListingDetailResponse>.SuccessResult(listing));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ListingResponse>>> Create(CreateListingRequest request, CancellationToken cancellationToken)
    {
        var listing = await _service.CreateListingAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = listing.Id }, ApiResponse<ListingResponse>.SuccessResult(listing));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ListingResponse>>> Update(Guid id, UpdateListingRequest request, CancellationToken cancellationToken) =>
        Ok(ApiResponse<ListingResponse>.SuccessResult(await _service.UpdateListingAsync(id, request, cancellationToken)));

    [HttpPost("{id:guid}/award")]
    public async Task<ActionResult<ApiResponse<DealResponse>>> Award(Guid id, AwardListingRequest request, CancellationToken cancellationToken) =>
        Ok(ApiResponse<DealResponse>.SuccessResult(await _service.AwardListingAsync(id, request.BidId, cancellationToken)));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _service.DeleteListingAsync(id, cancellationToken);
        return NoContent();
    }
}
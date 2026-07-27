using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.Service.Api.Controllers;

[ApiController]
[Route("api/locations")]
[Authorize]
public sealed class LocationsController : ControllerBase
{
    [HttpGet("vietnam-provinces")]
    public ActionResult<IReadOnlyList<VietnamProvinceDto>> GetVietnamProvinces() =>
        Ok(VietnamProvinceCatalog.GetAll());
}

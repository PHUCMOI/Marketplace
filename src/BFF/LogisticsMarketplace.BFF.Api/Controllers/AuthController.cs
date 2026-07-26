using LogisticsMarketplace.BFF.Api.Models;
using LogisticsMarketplace.BFF.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogisticsMarketplace.BFF.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public sealed class AuthController : ControllerBase
{
    private readonly IServiceApiClient _service;
    public AuthController(IServiceApiClient service) => _service = service;

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request, CancellationToken cancellationToken) =>
        Ok(ApiResponse<AuthResponse>.SuccessResult(await _service.LoginAsync(request, cancellationToken)));

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request, CancellationToken cancellationToken) =>
        Ok(ApiResponse<AuthResponse>.SuccessResult(await _service.RegisterAsync(request, cancellationToken)));
}
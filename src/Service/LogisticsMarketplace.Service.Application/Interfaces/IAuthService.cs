using LogisticsMarketplace.Service.Application.DTOs;

namespace LogisticsMarketplace.Service.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default);
}

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string passwordHash);
}

public interface ITokenService
{
    AccessToken CreateAccessToken(
        Guid userId,
        string email,
        string fullName,
        string role,
        Guid? organizationId,
        string? organizationType);
}
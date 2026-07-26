using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace LogisticsMarketplace.Service.Api.Security;

public sealed class JwtTokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration) => _configuration = configuration;

    public AccessToken CreateAccessToken(
        Guid userId,
        string email,
        string fullName,
        string role,
        Guid? organizationId,
        string? organizationType)
    {
        var jwt = _configuration.GetSection("Jwt");
        var expiresAt = DateTime.UtcNow.AddMinutes(jwt.GetValue("ExpiryMinutes", 60));
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(JwtRegisteredClaimNames.Email, email),
            new(ClaimTypes.Name, fullName),
            new(ClaimTypes.Role, role),
            new("Role", role)
        };

        if (organizationId.HasValue)
            claims.Add(new Claim("OrganizationId", organizationId.Value.ToString()));
        if (!string.IsNullOrWhiteSpace(organizationType))
            claims.Add(new Claim("OrganizationType", organizationType));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Secret"]!));
        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new AccessToken(new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
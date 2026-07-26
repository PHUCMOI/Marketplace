using System.Security.Claims;

namespace LogisticsMarketplace.Service.Api.Security;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user) =>
        GetGuidClaim(user, ClaimTypes.NameIdentifier, "sub", "userId")
        ?? throw new UnauthorizedAccessException("The access token does not contain a valid user id.");

    public static Guid? GetOrganizationId(this ClaimsPrincipal user) => GetGuidClaim(user, "OrganizationId");
    public static bool IsAdmin(this ClaimsPrincipal user) => user.IsInRole("Admin") || user.HasClaim("Role", "Admin");
    public static bool IsDispatcher(this ClaimsPrincipal user) => user.IsInRole("Dispatcher") || user.HasClaim("Role", "Dispatcher");
    public static bool CanReadOrganization(this ClaimsPrincipal user, Guid organizationId) =>
        user.IsAdmin() || user.IsDispatcher() || user.GetOrganizationId() == organizationId;
    public static bool CanManageOrganization(this ClaimsPrincipal user, Guid organizationId) =>
        user.IsAdmin() || user.GetOrganizationId() == organizationId;

    private static Guid? GetGuidClaim(ClaimsPrincipal user, params string[] claimTypes)
    {
        foreach (var claimType in claimTypes)
            if (Guid.TryParse(user.FindFirstValue(claimType), out var id)) return id;
        return null;
    }
}
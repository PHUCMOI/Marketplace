using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.UserAggregate;

public sealed class User : Entity<Guid>
{
    public Email Email { get; private set; } = null!;
    public string FullName { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public Guid? OrganizationId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private User() { }

    public User(Email email, string fullName, string passwordHash, UserRole role, Guid? organizationId = null)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("Full name is required.", nameof(fullName));
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("Password hash is required.", nameof(passwordHash));

        Id = Guid.NewGuid();
        Email = email ?? throw new ArgumentNullException(nameof(email));
        FullName = fullName.Trim();
        PasswordHash = passwordHash;
        Role = role;
        OrganizationId = organizationId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public void UpdateFullName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("Full name is required.", nameof(fullName));
        FullName = fullName.Trim();
        Touch();
    }

    public void UpdatePasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("Password hash is required.", nameof(passwordHash));
        PasswordHash = passwordHash;
        Touch();
    }

    public void UpdateRole(UserRole role)
    {
        Role = role;
        Touch();
    }

    public void AssignToOrganization(Guid organizationId)
    {
        OrganizationId = organizationId;
        Touch();
    }

    private void Touch() => UpdatedAt = DateTime.UtcNow;
}
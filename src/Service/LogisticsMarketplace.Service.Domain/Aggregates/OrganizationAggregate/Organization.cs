using LogisticsMarketplace.Service.Domain.Common;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;

namespace LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;

public sealed class Organization : Entity<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty;
    public Email ContactEmail { get; private set; } = null!;
    public PhoneNumber ContactPhone { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }

    private Organization() { }

    public Organization(string name, string type, Email contactEmail, PhoneNumber contactPhone)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Organization name is required.", nameof(name));
        if (string.IsNullOrWhiteSpace(type))
            throw new ArgumentException("Organization type is required.", nameof(type));

        Id = Guid.NewGuid();
        Name = name.Trim();
        Type = type.Trim();
        ContactEmail = contactEmail ?? throw new ArgumentNullException(nameof(contactEmail));
        ContactPhone = contactPhone ?? throw new ArgumentNullException(nameof(contactPhone));
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateContactInfo(Email email, PhoneNumber phone)
    {
        ContactEmail = email ?? throw new ArgumentNullException(nameof(email));
        ContactPhone = phone ?? throw new ArgumentNullException(nameof(phone));
    }
}
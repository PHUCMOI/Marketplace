using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.ToTable("Organizations");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Type).HasMaxLength(50).IsRequired();
        builder.Property(x => x.ContactEmail).HasConversion(x => x.Value, x => new(x)).HasMaxLength(256).IsRequired();
        builder.Property(x => x.ContactPhone).HasConversion(x => x.Value, x => new(x)).HasMaxLength(30).IsRequired();
        builder.HasIndex(x => x.ContactEmail).IsUnique();
    }
}
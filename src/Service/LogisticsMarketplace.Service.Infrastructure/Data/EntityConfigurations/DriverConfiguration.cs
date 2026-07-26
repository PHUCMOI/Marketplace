using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.UserAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class DriverConfiguration : IEntityTypeConfiguration<Driver>
{
    public void Configure(EntityTypeBuilder<Driver> builder)
    {
        builder.ToTable("Drivers");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.LicenseNumber).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Phone).HasConversion(x => x.Value, x => new(x)).HasMaxLength(30).IsRequired();
        builder.HasOne<User>().WithOne().HasForeignKey<Driver>(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Organization>().WithMany().HasForeignKey(x => x.OrganizationId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => x.LicenseNumber).IsUnique();
        builder.HasIndex(x => new { x.OrganizationId, x.Status });
    }
}
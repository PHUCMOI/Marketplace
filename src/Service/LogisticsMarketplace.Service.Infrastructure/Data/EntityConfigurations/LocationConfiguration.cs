using LogisticsMarketplace.Service.Domain.Aggregates.LocationAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.ToTable("Locations");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Type).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Latitude).IsRequired();
        builder.Property(x => x.Longitude).IsRequired();
        builder.OwnsOne(x => x.Address, address =>
        {
            address.Property(x => x.Street).HasMaxLength(256).IsRequired();
            address.Property(x => x.City).HasMaxLength(100).IsRequired();
            address.Property(x => x.State).HasMaxLength(100).IsRequired();
            address.Property(x => x.ZipCode).HasMaxLength(20).IsRequired();
            address.Property(x => x.Country).HasMaxLength(100).IsRequired();
        });
    }
}
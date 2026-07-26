using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.LocationAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class ListingConfiguration : IEntityTypeConfiguration<Listing>
{
    public void Configure(EntityTypeBuilder<Listing> builder)
    {
        builder.ToTable("Listings");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CargoDescription).HasMaxLength(1000).IsRequired();
        builder.Property(x => x.Weight).HasPrecision(18, 2).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.OwnsOne(x => x.Price, price =>
        {
            price.Property(x => x.Amount).HasColumnName("PriceAmount").HasPrecision(18, 2);
            price.Property(x => x.Currency).HasColumnName("PriceCurrency").HasMaxLength(3);
        });
        builder.HasOne<Organization>().WithMany().HasForeignKey(x => x.ShipperOrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Location>().WithMany().HasForeignKey(x => x.PickupLocationId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Location>().WithMany().HasForeignKey(x => x.DeliveryLocationId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.ShipperOrgId);
        builder.HasIndex(x => x.CreatedAt);
    }
}
using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class DealConfiguration : IEntityTypeConfiguration<Deal>
{
    public void Configure(EntityTypeBuilder<Deal> builder)
    {
        builder.ToTable("Deals");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.OwnsOne(x => x.AgreedPrice, price =>
        {
            price.Property(x => x.Amount).HasColumnName("AgreedPriceAmount").HasPrecision(18, 2).IsRequired();
            price.Property(x => x.Currency).HasColumnName("AgreedPriceCurrency").HasMaxLength(3).IsRequired();
        });
        builder.HasOne<Listing>().WithOne().HasForeignKey<Deal>(x => x.ListingId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Bid>().WithOne().HasForeignKey<Deal>(x => x.AcceptedBidId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Organization>().WithMany().HasForeignKey(x => x.ShipperOrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Organization>().WithMany().HasForeignKey(x => x.CarrierOrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => x.Status);
    }
}
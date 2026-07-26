using LogisticsMarketplace.Service.Domain.Aggregates.BidAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.ListingAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class BidConfiguration : IEntityTypeConfiguration<Bid>
{
    public void Configure(EntityTypeBuilder<Bid> builder)
    {
        builder.ToTable("Bids");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Message).HasMaxLength(1000);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.OwnsOne(x => x.ProposedPrice, price =>
        {
            price.Property(x => x.Amount).HasColumnName("ProposedPriceAmount").HasPrecision(18, 2).IsRequired();
            price.Property(x => x.Currency).HasColumnName("ProposedPriceCurrency").HasMaxLength(3).IsRequired();
        });
        builder.HasOne<Listing>().WithMany().HasForeignKey(x => x.ListingId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<Organization>().WithMany().HasForeignKey(x => x.CarrierOrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => new { x.ListingId, x.CarrierOrgId });
        builder.HasIndex(x => x.Status);
    }
}
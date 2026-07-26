using LogisticsMarketplace.Service.Domain.Aggregates.DealAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.DispatchAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.FleetAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogisticsMarketplace.Service.Infrastructure.Data.EntityConfigurations;

public sealed class DispatchConfiguration : IEntityTypeConfiguration<Dispatch>
{
    public void Configure(EntityTypeBuilder<Dispatch> builder)
    {
        builder.ToTable("Dispatches");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(x => x.Notes).HasMaxLength(2000);
        builder.HasOne<Deal>().WithOne().HasForeignKey<Dispatch>(x => x.DealId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Vehicle>().WithMany().HasForeignKey(x => x.VehicleId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Driver>().WithMany().HasForeignKey(x => x.DriverId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => x.DealId).IsUnique();
        builder.HasIndex(x => new { x.CarrierOrgId, x.Status });
    }
}
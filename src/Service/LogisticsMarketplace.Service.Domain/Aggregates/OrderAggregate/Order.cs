using LogisticsMarketplace.Service.Domain.Common;

namespace LogisticsMarketplace.Service.Domain.Aggregates.OrderAggregate;

public sealed class Order : Entity<Guid>
{
    public Guid DealId { get; private set; }
    public string OrderNumber { get; private set; } = string.Empty;
    public string? CustomerReference { get; private set; }
    public string? SpecialInstructions { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Order() { }

    public Order(Guid dealId, string orderNumber, string? customerReference = null, string? specialInstructions = null)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
            throw new ArgumentException("Order number is required.", nameof(orderNumber));
        Id = Guid.NewGuid();
        DealId = dealId;
        OrderNumber = orderNumber.Trim();
        CustomerReference = string.IsNullOrWhiteSpace(customerReference) ? null : customerReference.Trim();
        SpecialInstructions = string.IsNullOrWhiteSpace(specialInstructions) ? null : specialInstructions.Trim();
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateInstructions(string? instructions) =>
        SpecialInstructions = string.IsNullOrWhiteSpace(instructions) ? null : instructions.Trim();
}
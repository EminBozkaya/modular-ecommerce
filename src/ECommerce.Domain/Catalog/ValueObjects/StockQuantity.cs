namespace ECommerce.Domain.Catalog.ValueObjects;

public record StockQuantity
{
    public decimal Value { get; }

    public StockQuantity(decimal value)
    {
        if (value < 0) throw new ArgumentException("Stock cannot be negative.", nameof(value));
        Value = value;
    }

    public bool IsAvailable => Value > 0;

    public StockQuantity Decrease(decimal amount)
    {
        if (amount > Value) throw new InvalidOperationException("Insufficient stock.");
        return new StockQuantity(Value - amount);
    }

    public StockQuantity Increase(decimal amount) => new(Value + amount);
}

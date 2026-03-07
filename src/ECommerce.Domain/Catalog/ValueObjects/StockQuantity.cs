namespace ECommerce.Domain.Catalog.ValueObjects;

public record StockQuantity
{
    public int Value { get; }

    public StockQuantity(int value)
    {
        if (value < 0) throw new ArgumentException("Stock cannot be negative.", nameof(value));
        Value = value;
    }

    public bool IsAvailable => Value > 0;

    public StockQuantity Decrease(int amount)
    {
        if (amount > Value) throw new InvalidOperationException("Insufficient stock.");
        return new StockQuantity(Value - amount);
    }

    public StockQuantity Increase(int amount) => new(Value + amount);
}

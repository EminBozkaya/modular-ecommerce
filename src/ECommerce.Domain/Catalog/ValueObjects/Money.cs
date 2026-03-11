using ECommerce.Domain.Common.Enums;

namespace ECommerce.Domain.Catalog.ValueObjects;

public record Money
{
    public decimal Amount { get; init; }
    public Currency Currency { get; init; }

    public Money(decimal amount, Currency currency = Currency.TRY)
    {
        if (amount < 0) throw new ArgumentException("Amount cannot be negative.", nameof(amount));
        Amount = amount;
        Currency = currency;
    }

    /// <summary>
    /// Provider'lara göndermek için minor unit dönüşümü.
    /// Stripe: 10.99 USD → 1099, 500 JPY → 500
    /// </summary>
    public long ToMinorUnits() => Currency switch
    {
        Currency.JPY => (long)Amount,
        _ => (long)(Amount * 100)
    };

    /// <summary>
    /// Provider'dan gelen minor unit değerini Money'e çevirir.
    /// </summary>
    public static Money FromMinorUnits(long minorUnits, Currency currency) => currency switch
    {
        Currency.JPY => new Money(minorUnits, currency),
        _ => new Money(minorUnits / 100m, currency)
    };

    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add different currencies.");
        return new Money(Amount + other.Amount, Currency);
    }

    public Money Multiply(int quantity) => new(Amount * quantity, Currency);
    public Money Multiply(decimal quantity) => new(Amount * quantity, Currency);

    public override string ToString() => $"{Amount:F2} {Currency}";
}

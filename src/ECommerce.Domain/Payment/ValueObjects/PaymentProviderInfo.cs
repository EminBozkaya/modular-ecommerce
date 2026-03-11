namespace ECommerce.Domain.Payment.ValueObjects;

public record PaymentProviderInfo(
    string ProviderName,
    string DisplayName,
    string LogoUrl,
    IReadOnlyList<string> SupportedCurrencies
);

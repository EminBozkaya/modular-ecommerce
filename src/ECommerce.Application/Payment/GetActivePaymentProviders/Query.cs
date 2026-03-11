using MediatR;

namespace ECommerce.Application.Payment.GetActivePaymentProviders;

public record GetActivePaymentProvidersQuery : IRequest<List<PaymentProviderDto>>;

/// <summary>Application-layer DTO — keeps controllers free from Domain type dependencies.</summary>
public record PaymentProviderDto(
    string ProviderName,
    string DisplayName,
    string LogoUrl,
    IReadOnlyList<string> SupportedCurrencies
);

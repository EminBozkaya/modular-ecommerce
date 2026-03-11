using ECommerce.Domain.Payment;
using MediatR;

namespace ECommerce.Application.Payment.GetActivePaymentProviders;

public class GetActivePaymentProvidersHandler
    : IRequestHandler<GetActivePaymentProvidersQuery, List<PaymentProviderDto>>
{
    private readonly IEnumerable<IPaymentProvider> _providers;

    public GetActivePaymentProvidersHandler(IEnumerable<IPaymentProvider> providers)
    {
        _providers = providers;
    }

    public Task<List<PaymentProviderDto>> Handle(
        GetActivePaymentProvidersQuery query, CancellationToken ct)
    {
        var result = _providers
            .Where(p => p.IsActive)
            .Select(p => new PaymentProviderDto(
                p.ProviderName,
                p.DisplayName,
                p.LogoUrl,
                p.SupportedCurrencies.Select(c => c.ToString()).ToList()))
            .ToList();

        return Task.FromResult(result);
    }
}

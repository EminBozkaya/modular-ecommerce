using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Payment.Providers;

/// <summary>
/// Development ve test ortamında kullanılan sahte ödeme sağlayıcısı.
/// IdempotencyKey "fail" ile bitiyorsa → başarısız simülasyonu.
/// </summary>
public sealed class StubPaymentProvider : IPaymentProvider
{
    private readonly IConfiguration _config;
    private readonly ILogger<StubPaymentProvider> _logger;

    private static readonly IReadOnlySet<Currency> _supportedCurrencies =
        new HashSet<Currency>((Currency[])Enum.GetValues(typeof(Currency)));

    public StubPaymentProvider(IConfiguration config, ILogger<StubPaymentProvider> logger)
    {
        _config = config;
        _logger = logger;
    }

    public string ProviderName => "Stub";
    public string DisplayName => "Test Ödemesi";
    public string LogoUrl => "/images/providers/stub.svg";
    public bool IsActive => _config.GetValue<bool>("Payment:Stub:IsActive");
    public IReadOnlySet<Currency> SupportedCurrencies => _supportedCurrencies;

    public async Task<PaymentInitResult> InitializePaymentAsync(
        PaymentInitRequest request, CancellationToken ct = default)
    {
        // Yapay gecikme: 300-600ms
        var delay = Random.Shared.Next(300, 601);
        await Task.Delay(delay, ct);

        var shouldFail = request.IdempotencyKey.EndsWith("fail", StringComparison.OrdinalIgnoreCase);

        if (shouldFail)
        {
            _logger.LogInformation("Stub payment FAILED (IdempotencyKey ends with 'fail'). OrderId={OrderId}", request.OrderId);
            return new PaymentInitResult(
                IsSuccess: false,
                RedirectUrl: null,
                ProviderReference: null,
                ErrorCode: "stub_fail",
                ErrorMessage: "Stub: simulated failure");
        }

        var providerReference = $"stub-ref-{Guid.NewGuid():N}";
        // Return URL redirect simülasyonu (gerçek 3D Secure sayfası yok)
        var redirectUrl = $"{request.ReturnUrl}?orderId={request.OrderId}&providerRef={providerReference}";

        _logger.LogInformation("Stub payment initialized. OrderId={OrderId}, ProviderRef={Ref}", request.OrderId, providerReference);

        return new PaymentInitResult(
            IsSuccess: true,
            RedirectUrl: redirectUrl,
            ProviderReference: providerReference,
            ErrorCode: null,
            ErrorMessage: null);
    }

    public async Task<PaymentVerifyResult> VerifyPaymentAsync(
        PaymentVerifyRequest request, CancellationToken ct = default)
    {
        await Task.Delay(100, ct);

        var shouldFail = request.ProviderReference?.Contains("fail", StringComparison.OrdinalIgnoreCase) == true;

        if (shouldFail)
        {
            return new PaymentVerifyResult(
                IsSuccess: false,
                TransactionId: null,
                VerifiedAmount: null,
                ErrorCode: "stub_verify_fail",
                ErrorMessage: "Stub: simulated verify failure",
                ResultStatus: PaymentStatus.Failed);
        }

        var transactionId = $"stub-tx-{Guid.NewGuid():N}";

        return new PaymentVerifyResult(
            IsSuccess: true,
            TransactionId: transactionId,
            VerifiedAmount: null, // Stub does not echo back amount — handler must use PaymentRecord amount
            ErrorCode: null,
            ErrorMessage: null,
            ResultStatus: PaymentStatus.Completed);
    }

    public async Task<RefundResult> RefundAsync(RefundRequest request, CancellationToken ct = default)
    {
        await Task.Delay(200, ct);

        var refundId = $"stub-refund-{Guid.NewGuid():N}";
        return new RefundResult(IsSuccess: true, RefundId: refundId, ErrorCode: null, ErrorMessage: null);
    }
}

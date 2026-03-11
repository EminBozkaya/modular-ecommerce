using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Payment;

/// <summary>
/// Uygulama başlarken aktif provider'ların konfigürasyonunu doğrular.
/// Eksik config → uyarı + provider devre dışı bırakma (runtime hata vermek yerine).
/// </summary>
public sealed class PaymentStartupValidator : IHostedService
{
    private readonly IConfiguration _config;
    private readonly ILogger<PaymentStartupValidator> _logger;

    private static readonly Dictionary<string, string[]> RequiredKeys = new()
    {
        ["Iyzico"] = ["Payment:Iyzico:ApiKey", "Payment:Iyzico:SecretKey", "Payment:Iyzico:BaseUrl"],
        ["Stripe"] = ["Payment:Stripe:SecretKey", "Payment:Stripe:WebhookSecret"],
        ["PayTR"] = ["Payment:PayTR:MerchantId", "Payment:PayTR:MerchantKey", "Payment:PayTR:MerchantSalt"],
        ["PayPal"] = ["Payment:PayPal:ClientId", "Payment:PayPal:ClientSecret", "Payment:PayPal:BaseUrl"]
    };

    public PaymentStartupValidator(IConfiguration config, ILogger<PaymentStartupValidator> logger)
    {
        _config = config;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        var anyActive = false;

        foreach (var (provider, keys) in RequiredKeys)
        {
            var isActive = _config.GetValue<bool>($"Payment:{provider}:IsActive");
            if (!isActive) continue;

            anyActive = true;
            var missing = keys.Where(k => string.IsNullOrWhiteSpace(_config[k])).ToList();

            if (missing.Count > 0)
            {
                _logger.LogWarning(
                    "Payment provider '{Provider}' is active but missing required configuration: {Keys}. " +
                    "Provider will be unavailable at runtime.",
                    provider, string.Join(", ", missing));
            }
            else
            {
                _logger.LogInformation("Payment provider '{Provider}' configured successfully.", provider);
            }
        }

        var stubActive = _config.GetValue<bool>("Payment:Stub:IsActive");
        if (stubActive)
        {
            anyActive = true;
            _logger.LogInformation("Payment provider 'Stub' is active (development mode).");
        }

        if (!anyActive)
        {
            _logger.LogError("No active payment providers configured. Checkout will not function.");
        }

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

using ECommerce.Domain.Payment;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Payment;

/// <summary>
/// Her 5 dakikada bir Processing durumunda kalan ve süresi dolmuş ödemeleri
/// Expired olarak işaretler. İlgili Order'ı da Pending'e geri alır.
/// </summary>
public sealed class PaymentExpirationJob : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PaymentExpirationJob> _logger;
    private static readonly TimeSpan Interval = TimeSpan.FromMinutes(5);

    public PaymentExpirationJob(IServiceScopeFactory scopeFactory, ILogger<PaymentExpirationJob> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(Interval, stoppingToken);
            await ExpirePaymentsAsync(stoppingToken);
        }
    }

    private async Task ExpirePaymentsAsync(CancellationToken ct)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var paymentRepo = scope.ServiceProvider.GetRequiredService<IPaymentRepository>();

            var expiredPayments = await paymentRepo.GetProcessingExpiredAsync(ct);
            if (expiredPayments.Count == 0) return;

            _logger.LogInformation("PaymentExpirationJob: found {Count} expired payments to process.", expiredPayments.Count);

            foreach (var payment in expiredPayments)
            {
                try
                {
                    payment.MarkExpired();

                    // Log — order stays Pending (no state change needed; new payment can be started)

                    _logger.LogInformation(
                        "Payment expired. OrderId={OrderId}, Provider={Provider}, ExpiresAt={ExpiresAt}",
                        payment.OrderId, payment.ProviderName, payment.ExpiresAt);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to expire payment {PaymentId}", payment.Id);
                }
            }

            await paymentRepo.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PaymentExpirationJob encountered an error.");
        }
    }
}

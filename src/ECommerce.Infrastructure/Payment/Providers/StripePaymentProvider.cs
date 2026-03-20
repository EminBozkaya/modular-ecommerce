using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using ECommerce.Domain.Catalog.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ECommerce.Infrastructure.Payment.Providers;

/// <summary>
/// Stripe ödeme sağlayıcısı — Checkout Session (3D Secure otomatik).
/// Stripe-Signature header ile webhook imza doğrulaması.
/// Note: Stripe.net NuGet paketi eklenmediğinden HttpClient ile REST implementasyonu.
/// </summary>
public sealed class StripePaymentProvider : IPaymentProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<StripePaymentProvider> _logger;

    private static readonly IReadOnlySet<Currency> _supportedCurrencies =
        new HashSet<Currency> { Currency.USD, Currency.EUR, Currency.GBP, Currency.TRY, Currency.JPY };

    public StripePaymentProvider(
        IConfiguration config,
        IHttpClientFactory httpClientFactory,
        ILogger<StripePaymentProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "Stripe";
    public string DisplayName => "Stripe (Uluslararası Kart)";
    public string LogoUrl => "/images/providers/stripe.svg";
    public bool IsActive => _config.GetValue<bool>("Payment:Stripe:IsActive");
    public IReadOnlySet<Currency> SupportedCurrencies => _supportedCurrencies;

    public async Task<PaymentInitResult> InitializePaymentAsync(
        PaymentInitRequest request, CancellationToken ct = default)
    {
        try
        {
            var secretKey = _config["Payment:Stripe:SecretKey"]!;

            // Stripe Checkout Session — form-encoded, not JSON
            var formParams = new List<KeyValuePair<string, string>>
            {
                new("mode", "payment"),
                new("success_url", request.ReturnUrl + (request.ReturnUrl.Contains('?') ? "&" : "?") + $"orderId={request.OrderId}&session_id={{CHECKOUT_SESSION_ID}}"),
                new("cancel_url", request.ReturnUrl + (request.ReturnUrl.Contains('?') ? "&" : "?") + $"orderId={request.OrderId}&status=cancelled"),
                new("customer_email", request.CustomerEmail),
                new("payment_intent_data[metadata][order_id]", request.OrderId),
                new("payment_intent_data[metadata][idempotency_key]", request.IdempotencyKey),
                new("metadata[order_id]", request.OrderId)
            };

            // Line items
            for (var i = 0; i < request.Items.Count; i++)
            {
                var item = request.Items[i];
                formParams.Add(new($"line_items[{i}][price_data][currency]", request.Amount.Currency.ToString().ToLower()));
                formParams.Add(new($"line_items[{i}][price_data][unit_amount]", ((long)(item.Price * 100)).ToString()));
                formParams.Add(new($"line_items[{i}][price_data][product_data][name]", item.Name));
                formParams.Add(new($"line_items[{i}][quantity]", item.Quantity.ToString()));
            }

            var client = CreateStripeClient(secretKey);
            var response = await client.PostAsync("https://api.stripe.com/v1/checkout/sessions",
                new FormUrlEncodedContent(formParams), ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            if (root.TryGetProperty("error", out _))
            {
                var errMsg = root.GetProperty("error").TryGetProperty("message", out var msgEl) ? msgEl.GetString() : "Stripe error";
                return new PaymentInitResult(false, null, null, "stripe_error", errMsg);
            }

            var sessionId = root.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
            var redirectUrl = root.TryGetProperty("url", out var urlEl) ? urlEl.GetString() : null;

            return new PaymentInitResult(true, redirectUrl, sessionId, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Stripe InitializePayment failed. OrderId={OrderId}", request.OrderId);
            return new PaymentInitResult(false, null, null, "stripe_error", ex.Message);
        }
    }

    public Task<PaymentVerifyResult> VerifyPaymentAsync(
        PaymentVerifyRequest request, CancellationToken ct = default)
    {
        try
        {
            var webhookSecret = _config["Payment:Stripe:WebhookSecret"]!;

            // Stripe-Signature header: t=timestamp,v1=signature,...
            if (!request.Headers.TryGetValue("Stripe-Signature", out var signatureHeader))
            {
                _logger.LogWarning("Stripe webhook: missing Stripe-Signature header. OrderId={OrderId}", request.OrderId);
                return Task.FromResult(new PaymentVerifyResult(
                    false, null, null, "invalid_signature", "Missing Stripe-Signature", PaymentStatus.Failed));
            }

            if (!VerifyStripeSignature(request.RawPayload, signatureHeader, webhookSecret))
            {
                _logger.LogWarning("Stripe webhook: invalid signature. OrderId={OrderId}", request.OrderId);
                return Task.FromResult(new PaymentVerifyResult(
                    false, null, null, "invalid_signature", "Stripe signature verification failed", PaymentStatus.Failed));
            }

            using var doc = JsonDocument.Parse(request.RawPayload);
            var root = doc.RootElement;

            var eventType = root.TryGetProperty("type", out var typeEl) ? typeEl.GetString() : null;

            if (eventType == "checkout.session.completed" || eventType == "payment_intent.succeeded")
            {
                var dataObj = root.GetProperty("data").GetProperty("object");
                var txId = dataObj.TryGetProperty("payment_intent", out var piEl) ? piEl.GetString()
                    : dataObj.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;

                long? amountReceived = null;
                string? currencyStr = null;

                if (dataObj.TryGetProperty("amount_total", out var amtEl))
                    amountReceived = amtEl.GetInt64();
                else if (dataObj.TryGetProperty("amount_received", out var amtRecEl))
                    amountReceived = amtRecEl.GetInt64();

                if (dataObj.TryGetProperty("currency", out var currEl))
                    currencyStr = currEl.GetString();

                Money? verifiedAmount = null;
                if (amountReceived.HasValue && currencyStr is not null &&
                    Enum.TryParse<Currency>(currencyStr.ToUpperInvariant(), out var currency))
                {
                    verifiedAmount = Money.FromMinorUnits(amountReceived.Value, currency);
                }

                return Task.FromResult(new PaymentVerifyResult(
                    true, txId, verifiedAmount, null, null, PaymentStatus.Completed));
            }

            if (eventType == "payment_intent.payment_failed" || eventType == "checkout.session.expired")
            {
                return Task.FromResult(new PaymentVerifyResult(
                    false, null, null, "payment_failed", $"Stripe event: {eventType}", PaymentStatus.Failed));
            }

            // Other events — ignore
            return Task.FromResult(new PaymentVerifyResult(
                true, null, null, null, null, PaymentStatus.Pending));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Stripe VerifyPayment failed. OrderId={OrderId}", request.OrderId);
            return Task.FromResult(new PaymentVerifyResult(
                false, null, null, "stripe_error", ex.Message, PaymentStatus.Failed));
        }
    }

    public async Task<RefundResult> RefundAsync(RefundRequest request, CancellationToken ct = default)
    {
        try
        {
            var secretKey = _config["Payment:Stripe:SecretKey"]!;

            var formParams = new List<KeyValuePair<string, string>>
            {
                new("payment_intent", request.TransactionId)
            };

            if (request.Amount is not null)
                formParams.Add(new("amount", request.Amount.ToMinorUnits().ToString()));

            var client = CreateStripeClient(secretKey);
            var response = await client.PostAsync("https://api.stripe.com/v1/refunds",
                new FormUrlEncodedContent(formParams), ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            if (root.TryGetProperty("error", out _))
            {
                var errMsg = root.GetProperty("error").TryGetProperty("message", out var msgEl) ? msgEl.GetString() : "Refund error";
                return new RefundResult(false, null, "stripe_refund_failed", errMsg);
            }

            var refundId = root.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
            return new RefundResult(true, refundId, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Stripe Refund failed. OrderId={OrderId}", request.OrderId);
            return new RefundResult(false, null, "stripe_error", ex.Message);
        }
    }

    private static HttpClient CreateStripeClient(string secretKey)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {secretKey}");
        client.Timeout = TimeSpan.FromSeconds(30);
        return client;
    }

    private static bool VerifyStripeSignature(string payload, string signatureHeader, string secret)
    {
        try
        {
            // Parse t= and v1= from header
            var parts = signatureHeader.Split(',');
            var timestamp = parts.FirstOrDefault(p => p.StartsWith("t="))?.Substring(2);
            var signature = parts.FirstOrDefault(p => p.StartsWith("v1="))?.Substring(3);

            if (timestamp is null || signature is null) return false;

            var signedPayload = $"{timestamp}.{payload}";
            var expectedHash = Convert.ToHexString(
                HMACSHA256.HashData(
                    Encoding.UTF8.GetBytes(secret),
                    Encoding.UTF8.GetBytes(signedPayload))).ToLower();

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(expectedHash),
                Encoding.UTF8.GetBytes(signature));
        }
        catch
        {
            return false;
        }
    }
}

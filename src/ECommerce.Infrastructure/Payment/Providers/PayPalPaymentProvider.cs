using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace ECommerce.Infrastructure.Payment.Providers;

/// <summary>
/// PayPal ödeme sağlayıcısı — REST API v2, Orders.
/// OAuth2 access token ile kimlik doğrulama.
/// </summary>
public sealed class PayPalPaymentProvider : IPaymentProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<PayPalPaymentProvider> _logger;

    private static readonly IReadOnlySet<Currency> _supportedCurrencies =
        new HashSet<Currency> { Currency.USD, Currency.EUR, Currency.GBP };

    public PayPalPaymentProvider(
        IConfiguration config,
        IHttpClientFactory httpClientFactory,
        ILogger<PayPalPaymentProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "PayPal";
    public string DisplayName => "PayPal ile Öde";
    public string LogoUrl => "/images/providers/paypal.svg";
    public bool IsActive => _config.GetValue<bool>("Payment:PayPal:IsActive");
    public IReadOnlySet<Currency> SupportedCurrencies => _supportedCurrencies;

    public async Task<PaymentInitResult> InitializePaymentAsync(
        PaymentInitRequest request, CancellationToken ct = default)
    {
        try
        {
            var baseUrl = _config["Payment:PayPal:BaseUrl"]!;
            var accessToken = await GetAccessTokenAsync(baseUrl, ct);

            var orderBody = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
                        reference_id = request.OrderId,
                        custom_id = request.IdempotencyKey,
                        amount = new
                        {
                            currency_code = request.Amount.Currency.ToString(),
                            value = request.Amount.Amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)
                        },
                        items = request.Items.Select(i => new
                        {
                            name = i.Name.Length > 127 ? i.Name[..127] : i.Name,
                            quantity = i.Quantity.ToString(),
                            unit_amount = new
                            {
                                currency_code = request.Amount.Currency.ToString(),
                                value = i.Price.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)
                            }
                        }).ToList()
                    }
                },
                application_context = new
                {
                    return_url = $"{request.ReturnUrl}?orderId={request.OrderId}",
                    cancel_url = $"{request.ReturnUrl}?orderId={request.OrderId}&status=cancelled",
                    brand_name = "ECommerce",
                    user_action = "PAY_NOW"
                }
            };

            var client = CreatePayPalClient(baseUrl, accessToken);
            var response = await client.PostAsJsonAsync($"{baseUrl}/v2/checkout/orders", orderBody, ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : null;
            if (status == "CREATED")
            {
                var paypalOrderId = root.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
                var approveUrl = root.GetProperty("links").EnumerateArray()
                    .FirstOrDefault(l => l.TryGetProperty("rel", out var relEl) && relEl.GetString() == "approve")
                    .TryGetProperty("href", out var hrefEl) ? hrefEl.GetString() : null;

                return new PaymentInitResult(true, approveUrl, paypalOrderId, null, null);
            }

            return new PaymentInitResult(false, null, null, "paypal_error", $"Unexpected status: {status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayPal InitializePayment failed. OrderId={OrderId}", request.OrderId);
            return new PaymentInitResult(false, null, null, "paypal_error", ex.Message);
        }
    }

    public async Task<PaymentVerifyResult> VerifyPaymentAsync(
        PaymentVerifyRequest request, CancellationToken ct = default)
    {
        try
        {
            var baseUrl = _config["Payment:PayPal:BaseUrl"]!;
            var accessToken = await GetAccessTokenAsync(baseUrl, ct);

            // PayPal webhook event — verify and capture
            using var doc = JsonDocument.Parse(request.RawPayload);
            var root = doc.RootElement;

            var eventType = root.TryGetProperty("event_type", out var typeEl) ? typeEl.GetString() : null;

            if (eventType == "CHECKOUT.ORDER.APPROVED")
            {
                var paypalOrderId = root.GetProperty("resource").TryGetProperty("id", out var idEl) ? idEl.GetString() : null;

                // Capture the order
                var client = CreatePayPalClient(baseUrl, accessToken);
                var captureResponse = await client.PostAsync(
                    $"{baseUrl}/v2/checkout/orders/{paypalOrderId}/capture",
                    new StringContent("{}", Encoding.UTF8, "application/json"), ct);
                var captureContent = await captureResponse.Content.ReadAsStringAsync(ct);

                using var captureDoc = JsonDocument.Parse(captureContent);
                var captureRoot = captureDoc.RootElement;

                var captureStatus = captureRoot.TryGetProperty("status", out var csEl) ? csEl.GetString() : null;
                if (captureStatus == "COMPLETED")
                {
                    var captureId = captureRoot.GetProperty("purchase_units").EnumerateArray()
                        .FirstOrDefault()
                        .GetProperty("payments")
                        .GetProperty("captures")
                        .EnumerateArray()
                        .FirstOrDefault()
                        .TryGetProperty("id", out var cIdEl) ? cIdEl.GetString() : paypalOrderId;

                    return new PaymentVerifyResult(true, captureId, null, null, null, PaymentStatus.Completed);
                }

                return new PaymentVerifyResult(false, null, null, "paypal_capture_failed", $"Capture status: {captureStatus}", PaymentStatus.Failed);
            }

            if (eventType == "PAYMENT.CAPTURE.DENIED" || eventType == "PAYMENT.CAPTURE.REVERSED")
            {
                return new PaymentVerifyResult(false, null, null, "payment_failed", $"PayPal event: {eventType}", PaymentStatus.Failed);
            }

            // Other events — ignore
            return new PaymentVerifyResult(true, null, null, null, null, PaymentStatus.Pending);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayPal VerifyPayment failed. OrderId={OrderId}", request.OrderId);
            return new PaymentVerifyResult(false, null, null, "paypal_error", ex.Message, PaymentStatus.Failed);
        }
    }

    public async Task<RefundResult> RefundAsync(RefundRequest request, CancellationToken ct = default)
    {
        try
        {
            var baseUrl = _config["Payment:PayPal:BaseUrl"]!;
            var accessToken = await GetAccessTokenAsync(baseUrl, ct);

            object refundBody;
            if (request.Amount is not null)
            {
                refundBody = new
                {
                    amount = new
                    {
                        currency_code = request.Amount.Currency.ToString(),
                        value = request.Amount.Amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)
                    }
                };
            }
            else
            {
                refundBody = new { };
            }

            var client = CreatePayPalClient(baseUrl, accessToken);
            var response = await client.PostAsJsonAsync(
                $"{baseUrl}/v2/payments/captures/{request.TransactionId}/refund", refundBody, ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : null;
            if (status == "COMPLETED")
            {
                var refundId = root.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
                return new RefundResult(true, refundId, null, null);
            }

            return new RefundResult(false, null, "paypal_refund_failed", $"Status: {status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayPal Refund failed. OrderId={OrderId}", request.OrderId);
            return new RefundResult(false, null, "paypal_error", ex.Message);
        }
    }

    private async Task<string> GetAccessTokenAsync(string baseUrl, CancellationToken ct)
    {
        var clientId = _config["Payment:PayPal:ClientId"]!;
        var clientSecret = _config["Payment:PayPal:ClientSecret"]!;

        var client = _httpClientFactory.CreateClient("PayPal");
        var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);

        var response = await client.PostAsync(
            $"{baseUrl}/v1/oauth2/token",
            new FormUrlEncodedContent([new("grant_type", "client_credentials")]),
            ct);
        var content = await response.Content.ReadAsStringAsync(ct);

        using var doc = JsonDocument.Parse(content);
        return doc.RootElement.GetProperty("access_token").GetString()
               ?? throw new InvalidOperationException("PayPal: could not get access token");
    }

    private static HttpClient CreatePayPalClient(string baseUrl, string accessToken)
    {
        var client = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return client;
    }
}

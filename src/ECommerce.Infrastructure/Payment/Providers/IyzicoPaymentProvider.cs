using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ECommerce.Infrastructure.Payment.Providers;

/// <summary>
/// Iyzico ödeme sağlayıcısı — Checkout Form (3D Secure dahil).
/// NuGet: iyzipay (henüz eklenmedi — HttpClient ile REST implementasyonu).
/// </summary>
public sealed class IyzicoPaymentProvider : IPaymentProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<IyzicoPaymentProvider> _logger;

    private static readonly IReadOnlySet<Currency> _supportedCurrencies =
        new HashSet<Currency> { Currency.TRY, Currency.USD, Currency.EUR, Currency.GBP };

    public IyzicoPaymentProvider(
        IConfiguration config,
        IHttpClientFactory httpClientFactory,
        ILogger<IyzicoPaymentProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "Iyzico";
    public string DisplayName => "Kredi/Banka Kartı";
    public string LogoUrl => "/images/providers/iyzico.svg";
    public bool IsActive => _config.GetValue<bool>("Payment:Iyzico:IsActive");
    public IReadOnlySet<Currency> SupportedCurrencies => _supportedCurrencies;

    public async Task<PaymentInitResult> InitializePaymentAsync(
        PaymentInitRequest request, CancellationToken ct = default)
    {
        try
        {
            var apiKey = _config["Payment:Iyzico:ApiKey"]!;
            var secretKey = _config["Payment:Iyzico:SecretKey"]!;
            var baseUrl = _config["Payment:Iyzico:BaseUrl"]!;

            var conversationId = request.IdempotencyKey;
            var priceMajor = request.Amount.Amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture);
            var currencyCode = request.Amount.Currency.ToString();

            var body = new
            {
                locale = "tr",
                conversationId,
                price = priceMajor,
                paidPrice = priceMajor,
                currency = currencyCode,
                basketId = request.OrderId,
                paymentGroup = "PRODUCT",
                callbackUrl = request.ReturnUrl + $"?orderId={request.OrderId}",
                enabledInstallments = new[] { 1, 2, 3, 6, 9 },
                buyer = new
                {
                    id = request.UserId,
                    name = request.CustomerName.Split(' ').FirstOrDefault() ?? "Customer",
                    surname = string.Join(' ', request.CustomerName.Split(' ').Skip(1)),
                    identityNumber = "00000000000",
                    email = request.CustomerEmail,
                    registrationAddress = "N/A",
                    ip = request.CustomerIp,
                    city = "Istanbul",
                    country = "Turkey"
                },
                shippingAddress = new { contactName = request.CustomerName, city = "Istanbul", country = "Turkey", address = "N/A" },
                billingAddress = new { contactName = request.CustomerName, city = "Istanbul", country = "Turkey", address = "N/A" },
                basketItems = request.Items.Select((item, i) => new
                {
                    id = $"BI{i + 1}",
                    name = item.Name,
                    category1 = item.Category,
                    itemType = "PHYSICAL",
                    price = (item.Price * item.Quantity).ToString("F2", System.Globalization.CultureInfo.InvariantCulture)
                }).ToList()
            };

            var authHeader = GenerateIyzicoAuthHeader(apiKey, secretKey, JsonSerializer.Serialize(body));
            var client = _httpClientFactory.CreateClient("Iyzico");
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var response = await client.PostAsJsonAsync("/payment/iyzipos/checkoutform/initialize/auth/ecommerce", body, ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : null;
            if (status == "success")
            {
                var token = root.TryGetProperty("token", out var tokenEl) ? tokenEl.GetString() : null;
                var checkoutFormContent = root.TryGetProperty("checkoutFormContent", out var formEl) ? formEl.GetString() : null;

                return new PaymentInitResult(
                    IsSuccess: true,
                    RedirectUrl: null, // Iyzico returns embedded form, not redirect URL
                    ProviderReference: token,
                    ErrorCode: null,
                    ErrorMessage: checkoutFormContent);
            }

            var errorMessage = root.TryGetProperty("errorMessage", out var errEl) ? errEl.GetString() : "Unknown error";
            var errorCode = root.TryGetProperty("errorCode", out var codeEl) ? codeEl.GetString() : null;

            return new PaymentInitResult(false, null, null, errorCode, errorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Iyzico InitializePayment failed. OrderId={OrderId}", request.OrderId);
            return new PaymentInitResult(false, null, null, "iyzico_error", ex.Message);
        }
    }

    public async Task<PaymentVerifyResult> VerifyPaymentAsync(
        PaymentVerifyRequest request, CancellationToken ct = default)
    {
        try
        {
            var apiKey = _config["Payment:Iyzico:ApiKey"]!;
            var secretKey = _config["Payment:Iyzico:SecretKey"]!;
            var baseUrl = _config["Payment:Iyzico:BaseUrl"]!;

            var body = new { locale = "tr", conversationId = request.OrderId, token = request.ProviderReference };
            var authHeader = GenerateIyzicoAuthHeader(apiKey, secretKey, JsonSerializer.Serialize(body));

            var client = _httpClientFactory.CreateClient("Iyzico");
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var response = await client.PostAsJsonAsync("/payment/iyzipos/checkoutform/auth/ecommerce/detail", body, ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("paymentStatus", out var statusEl) ? statusEl.GetString() : null;

            if (status == "SUCCESS")
            {
                var txId = root.TryGetProperty("paymentId", out var txEl) ? txEl.GetString() : null;
                return new PaymentVerifyResult(
                    IsSuccess: true,
                    TransactionId: txId,
                    VerifiedAmount: null,
                    ErrorCode: null,
                    ErrorMessage: null,
                    ResultStatus: PaymentStatus.Completed);
            }

            var errorMessage = root.TryGetProperty("errorMessage", out var errEl) ? errEl.GetString() : "Payment failed";
            return new PaymentVerifyResult(false, null, null, "iyzico_verify_failed", errorMessage, PaymentStatus.Failed);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Iyzico VerifyPayment failed. OrderId={OrderId}", request.OrderId);
            return new PaymentVerifyResult(false, null, null, "iyzico_error", ex.Message, PaymentStatus.Failed);
        }
    }

    public async Task<RefundResult> RefundAsync(RefundRequest request, CancellationToken ct = default)
    {
        try
        {
            var apiKey = _config["Payment:Iyzico:ApiKey"]!;
            var secretKey = _config["Payment:Iyzico:SecretKey"]!;
            var baseUrl = _config["Payment:Iyzico:BaseUrl"]!;

            var body = new
            {
                locale = "tr",
                conversationId = $"refund-{request.OrderId}",
                paymentTransactionId = request.TransactionId,
                price = request.Amount?.Amount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture),
                currency = request.Amount?.Currency.ToString() ?? "TRY",
                ip = "127.0.0.1"
            };

            var authHeader = GenerateIyzicoAuthHeader(apiKey, secretKey, JsonSerializer.Serialize(body));
            var client = _httpClientFactory.CreateClient("Iyzico");
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var response = await client.PostAsJsonAsync("/payment/refund", body, ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : null;
            if (status == "success")
            {
                var refundId = root.TryGetProperty("paymentId", out var rEl) ? rEl.GetString() : null;
                return new RefundResult(true, refundId, null, null);
            }

            var err = root.TryGetProperty("errorMessage", out var errEl) ? errEl.GetString() : "Refund failed";
            return new RefundResult(false, null, "iyzico_refund_failed", err);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Iyzico Refund failed. OrderId={OrderId}", request.OrderId);
            return new RefundResult(false, null, "iyzico_error", ex.Message);
        }
    }

    private static string GenerateIyzicoAuthHeader(string apiKey, string secretKey, string requestBody)
    {
        var randomString = Guid.NewGuid().ToString("N");
        var dataToSign = apiKey + randomString + secretKey + requestBody;
        var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(dataToSign)));
        return $"IYZWS {apiKey}:{randomString}:{hash}";
    }
}

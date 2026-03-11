using ECommerce.Domain.Common.Enums;
using ECommerce.Domain.Payment;
using ECommerce.Domain.Payment.Enums;
using ECommerce.Domain.Payment.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ECommerce.Infrastructure.Payment.Providers;

/// <summary>
/// PayTR ödeme sağlayıcısı — iFrame token ile 3D Secure.
/// HMAC-SHA256 ile imza doğrulaması.
/// </summary>
public sealed class PayTRPaymentProvider : IPaymentProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<PayTRPaymentProvider> _logger;

    private static readonly IReadOnlySet<Currency> _supportedCurrencies =
        new HashSet<Currency> { Currency.TRY };

    public PayTRPaymentProvider(
        IConfiguration config,
        IHttpClientFactory httpClientFactory,
        ILogger<PayTRPaymentProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "PayTR";
    public string DisplayName => "PayTR ile Öde";
    public string LogoUrl => "/images/providers/paytr.svg";
    public bool IsActive => _config.GetValue<bool>("Payment:PayTR:IsActive");
    public IReadOnlySet<Currency> SupportedCurrencies => _supportedCurrencies;

    public async Task<PaymentInitResult> InitializePaymentAsync(
        PaymentInitRequest request, CancellationToken ct = default)
    {
        try
        {
            var merchantId = _config["Payment:PayTR:MerchantId"]!;
            var merchantKey = _config["Payment:PayTR:MerchantKey"]!;
            var merchantSalt = _config["Payment:PayTR:MerchantSalt"]!;

            // PayTR amount: kuruş cinsinden (100 TRY = 10000)
            var amountKurus = (long)(request.Amount.Amount * 100);
            var basketJson = JsonSerializer.Serialize(
                request.Items.Select(i => new[] { i.Name, i.Price.ToString("F2"), i.Quantity.ToString() }).ToList());
            var basketEncoded = Convert.ToBase64String(Encoding.UTF8.GetBytes(basketJson));

            var customerEmail = request.CustomerEmail;
            var merchantOid = request.OrderId;
            var userIp = request.CustomerIp;
            var paymentAmount = amountKurus.ToString();
            var currency = "TL";
            var testMode = "0";
            var noInstallment = "0";
            var maxInstallment = "0";

            // HMAC-SHA256 token oluşturma
            var hashStr = merchantId + userIp + merchantOid + customerEmail + paymentAmount +
                          basketEncoded + noInstallment + maxInstallment + currency + testMode + merchantSalt;
            var paytrToken = Convert.ToBase64String(
                HMACSHA256.HashData(Encoding.UTF8.GetBytes(merchantKey), Encoding.UTF8.GetBytes(hashStr)));

            var formParams = new Dictionary<string, string>
            {
                ["merchant_id"] = merchantId,
                ["user_ip"] = userIp,
                ["merchant_oid"] = merchantOid,
                ["email"] = customerEmail,
                ["payment_amount"] = paymentAmount,
                ["paytr_token"] = paytrToken,
                ["user_basket"] = basketEncoded,
                ["debug_on"] = "0",
                ["no_installment"] = noInstallment,
                ["max_installment"] = maxInstallment,
                ["user_name"] = request.CustomerName,
                ["user_address"] = "N/A",
                ["user_phone"] = "05000000000",
                ["merchant_ok_url"] = request.ReturnUrl + $"?orderId={request.OrderId}",
                ["merchant_fail_url"] = request.ReturnUrl + $"?orderId={request.OrderId}&status=fail",
                ["timeout_limit"] = "30",
                ["currency"] = currency,
                ["test_mode"] = testMode
            };

            var client = _httpClientFactory.CreateClient("PayTR");
            client.BaseAddress = new Uri("https://www.paytr.com");
            var response = await client.PostAsync("/odeme/api/get-token", new FormUrlEncodedContent(formParams), ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : null;
            if (status == "success")
            {
                var iframeToken = root.TryGetProperty("token", out var tokenEl) ? tokenEl.GetString() : null;
                // PayTR iFrame URL
                var redirectUrl = $"https://www.paytr.com/odeme/guvenli/{iframeToken}";

                return new PaymentInitResult(true, redirectUrl, iframeToken, null, null);
            }

            var reason = root.TryGetProperty("reason", out var reasonEl) ? reasonEl.GetString() : "Unknown error";
            return new PaymentInitResult(false, null, null, "paytr_error", reason);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayTR InitializePayment failed. OrderId={OrderId}", request.OrderId);
            return new PaymentInitResult(false, null, null, "paytr_error", ex.Message);
        }
    }

    public Task<PaymentVerifyResult> VerifyPaymentAsync(
        PaymentVerifyRequest request, CancellationToken ct = default)
    {
        try
        {
            var merchantKey = _config["Payment:PayTR:MerchantKey"]!;
            var merchantSalt = _config["Payment:PayTR:MerchantSalt"]!;

            // PayTR callback form parametreleri RawPayload'da URL-encoded olarak gelir
            var formParams = request.RawPayload
                .Split('&')
                .Select(p => p.Split('=', 2))
                .Where(p => p.Length == 2)
                .ToDictionary(
                    p => Uri.UnescapeDataString(p[0]),
                    p => Uri.UnescapeDataString(p[1]));

            formParams.TryGetValue("merchant_oid", out var merchantOid);
            formParams.TryGetValue("status", out var status);
            formParams.TryGetValue("total_amount", out var totalAmount);
            formParams.TryGetValue("hash", out var hash);
            merchantOid ??= "";
            status ??= "";
            totalAmount ??= "";
            hash ??= "";

            // HMAC doğrulama
            var hashStr = merchantOid + merchantSalt + status + totalAmount;
            var expectedHash = Convert.ToBase64String(
                HMACSHA256.HashData(Encoding.UTF8.GetBytes(merchantKey), Encoding.UTF8.GetBytes(hashStr)));

            if (hash != expectedHash)
            {
                _logger.LogWarning("PayTR webhook signature mismatch. OrderId={OrderId}", request.OrderId);
                return Task.FromResult(new PaymentVerifyResult(
                    false, null, null, "invalid_signature", "Signature mismatch", PaymentStatus.Failed));
            }

            if (status == "success")
            {
                var txId = formParams["payment_type"] + "-" + merchantOid;
                return Task.FromResult(new PaymentVerifyResult(
                    true, txId, null, null, null, PaymentStatus.Completed));
            }

            var failedReason = formParams["failed_reason_msg"] ?? "Payment failed";
            return Task.FromResult(new PaymentVerifyResult(
                false, null, null, "paytr_failed", failedReason, PaymentStatus.Failed));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayTR VerifyPayment failed. OrderId={OrderId}", request.OrderId);
            return Task.FromResult(new PaymentVerifyResult(
                false, null, null, "paytr_error", ex.Message, PaymentStatus.Failed));
        }
    }

    public async Task<RefundResult> RefundAsync(RefundRequest request, CancellationToken ct = default)
    {
        try
        {
            var merchantId = _config["Payment:PayTR:MerchantId"]!;
            var merchantKey = _config["Payment:PayTR:MerchantKey"]!;
            var merchantSalt = _config["Payment:PayTR:MerchantSalt"]!;

            var refundAmount = request.Amount is not null
                ? ((long)(request.Amount.Amount * 100)).ToString()
                : null;

            var hashStr = merchantId + request.TransactionId + (refundAmount ?? "") + merchantSalt;
            var token = Convert.ToBase64String(
                HMACSHA256.HashData(Encoding.UTF8.GetBytes(merchantKey), Encoding.UTF8.GetBytes(hashStr)));

            var formParams = new Dictionary<string, string>
            {
                ["merchant_id"] = merchantId,
                ["merchant_oid"] = request.OrderId,
                ["return_id"] = request.TransactionId,
                ["paytr_token"] = token
            };
            if (refundAmount is not null)
                formParams["return_amount"] = refundAmount;

            var client = _httpClientFactory.CreateClient("PayTR");
            client.BaseAddress = new Uri("https://www.paytr.com");
            var response = await client.PostAsync("/odeme/refund", new FormUrlEncodedContent(formParams), ct);
            var content = await response.Content.ReadAsStringAsync(ct);

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var status = root.TryGetProperty("status", out var statusEl) ? statusEl.GetString() : null;
            if (status == "success")
                return new RefundResult(true, $"paytr-refund-{request.OrderId}", null, null);

            var reason = root.TryGetProperty("err_no", out var errEl) ? errEl.GetString() : "Refund failed";
            return new RefundResult(false, null, "paytr_refund_failed", reason);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayTR Refund failed. OrderId={OrderId}", request.OrderId);
            return new RefundResult(false, null, "paytr_error", ex.Message);
        }
    }
}

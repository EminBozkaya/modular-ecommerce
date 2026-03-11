using System.Text.RegularExpressions;

namespace ECommerce.Infrastructure.Payment;

/// <summary>
/// Provider request/response loglarından hassas alanları maskeler.
/// PCI-DSS: kart verisi, token, secret asla loglanmaz.
/// </summary>
public static class PaymentSanitizer
{
    private static readonly string[] SensitiveKeys =
    [
        "cardNumber", "card_number", "cardnumber",
        "cvv", "cvc", "cvc2",
        "pan",
        "cardHolderName", "card_holder_name",
        "token",
        "secretKey", "secret_key",
        "apiKey", "api_key",
        "signature",
        "password",
        "merchantKey", "merchant_key",
        "merchantSalt", "merchant_salt",
        "Stripe-Signature",
        "webhookSecret", "webhook_secret",
        "clientSecret", "client_secret",
        "access_token", "accessToken",
        "refresh_token", "refreshToken"
    ];

    public static string Sanitize(string payload)
    {
        if (string.IsNullOrWhiteSpace(payload))
            return payload;

        var result = payload;

        foreach (var key in SensitiveKeys)
        {
            // JSON string values: "key": "value"
            result = Regex.Replace(
                result,
                $@"(""{Regex.Escape(key)}""\s*:\s*"")[^""]*("")",
                "$1***MASKED***$2",
                RegexOptions.IgnoreCase);

            // JSON numeric values: "key": 1234
            result = Regex.Replace(
                result,
                $@"(""{Regex.Escape(key)}""\s*:\s*)(\d+)",
                "$1***MASKED***",
                RegexOptions.IgnoreCase);
        }

        // Card number pattern (16 digits) — mask middle digits, keep last 4
        result = Regex.Replace(
            result,
            @"\b(\d{4})\d{8}(\d{4})\b",
            "$1********$2");

        return result;
    }
}

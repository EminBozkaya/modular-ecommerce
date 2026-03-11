using ECommerce.Domain.Common;

namespace ECommerce.Domain.Payment.Entities;

/// <summary>
/// Provider iletişimi için audit trail.
/// PCI-DSS uyumlu: hassas alanlar (kart verisi, token, secret) asla kaydedilmez.
/// </summary>
public class PaymentProviderLog : BaseAuditableEntity
{
    public Guid PaymentRecordId { get; private set; }
    public string ProviderName { get; private set; } = default!;
    public string Action { get; private set; } = default!;     // "Initialize", "Verify", "Refund"
    public string? SanitizedRequest { get; private set; }
    public string? SanitizedResponse { get; private set; }
    public bool IsSuccess { get; private set; }
    public int? HttpStatusCode { get; private set; }
    public long DurationMs { get; private set; }
    public string? ErrorCode { get; private set; }

    private PaymentProviderLog() { }

    public static PaymentProviderLog Create(
        Guid paymentRecordId,
        string providerName,
        string action,
        string? sanitizedRequest,
        string? sanitizedResponse,
        bool isSuccess,
        int? httpStatusCode,
        long durationMs,
        string? errorCode = null)
    {
        return new PaymentProviderLog
        {
            PaymentRecordId = paymentRecordId,
            ProviderName = providerName,
            Action = action,
            SanitizedRequest = sanitizedRequest,
            SanitizedResponse = sanitizedResponse,
            IsSuccess = isSuccess,
            HttpStatusCode = httpStatusCode,
            DurationMs = durationMs,
            ErrorCode = errorCode,
            CreatedAt = DateTime.UtcNow
        };
    }
}

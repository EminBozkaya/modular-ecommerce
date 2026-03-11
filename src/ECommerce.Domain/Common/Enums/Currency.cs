namespace ECommerce.Domain.Common.Enums;

/// <summary>
/// ISO 4217 para birimi kodları.
/// Yeni para birimi eklendiğinde MinorUnitDigits mapping'i de güncellenmelidir.
/// </summary>
public enum Currency
{
    TRY,
    USD,
    EUR,
    GBP,
    JPY
}

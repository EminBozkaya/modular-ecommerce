using ECommerce.Domain.Common;
using ECommerce.Domain.Ordering.Enums;

namespace ECommerce.Domain.Identity.Entities;

public class UserBillingAddress : BaseAuditableEntity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = null!;
    public InvoiceType InvoiceType { get; private set; }

    // ── Individual (Bireysel) ──
    public string? FullName { get; private set; }
    public string? TcKimlikNo { get; private set; }

    // ── Corporate (Kurumsal) ──
    public string? CompanyName { get; private set; }
    public string? TaxOffice { get; private set; }
    public string? TaxNumber { get; private set; }

    // ── Common address fields ──
    public string AddressLine1 { get; private set; } = null!;
    public string? AddressLine2 { get; private set; }
    public string City { get; private set; } = null!;
    public string PostalCode { get; private set; } = null!;
    public string Country { get; private set; } = null!;

    public bool IsDefault { get; private set; }
    public bool IsActive { get; private set; }

    // Navigation
    public AppUser User { get; private set; } = null!;

    // ── Relational FK columns (nullable for backward-compat) ──
    public int? CountryId { get; private set; }
    public int? CityId { get; private set; }
    public int? DistrictId { get; private set; }

    public Country? CountryRef { get; private set; }
    public City? CityRef { get; private set; }
    public District? DistrictRef { get; private set; }

    private UserBillingAddress() { }

    public static UserBillingAddress Create(
        Guid userId,
        string title,
        InvoiceType invoiceType,
        string? fullName,
        string? tcKimlikNo,
        string? companyName,
        string? taxOffice,
        string? taxNumber,
        string addressLine1,
        string? addressLine2,
        string city,
        string postalCode,
        string country,
        bool isDefault = false,
        int? countryId = null,
        int? cityId = null,
        int? districtId = null,
        bool isActive = true)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(addressLine1);
        ArgumentException.ThrowIfNullOrWhiteSpace(city);
        ArgumentException.ThrowIfNullOrWhiteSpace(postalCode);
        ArgumentException.ThrowIfNullOrWhiteSpace(country);

        if (invoiceType == InvoiceType.Individual)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(fullName);
            ArgumentException.ThrowIfNullOrWhiteSpace(tcKimlikNo);
        }
        else
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(companyName);
            ArgumentException.ThrowIfNullOrWhiteSpace(taxOffice);
            ArgumentException.ThrowIfNullOrWhiteSpace(taxNumber);
        }

        return new UserBillingAddress
        {
            UserId = userId,
            Title = title,
            InvoiceType = invoiceType,
            FullName = fullName,
            TcKimlikNo = tcKimlikNo,
            CompanyName = companyName,
            TaxOffice = taxOffice,
            TaxNumber = taxNumber,
            AddressLine1 = addressLine1,
            AddressLine2 = addressLine2,
            City = city,
            PostalCode = postalCode,
            Country = country,
            IsDefault = isDefault,
            CountryId = countryId,
            CityId = cityId,
            DistrictId = districtId,
            IsActive = isActive,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string title,
        InvoiceType invoiceType,
        string? fullName,
        string? tcKimlikNo,
        string? companyName,
        string? taxOffice,
        string? taxNumber,
        string addressLine1,
        string? addressLine2,
        string city,
        string postalCode,
        string country,
        int? countryId = null,
        int? cityId = null,
        int? districtId = null,
        bool? isActive = null)
    {
        Title = title;
        InvoiceType = invoiceType;
        FullName = fullName;
        TcKimlikNo = tcKimlikNo;
        CompanyName = companyName;
        TaxOffice = taxOffice;
        TaxNumber = taxNumber;
        AddressLine1 = addressLine1;
        AddressLine2 = addressLine2;
        City = city;
        PostalCode = postalCode;
        Country = country;
        CountryId = countryId;
        CityId = cityId;
        DistrictId = districtId;
        if (isActive.HasValue) IsActive = isActive.Value;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDefault(bool isDefault)
    {
        IsDefault = isDefault;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate() { IsActive = true; UpdatedAt = DateTime.UtcNow; }
    public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }

    public void Restore()
    {
        IsDeleted = false;
        DeletedAt = null;
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }
}

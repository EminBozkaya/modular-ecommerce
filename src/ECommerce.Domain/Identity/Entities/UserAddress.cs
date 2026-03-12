using ECommerce.Domain.Common;

namespace ECommerce.Domain.Identity.Entities;

public class UserAddress : BaseAuditableEntity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = null!;        // "Ev Adresim", "İş Adresim"
    public string FullName { get; private set; } = null!;
    public string AddressLine1 { get; private set; } = null!;
    public string? AddressLine2 { get; private set; }
    public string City { get; private set; } = null!;
    public string PostalCode { get; private set; } = null!;
    public string Country { get; private set; } = null!;
    public bool IsDefault { get; private set; }

    private UserAddress() { }

    public static UserAddress Create(
        Guid userId,
        string title,
        string fullName,
        string addressLine1,
        string? addressLine2,
        string city,
        string postalCode,
        string country,
        bool isDefault = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(fullName);
        ArgumentException.ThrowIfNullOrWhiteSpace(addressLine1);
        ArgumentException.ThrowIfNullOrWhiteSpace(city);
        ArgumentException.ThrowIfNullOrWhiteSpace(postalCode);
        ArgumentException.ThrowIfNullOrWhiteSpace(country);

        return new UserAddress
        {
            UserId = userId,
            Title = title,
            FullName = fullName,
            AddressLine1 = addressLine1,
            AddressLine2 = addressLine2,
            City = city,
            PostalCode = postalCode,
            Country = country,
            IsDefault = isDefault,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string title,
        string fullName,
        string addressLine1,
        string? addressLine2,
        string city,
        string postalCode,
        string country)
    {
        Title = title;
        FullName = fullName;
        AddressLine1 = addressLine1;
        AddressLine2 = addressLine2;
        City = city;
        PostalCode = postalCode;
        Country = country;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDefault(bool isDefault)
    {
        IsDefault = isDefault;
        UpdatedAt = DateTime.UtcNow;
    }
}

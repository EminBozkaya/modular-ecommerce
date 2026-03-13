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
    public bool IsActive { get; private set; }

    // Navigation
    public AppUser User { get; private set; } = null!;

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
        bool isDefault = false,
        bool isActive = true)
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
            IsActive = isActive,
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
        string country,
        bool? isActive = null)
    {
        Title = title;
        FullName = fullName;
        AddressLine1 = addressLine1;
        AddressLine2 = addressLine2;
        City = city;
        PostalCode = postalCode;
        Country = country;
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

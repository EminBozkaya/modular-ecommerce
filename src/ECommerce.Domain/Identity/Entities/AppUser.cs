using ECommerce.Domain.Common;
using ECommerce.Domain.Identity.Enums;

namespace ECommerce.Domain.Identity.Entities;

public class AppUser : BaseAuditableEntity
{
    public string FirstName { get; private set; } = default!;
    public string LastName { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string? PasswordHash { get; private set; }
    public string? PhoneNumber { get; private set; }
    public UserRole Role { get; private set; }
    public bool IsEmailConfirmed { get; private set; }

    // Refresh token — security-rules: rotation is mandatory
    public string? RefreshToken { get; private set; }
    public DateTime? RefreshTokenExpiresAt { get; private set; }

    private readonly List<ExternalLogin> _externalLogins = new();
    public IReadOnlyCollection<ExternalLogin> ExternalLogins => _externalLogins.AsReadOnly();

    private AppUser() { }

    public static AppUser Create(string firstName, string lastName, string email, string passwordHash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);

        return new AppUser
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email.ToLowerInvariant(),
            PasswordHash = passwordHash,
            Role = UserRole.Customer,
            IsEmailConfirmed = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static AppUser CreateFromSocialLogin(string firstName, string lastName, string email, bool isEmailConfirmed = true)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        return new AppUser
        {
            FirstName = firstName,
            LastName = string.IsNullOrWhiteSpace(lastName) ? "" : lastName,
            Email = email.ToLowerInvariant(),
            PasswordHash = null,
            Role = UserRole.Customer,
            IsEmailConfirmed = isEmailConfirmed,
            CreatedAt = DateTime.UtcNow
        };
    }

    public string FullName => $"{FirstName} {LastName}";

    public void PromoteToAdmin() { Role = UserRole.Admin; UpdatedAt = DateTime.UtcNow; }

    public void SetRefreshToken(string token, DateTime expiresAt)
    {
        RefreshToken = token;
        RefreshTokenExpiresAt = expiresAt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RevokeRefreshToken()
    {
        RefreshToken = null;
        RefreshTokenExpiresAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsRefreshTokenValid(string token) =>
        RefreshToken == token && RefreshTokenExpiresAt > DateTime.UtcNow;

    public void ConfirmEmail() { IsEmailConfirmed = true; UpdatedAt = DateTime.UtcNow; }

    public void UpdateProfile(string firstName, string lastName, string? phoneNumber)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        PhoneNumber = string.IsNullOrWhiteSpace(phoneNumber) ? null : phoneNumber.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPasswordHash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(newPasswordHash);
        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddExternalLogin(string provider, string providerUserId)
    {
        _externalLogins.Add(ExternalLogin.Create(this.Id, provider, providerUserId));
    }
}

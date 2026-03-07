using ECommerce.Domain.Common;
using ECommerce.Domain.Identity.Enums;

namespace ECommerce.Domain.Identity.Entities;

public class AppUser : BaseAuditableEntity
{
    public string FirstName { get; private set; } = default!;
    public string LastName { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string PasswordHash { get; private set; } = default!;
    public UserRole Role { get; private set; }
    public bool IsEmailConfirmed { get; private set; }

    // Refresh token — security-rules: rotation is mandatory
    public string? RefreshToken { get; private set; }
    public DateTime? RefreshTokenExpiresAt { get; private set; }

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
}

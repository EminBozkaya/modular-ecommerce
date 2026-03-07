using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using MediatR;
using System.Security.Cryptography;

namespace ECommerce.Application.Identity.Commands;

public class RegisterHandler : IRequestHandler<RegisterCommand, Guid>
{
    private readonly IUserRepository _users;
    public RegisterHandler(IUserRepository users) => _users = users;

    public async Task<Guid> Handle(RegisterCommand cmd, CancellationToken ct)
    {
        var exists = await _users.ExistsByEmailAsync(cmd.Email, ct);
        if (exists) throw new InvalidOperationException("Email already registered.");
        var hash = HashPassword(cmd.Password);
        var user = AppUser.Create(cmd.FirstName, cmd.LastName, cmd.Email, hash);
        await _users.AddAsync(user, ct);
        await _users.SaveChangesAsync(ct);
        return user.Id;
    }

    private static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }
}

public class LoginHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;
    public LoginHandler(IUserRepository users, IJwtService jwt) { _users = users; _jwt = jwt; }

    public async Task<LoginResult> Handle(LoginCommand cmd, CancellationToken ct)
    {
        var user = await _users.GetByEmailAsync(cmd.Email, ct)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");
        if (!VerifyPassword(cmd.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");
        var accessToken = _jwt.GenerateAccessToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();
        var refreshExpiry = DateTime.UtcNow.AddDays(7);
        user.SetRefreshToken(refreshToken, refreshExpiry);
        await _users.SaveChangesAsync(ct);
        return new LoginResult(accessToken, refreshToken, refreshExpiry, user.Id, user.Email, user.FullName, user.Role.ToString());
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split('.');
        if (parts.Length != 2) return false;
        var salt = Convert.FromBase64String(parts[0]);
        var hash = Convert.FromBase64String(parts[1]);
        var computed = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);
        return CryptographicOperations.FixedTimeEquals(hash, computed);
    }
}

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, LoginResult>
{
    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;
    public RefreshTokenHandler(IUserRepository users, IJwtService jwt) { _users = users; _jwt = jwt; }

    public async Task<LoginResult> Handle(RefreshTokenCommand cmd, CancellationToken ct)
    {
        var user = await _users.GetByRefreshTokenAsync(cmd.RefreshToken, ct)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");
        if (!user.IsRefreshTokenValid(cmd.RefreshToken))
            throw new UnauthorizedAccessException("Refresh token expired.");
        var newAccessToken = _jwt.GenerateAccessToken(user);
        var newRefreshToken = _jwt.GenerateRefreshToken();
        var newExpiry = DateTime.UtcNow.AddDays(7);
        user.SetRefreshToken(newRefreshToken, newExpiry);
        await _users.SaveChangesAsync(ct);
        return new LoginResult(newAccessToken, newRefreshToken, newExpiry, user.Id, user.Email, user.FullName, user.Role.ToString());
    }
}

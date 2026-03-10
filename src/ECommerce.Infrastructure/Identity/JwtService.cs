using ECommerce.Domain.Identity.Entities;
using ECommerce.Domain.Identity.Enums;
using ECommerce.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ECommerce.Infrastructure.Identity;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateAccessToken(AppUser user)
    {
        var jwtSection = _config.GetRequiredSection("Jwt");

        // Secret resolution: environment variable (JWT__Secret) takes precedence over appsettings.
        // If neither is set, fail fast — running without a secret is a critical security misconfiguration.
        var secret = Environment.GetEnvironmentVariable("JWT__Secret")
            ?? jwtSection["Secret"];

        if (string.IsNullOrWhiteSpace(secret))
            throw new InvalidOperationException(
                "JWT secret is not configured. Set the JWT__Secret environment variable or Jwt:Secret in appsettings.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("firstName", user.FirstName),
            new("lastName", user.LastName),
            new(ClaimTypes.Name, user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSection["AccessTokenMinutes"] ?? "15")),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    // Not used for validation in current MVP; AppUser.IsRefreshTokenValid handles it
    public Guid? ValidateRefreshToken(string token) => null;
}

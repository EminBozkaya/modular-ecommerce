using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using ECommerce.Domain.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace ECommerce.Infrastructure.Identity.SocialAuth.Providers;

/// <summary>
/// Apple Sign In provider.
/// Note: Apple requires JWT-based client_secret signed with ES256.
/// </summary>
public class AppleSocialAuthProvider : ISocialAuthProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AppleSocialAuthProvider> _logger;

    public AppleSocialAuthProvider(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<AppleSocialAuthProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "Apple";
    public string DisplayName => "Apple";
    public bool IsActive => _config.GetValue<bool>("SocialAuth:Apple:IsActive");

    public Task<SocialAuthUrlResult> GetAuthorizationUrlAsync(string redirectUri, string state, CancellationToken ct = default)
    {
        var clientId = _config["SocialAuth:Apple:ClientId"];
        if (string.IsNullOrEmpty(clientId))
            return Task.FromResult(new SocialAuthUrlResult(false, null, state, "Apple ClientId is missing."));

        var authUrl = $"https://appleid.apple.com/auth/authorize" +
                      $"?response_type=code" +
                      $"&client_id={clientId}" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&scope=name%20email" +
                      $"&response_mode=form_post" +
                      $"&state={state}";

        return Task.FromResult(new SocialAuthUrlResult(true, authUrl, state, null));
    }

    public async Task<SocialAuthResult> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        try
        {
            var clientId = _config["SocialAuth:Apple:ClientId"];
            var teamId = _config["SocialAuth:Apple:TeamId"];
            var keyId = _config["SocialAuth:Apple:KeyId"];
            var privateKey = _config["SocialAuth:Apple:PrivateKey"];

            if (string.IsNullOrEmpty(privateKey))
                return new SocialAuthResult(false, null, null, null, null, null, "missing_config", "Apple private key not configured.");

            var clientSecret = GenerateAppleClientSecret(clientId!, teamId!, keyId!, privateKey);
            var client = _httpClientFactory.CreateClient("AppleSocialAuth");

            var tokenResponse = await client.PostAsync("https://appleid.apple.com/auth/token", new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", clientId!),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("redirect_uri", redirectUri)
            }), ct);

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);

            if (!tokenData.TryGetProperty("id_token", out var idTokenEl))
                return new SocialAuthResult(false, null, null, null, null, null, "no_id_token", "Apple token exchange failed.");

            // Parse the id_token JWT (without verifying signature here — Apple's JWKS endpoint can be used for full verification)
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(idTokenEl.GetString());

            var sub = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            return new SocialAuthResult(true, sub, email, null, null, null, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception during Apple code exchange.");
            return new SocialAuthResult(false, null, null, null, null, null, "exception", ex.Message);
        }
    }

    private static string GenerateAppleClientSecret(string clientId, string teamId, string keyId, string privateKeyPem)
    {
        // Clean up PEM string (remove headers/footers and whitespace)
        var keyData = privateKeyPem
            .Replace("-----BEGIN PRIVATE KEY-----", "")
            .Replace("-----END PRIVATE KEY-----", "")
            .Replace("-----BEGIN EC PRIVATE KEY-----", "")
            .Replace("-----END EC PRIVATE KEY-----", "")
            .Replace("\n", "").Replace("\r", "").Trim();

        using var ecdsa = ECDsa.Create();
        ecdsa.ImportPkcs8PrivateKey(Convert.FromBase64String(keyData), out _);

        var securityKey = new ECDsaSecurityKey(ecdsa) { KeyId = keyId };
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.EcdsaSha256);

        var now = DateTimeOffset.UtcNow;
        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = teamId,
            Audience = "https://appleid.apple.com",
            Subject = new System.Security.Claims.ClaimsIdentity(new[]
            {
                new System.Security.Claims.Claim("sub", clientId)
            }),
            IssuedAt = now.UtcDateTime,
            Expires = now.AddMinutes(5).UtcDateTime,
            SigningCredentials = credentials
        };

        var handler = new JwtSecurityTokenHandler();
        return handler.CreateEncodedJwt(descriptor);
    }
}

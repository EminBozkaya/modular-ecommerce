using System.Net.Http.Json;
using System.Text.Json;
using ECommerce.Domain.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Identity.SocialAuth.Providers;

public class FacebookSocialAuthProvider : ISocialAuthProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<FacebookSocialAuthProvider> _logger;

    public FacebookSocialAuthProvider(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<FacebookSocialAuthProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "Facebook";
    public string DisplayName => "Facebook";
    public bool IsActive => !string.IsNullOrWhiteSpace(_config["SocialAuth:Facebook:ClientId"]) &&
                            !string.IsNullOrWhiteSpace(_config["SocialAuth:Facebook:ClientSecret"]);

    public Task<SocialAuthUrlResult> GetAuthorizationUrlAsync(string redirectUri, string state, CancellationToken ct = default)
    {
        var clientId = _config["SocialAuth:Facebook:ClientId"];
        if (string.IsNullOrEmpty(clientId))
            return Task.FromResult(new SocialAuthUrlResult(false, null, state, "Facebook ClientId is missing."));

        var authUrl = $"https://www.facebook.com/v18.0/dialog/oauth" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&response_type=code" +
                      $"&scope=email,public_profile" +
                      $"&state={state}";

        return Task.FromResult(new SocialAuthUrlResult(true, authUrl, state, null));
    }

    public async Task<SocialAuthResult> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        try
        {
            var appId = _config["SocialAuth:Facebook:ClientId"];
            var appSecret = _config["SocialAuth:Facebook:ClientSecret"];
            var client = _httpClientFactory.CreateClient("FacebookSocialAuth");

            // 1. Token Exchange
            var tokenUrl = $"https://graph.facebook.com/v18.0/oauth/access_token" +
                           $"?client_id={appId}&client_secret={appSecret}" +
                           $"&code={Uri.EscapeDataString(code)}&redirect_uri={Uri.EscapeDataString(redirectUri)}";

            var tokenResponse = await client.GetFromJsonAsync<JsonElement>(tokenUrl, ct);
            var accessToken = tokenResponse.GetProperty("access_token").GetString();

            // 2. Fetch User Profile
            var profileUrl = $"https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token={accessToken}";
            var profileData = await client.GetFromJsonAsync<JsonElement>(profileUrl, ct);

            var providerUserId = profileData.GetProperty("id").GetString();
            var email = profileData.TryGetProperty("email", out var emailEl) ? emailEl.GetString() : null;
            var firstName = profileData.TryGetProperty("first_name", out var fnEl) ? fnEl.GetString() : null;
            var lastName = profileData.TryGetProperty("last_name", out var lnEl) ? lnEl.GetString() : null;

            if (email is null)
                return new SocialAuthResult(false, null, null, null, null, null, "no_email", "Facebook account has no email. Please ensure your Facebook account has a verified email.");

            return new SocialAuthResult(true, providerUserId, email, firstName, lastName, null, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception during Facebook code exchange.");
            return new SocialAuthResult(false, null, null, null, null, null, "exception", ex.Message);
        }
    }
}

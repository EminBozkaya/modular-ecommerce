using System.Net.Http.Json;
using System.Text.Json;
using ECommerce.Domain.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Identity.SocialAuth.Providers;

public class GoogleSocialAuthProvider : ISocialAuthProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GoogleSocialAuthProvider> _logger;

    public GoogleSocialAuthProvider(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<GoogleSocialAuthProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "Google";
    public string DisplayName => "Google";
    public bool IsActive => !string.IsNullOrWhiteSpace(_config["SocialAuth:Google:ClientId"]) &&
                            !string.IsNullOrWhiteSpace(_config["SocialAuth:Google:ClientSecret"]);

    public Task<SocialAuthUrlResult> GetAuthorizationUrlAsync(string redirectUri, string state, CancellationToken ct = default)
    {
        var clientId = _config["SocialAuth:Google:ClientId"];
        if (string.IsNullOrEmpty(clientId))
            return Task.FromResult(new SocialAuthUrlResult(false, null, state, "Google ClientId is missing."));

        var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={redirectUri}" +
                      $"&response_type=code" +
                      $"&scope=email profile" +
                      $"&state={state}";

        return Task.FromResult(new SocialAuthUrlResult(true, authUrl, state, null));
    }

    public async Task<SocialAuthResult> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        try
        {
            var clientId = _config["SocialAuth:Google:ClientId"];
            var clientSecret = _config["SocialAuth:Google:ClientSecret"];

            var client = _httpClientFactory.CreateClient("GoogleSocialAuth");

            // 1. Token Exchange
            var tokenResponse = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", clientId!),
                new KeyValuePair<string, string>("client_secret", clientSecret!),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("redirect_uri", redirectUri)
            }), ct);

            if (!tokenResponse.IsSuccessStatusCode)
            {
                var errorBody = await tokenResponse.Content.ReadAsStringAsync(ct);
                _logger.LogWarning("Google token exchange failed: {Status} - {Body}", tokenResponse.StatusCode, errorBody);
                return new SocialAuthResult(false, null, null, null, null, null, "token_exchange_failed", "Failed to exchange code for token.");
            }

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            var accessToken = tokenData.GetProperty("access_token").GetString();

            // 2. Fetch User Profile
            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v2/userinfo");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var profileResponse = await client.SendAsync(request, ct);
            if (!profileResponse.IsSuccessStatusCode)
            {
                var errorBody = await profileResponse.Content.ReadAsStringAsync(ct);
                _logger.LogWarning("Google profile fetch failed: {Status} - {Body}", profileResponse.StatusCode, errorBody);
                return new SocialAuthResult(false, null, null, null, null, null, "profile_fetch_failed", "Failed to fetch user profile.");
            }

            var profileData = await profileResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            
            var providerUserId = profileData.GetProperty("id").GetString();
            var email = profileData.GetProperty("email").GetString();
            var givenName = profileData.TryGetProperty("given_name", out var fnEl) ? fnEl.GetString() : null;
            var familyName = profileData.TryGetProperty("family_name", out var lnEl) ? lnEl.GetString() : null;
            var picture = profileData.TryGetProperty("picture", out var picEl) ? picEl.GetString() : null;

            return new SocialAuthResult(true, providerUserId, email, givenName, familyName, picture, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception during Google code exchange.");
            return new SocialAuthResult(false, null, null, null, null, null, "exception", ex.Message);
        }
    }
}

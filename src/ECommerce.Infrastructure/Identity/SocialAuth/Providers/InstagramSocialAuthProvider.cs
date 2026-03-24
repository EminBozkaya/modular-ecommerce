using System.Net.Http.Json;
using System.Text.Json;
using ECommerce.Domain.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Identity.SocialAuth.Providers;

public class InstagramSocialAuthProvider : ISocialAuthProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<InstagramSocialAuthProvider> _logger;

    public InstagramSocialAuthProvider(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<InstagramSocialAuthProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "Instagram";
    public string DisplayName => "Instagram";
    public bool IsActive => _config.GetValue<bool>("SocialAuth:Instagram:IsActive");

    public Task<SocialAuthUrlResult> GetAuthorizationUrlAsync(string redirectUri, string state, CancellationToken ct = default)
    {
        var clientId = _config["SocialAuth:Instagram:ClientId"];
        if (string.IsNullOrEmpty(clientId))
            return Task.FromResult(new SocialAuthUrlResult(false, null, state, "Instagram ClientId is missing."));

        // Instagram uses Facebook OAuth infrastructure
        var authUrl = $"https://api.instagram.com/oauth/authorize" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&scope=user_profile,user_media" +
                      $"&response_type=code" +
                      $"&state={state}";

        return Task.FromResult(new SocialAuthUrlResult(true, authUrl, state, null));
    }

    public async Task<SocialAuthResult> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        try
        {
            var appId = _config["SocialAuth:Instagram:ClientId"];
            var appSecret = _config["SocialAuth:Instagram:ClientSecret"];
            var client = _httpClientFactory.CreateClient("InstagramSocialAuth");

            // 1. Token Exchange
            var tokenResponse = await client.PostAsync("https://api.instagram.com/oauth/access_token", new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", appId!),
                new KeyValuePair<string, string>("client_secret", appSecret!),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
                new KeyValuePair<string, string>("code", code)
            }), ct);

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            var accessToken = tokenData.GetProperty("access_token").GetString();
            var userId = tokenData.GetProperty("user_id").ToString();

            // 2. Fetch Profile (Instagram Basic Display API only gives id and username, not email)
            var profileUrl = $"https://graph.instagram.com/{userId}?fields=id,username&access_token={accessToken}";
            var profileData = await client.GetFromJsonAsync<JsonElement>(profileUrl, ct);
            var username = profileData.TryGetProperty("username", out var unEl) ? unEl.GetString() : userId;

            // Instagram does not provide email — use a placeholder based on username
            var email = $"{username}@instagram.placeholder";

            return new SocialAuthResult(true, userId, email, username, null, null, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception during Instagram code exchange.");
            return new SocialAuthResult(false, null, null, null, null, null, "exception", ex.Message);
        }
    }
}

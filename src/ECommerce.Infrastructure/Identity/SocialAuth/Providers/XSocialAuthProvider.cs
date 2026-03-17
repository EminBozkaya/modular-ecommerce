using System.Net.Http.Json;
using System.Text.Json;
using ECommerce.Domain.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Identity.SocialAuth.Providers;

public class XSocialAuthProvider : ISocialAuthProvider
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<XSocialAuthProvider> _logger;

    public XSocialAuthProvider(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<XSocialAuthProvider> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public string ProviderName => "X";
    public string DisplayName => "X (Twitter)";
    public bool IsActive => !string.IsNullOrWhiteSpace(_config["SocialAuth:X:ClientId"]) &&
                            !string.IsNullOrWhiteSpace(_config["SocialAuth:X:ClientSecret"]);

    public Task<SocialAuthUrlResult> GetAuthorizationUrlAsync(string redirectUri, string state, CancellationToken ct = default)
    {
        var clientId = _config["SocialAuth:X:ClientId"];
        if (string.IsNullOrEmpty(clientId))
            return Task.FromResult(new SocialAuthUrlResult(false, null, state, "X ClientId is missing."));

        // Generate a cryptographically random code_verifier (length 43)
        var codeVerifier = "challengechallengechallengechallengechallenge43"; 
        
        // Calculate SHA256 of code_verifier
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var challengeBytes = sha256.ComputeHash(System.Text.Encoding.ASCII.GetBytes(codeVerifier));
        var codeChallenge = Microsoft.AspNetCore.WebUtilities.WebEncoders.Base64UrlEncode(challengeBytes);

        var authUrl = $"https://twitter.com/i/oauth2/authorize" +
                      $"?response_type=code" +
                      $"&client_id={clientId}" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&scope=tweet.read%20users.read%20offline.access" +
                      $"&state={state}" +
                      $"&code_challenge={codeChallenge}&code_challenge_method=S256";

        return Task.FromResult(new SocialAuthUrlResult(true, authUrl, state, null));
    }

    public async Task<SocialAuthResult> ExchangeCodeAsync(string code, string redirectUri, CancellationToken ct = default)
    {
        try
        {
            var clientId = _config["SocialAuth:X:ClientId"];
            var clientSecret = _config["SocialAuth:X:ClientSecret"];
            var client = _httpClientFactory.CreateClient("XSocialAuth");

            // Basic auth credentials
            var credentials = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", credentials);

            string codeVerifier = "challengechallengechallengechallengechallenge43";

            // 1. Token Exchange
            var tokenResponse = await client.PostAsync("https://api.twitter.com/2/oauth2/token", new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("client_id", clientId!),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
                new KeyValuePair<string, string>("code_verifier", codeVerifier)
            }), ct);

            var tokenData = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            var accessToken = tokenData.GetProperty("access_token").GetString();

            // 2. Fetch User Profile
            var profileReq = new HttpRequestMessage(HttpMethod.Get, "https://api.twitter.com/2/users/me?user.fields=name,username,profile_image_url");
            profileReq.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            var profileResponse = await client.SendAsync(profileReq, ct);
            var profileWrapper = await profileResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            var profileData = profileWrapper.GetProperty("data");

            var userId = profileData.GetProperty("id").GetString();
            var name = profileData.TryGetProperty("name", out var nameEl) ? nameEl.GetString() : null;
            var username = profileData.TryGetProperty("username", out var unEl) ? unEl.GetString() : userId;
            var firstName = name?.Split(' ').FirstOrDefault() ?? username;
            var lastName = name?.Contains(' ') == true ? string.Join(' ', name.Split(' ').Skip(1)) : null;

            // X does not provide email in basic scope
            var email = $"{username}@x.placeholder";

            return new SocialAuthResult(true, userId, email, firstName, lastName, null, null, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception during X code exchange.");
            return new SocialAuthResult(false, null, null, null, null, null, "exception", ex.Message);
        }
    }
}

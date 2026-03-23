using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using MediatR;

namespace ECommerce.Application.Identity.Commands;

public class GetSocialProvidersHandler : IRequestHandler<GetSocialProvidersQuery, List<SocialProviderDto>>
{
    private readonly IEnumerable<ISocialAuthProvider> _providers;

    public GetSocialProvidersHandler(IEnumerable<ISocialAuthProvider> providers)
    {
        _providers = providers;
    }

    public Task<List<SocialProviderDto>> Handle(GetSocialProvidersQuery request, CancellationToken ct)
    {
        var activeProviders = _providers
            .Where(p => p.IsActive)
            .Select(p => new SocialProviderDto(p.ProviderName, p.DisplayName))
            .ToList();

        return Task.FromResult(activeProviders);
    }
}

public class GetSocialAuthUrlHandler : IRequestHandler<GetSocialAuthUrlQuery, SocialAuthUrlResultDto>
{
    private readonly IEnumerable<ISocialAuthProvider> _providers;

    public GetSocialAuthUrlHandler(IEnumerable<ISocialAuthProvider> providers)
    {
        _providers = providers;
    }

    public async Task<SocialAuthUrlResultDto> Handle(GetSocialAuthUrlQuery request, CancellationToken ct)
    {
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(request.Provider, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
            return new SocialAuthUrlResultDto(false, null, null, $"Provider '{request.Provider}' not found.");

        if (!provider.IsActive)
            return new SocialAuthUrlResultDto(false, null, null, $"Provider '{request.Provider}' is not active.");

        // Generate a random state string for CSRF protection
        var state = Guid.NewGuid().ToString("N");

        var result = await provider.GetAuthorizationUrlAsync(request.RedirectUri, state, ct);
        return new SocialAuthUrlResultDto(result.IsSuccess, result.AuthorizationUrl, result.State, result.ErrorMessage);
    }
}

public class SocialLoginHandler : IRequestHandler<SocialLoginCommand, LoginResult>
{
    private readonly IEnumerable<ISocialAuthProvider> _providers;
    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;

    public SocialLoginHandler(
        IEnumerable<ISocialAuthProvider> providers, 
        IUserRepository users, 
        IJwtService jwt)
    {
        _providers = providers;
        _users = users;
        _jwt = jwt;
    }

    public async Task<LoginResult> Handle(SocialLoginCommand cmd, CancellationToken ct)
    {
        var provider = _providers.FirstOrDefault(p => 
            p.ProviderName.Equals(cmd.Provider, StringComparison.OrdinalIgnoreCase));

        if (provider is null || !provider.IsActive)
            throw new InvalidOperationException($"Social provider '{cmd.Provider}' is not available.");

        // 1. Exchange OAuth code for User Profile
        var providerResult = await provider.ExchangeCodeAsync(cmd.Code, cmd.RedirectUri, ct);

        if (!providerResult.IsSuccess || string.IsNullOrEmpty(providerResult.ProviderUserId) || string.IsNullOrEmpty(providerResult.Email))
            throw new UnauthorizedAccessException($"Failed to authenticate with {cmd.Provider}: {providerResult.ErrorMessage}");

        // 2. Check if this Social Login already exists in ExternalLogins
        var user = await _users.GetByExternalLoginAsync(cmd.Provider, providerResult.ProviderUserId, ct);

        if (user is null)
        {
            // 3. User not found by ExternalLogin. Check if they exist by Email.
            user = await _users.GetByEmailAsync(providerResult.Email, ct);

            if (user is not null)
            {
                // Account exists with this email, let's link the social account
                user.AddExternalLogin(cmd.Provider, providerResult.ProviderUserId);
            }
            else
            {
                // 4. Completely new user. Create them.
                user = AppUser.CreateFromSocialLogin(
                    firstName: providerResult.FirstName ?? "User",
                    lastName: providerResult.LastName ?? "",
                    email: providerResult.Email,
                    isEmailConfirmed: true // Socially verified emails are trusted
                );

                // If first user, promote to Admin (as in standard RegisterHandler)
                var hasAdmin = await _users.HasAnyAdminAsync(ct);
                if (!hasAdmin)
                {
                    user.PromoteToAdmin();
                }

                user.AddExternalLogin(cmd.Provider, providerResult.ProviderUserId);
                await _users.AddAsync(user, ct);
            }
        }

        // Generate tokens
        var accessToken = _jwt.GenerateAccessToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();
        var refreshExpiry = DateTime.UtcNow.AddDays(7);
        user.SetRefreshToken(refreshToken, refreshExpiry);
        
        await _users.SaveChangesAsync(ct);

        return new LoginResult(
            accessToken, 
            refreshToken, 
            refreshExpiry, 
            user.Id, 
            user.Email, 
            user.FullName, 
            user.Role.ToString());
    }
}

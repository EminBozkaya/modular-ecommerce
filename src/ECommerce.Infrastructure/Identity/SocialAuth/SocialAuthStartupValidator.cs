using ECommerce.Domain.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ECommerce.Infrastructure.Identity.SocialAuth;

/// <summary>
/// Uygulama başlarken aktif sosyal login provider'larının konfigürasyonunu doğrular.
/// Credential mevcutsa provider aktif sayılır — IsActive flag gerekmez.
/// IServiceScopeFactory kullanılır çünkü IHostedService singleton, provider'lar scoped'dır.
/// </summary>
public sealed class SocialAuthStartupValidator : IHostedService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SocialAuthStartupValidator> _logger;

    public SocialAuthStartupValidator(
        IServiceScopeFactory scopeFactory,
        ILogger<SocialAuthStartupValidator> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var providers = scope.ServiceProvider.GetRequiredService<IEnumerable<ISocialAuthProvider>>().ToList();

        var activeProviders = providers.Where(p => p.IsActive).ToList();

        if (activeProviders.Count == 0)
        {
            _logger.LogInformation("No active social auth providers configured.");
            return Task.CompletedTask;
        }

        foreach (var provider in activeProviders)
        {
            _logger.LogInformation("Social Auth provider '{Provider}' configured successfully.", provider.ProviderName);
        }

        var inactiveProviders = providers.Where(p => !p.IsActive).Select(p => p.ProviderName).ToList();
        if (inactiveProviders.Count > 0)
        {
            _logger.LogInformation(
                "Social Auth providers not configured (missing credentials): {Providers}",
                string.Join(", ", inactiveProviders));
        }

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

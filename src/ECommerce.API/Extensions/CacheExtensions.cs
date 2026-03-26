using ECommerce.Application.Common.Caching;
using ECommerce.Infrastructure.Caching;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace ECommerce.API.Extensions;

public static class CacheExtensions
{
    public static IServiceCollection AddCachingInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var redisConnectionString = configuration.GetConnectionString("Redis") ?? "localhost:6380";

        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var options = ParseRedisConnectionString(redisConnectionString);
            return ConnectionMultiplexer.Connect(options);
        });

        services.AddSingleton<ICacheService, RedisCacheService>();

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));

        return services;
    }

    private static ConfigurationOptions ParseRedisConnectionString(string connectionString)
    {
        // Handle redis:// and rediss:// URI formats (used by Upstash, Railway, etc.)
        if (connectionString.StartsWith("redis://") || connectionString.StartsWith("rediss://"))
        {
            var uri = new Uri(connectionString);
            var options = new ConfigurationOptions
            {
                AbortOnConnectFail = false,
                Ssl = connectionString.StartsWith("rediss://"),
            };

            if (options.Ssl)
                options.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;

            options.EndPoints.Add(uri.Host, uri.Port > 0 ? uri.Port : (options.Ssl ? 6380 : 6379));

            if (!string.IsNullOrEmpty(uri.UserInfo))
            {
                var parts = uri.UserInfo.Split(':', 2);
                if (parts.Length == 2)
                    options.Password = Uri.UnescapeDataString(parts[1]);
            }

            return options;
        }

        // Standard StackExchange.Redis connection string format
        var parsed = ConfigurationOptions.Parse(connectionString);
        parsed.AbortOnConnectFail = false;
        return parsed;
    }
}

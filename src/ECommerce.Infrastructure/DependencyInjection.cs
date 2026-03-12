using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Common.Interfaces;
using ECommerce.Domain.Payment;
using ECommerce.Infrastructure.Identity;
using ECommerce.Infrastructure.Payment;
using ECommerce.Infrastructure.Payment.Providers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace ECommerce.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // JWT — security-rules: httpOnly cookie via API layer, short-lived tokens
        var jwtSection = configuration.GetRequiredSection("Jwt");
        var secret = Environment.GetEnvironmentVariable("JWT__Secret")
            ?? jwtSection["Secret"];

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSection["Issuer"],
                    ValidAudience = jwtSection["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(secret!)),
                    ClockSkew = TimeSpan.Zero,  // Short-lived tokens: no clock skew tolerance
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = ClaimTypes.NameIdentifier
                };

                // Read JWT from httpOnly cookie — security-rules: no localStorage
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        ctx.Token = ctx.Request.Cookies["access_token"];
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        // Services
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IJwtService, JwtService>();

        // Payment — IEnumerable<IPaymentProvider> pattern (no factory needed)
        services.AddHttpClient("Iyzico").ConfigureHttpClient(c => c.Timeout = TimeSpan.FromSeconds(30));
        services.AddHttpClient("PayTR").ConfigureHttpClient(c => c.Timeout = TimeSpan.FromSeconds(30));
        services.AddHttpClient("PayPal").ConfigureHttpClient(c => c.Timeout = TimeSpan.FromSeconds(30));

        services.AddScoped<IPaymentProvider, StubPaymentProvider>();
        services.AddScoped<IPaymentProvider, IyzicoPaymentProvider>();
        services.AddScoped<IPaymentProvider, PayTRPaymentProvider>();
        services.AddScoped<IPaymentProvider, StripePaymentProvider>();
        services.AddScoped<IPaymentProvider, PayPalPaymentProvider>();

        services.AddScoped<PaymentProviderResolver>();

        // Background jobs
        services.AddHostedService<PaymentStartupValidator>();
        services.AddHostedService<PaymentExpirationJob>();

        return services;
    }
}

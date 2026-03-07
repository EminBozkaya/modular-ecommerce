using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Identity;
using ECommerce.Infrastructure.Payment;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
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
                        Encoding.UTF8.GetBytes(jwtSection["Secret"]!)),
                    ClockSkew = TimeSpan.Zero  // Short-lived tokens: no clock skew tolerance
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
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPaymentService, StubPaymentService>();

        return services;
    }
}

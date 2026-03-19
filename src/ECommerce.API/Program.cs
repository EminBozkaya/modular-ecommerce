using ECommerce.Application;
using ECommerce.Infrastructure;
using ECommerce.Persistence;
using ECommerce.API.Middlewares;
using ECommerce.API.Extensions;
using ECommerce.API.Services;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Settings;
using Serilog;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog — backend-rules §4 ──
builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console());

// ── Localization config ──
builder.Services.Configure<LocalizationOptions>(
    builder.Configuration.GetSection(LocalizationOptions.SectionName));
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ILanguageContext, HttpLanguageContext>();

// ── Layer DI registrations ──
// Production note: ConnectionStrings__DefaultConnection environment variable
// automatically overrides appsettings.json (ASP.NET Core env-var convention).
// Set it via Azure Key Vault reference or CI/CD secret injection — never hardcode prod credentials.
builder.Services.AddApplication();
builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddCachingInfrastructure(builder.Configuration);

// ── API services ──
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── CORS whitelist — security-rules ──
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend", p =>
    p.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:3000"])
     .AllowCredentials()
     .AllowAnyHeader()
     .AllowAnyMethod()));

// ── Rate limiting — security-rules: enabled by default ──
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = System.Threading.RateLimiting.PartitionedRateLimiter.Create<HttpContext, string>(
        ctx => System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(
            ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
    // Payment initialize: stricter limit — 5 requests per 10 minutes per user/IP
    options.AddPolicy("PaymentInitialize", context =>
        System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? context.Connection.RemoteIpAddress?.ToString()
                ?? "unknown",
            factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(10)
            }));

    options.RejectionStatusCode = 429;
});

var app = builder.Build();

// ── Automatic Database Migration ──
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ECommerce.Persistence.Context.ApplicationDbContext>();
    await context.Database.MigrateAsync();
    
    // Seed only if 'SeedData' is true in settings (Development default: true)
    if (app.Configuration.GetValue<bool>("SeedData", defaultValue: true))
    {
        await DbInitializer.SeedAsync(context, app.Environment.ContentRootPath);
    }
}

// ── Middleware pipeline ──
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
//app.UseHttpsRedirection();
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

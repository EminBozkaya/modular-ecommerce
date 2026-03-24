using ECommerce.Application.Identity.Commands;
using ECommerce.Application.Identity.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWebHostEnvironment _env;

    public AuthController(IMediator mediator, IWebHostEnvironment env)
    {
        _mediator = mediator;
        _env = env;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand cmd, CancellationToken ct)
    {
        var userId = await _mediator.Send(cmd, ct);

        // Auto-login after registration so frontend gets a session immediately
        var loginResult = await _mediator.Send(new LoginCommand(cmd.Email, cmd.Password), ct);
        SetAuthCookies(loginResult);

        return Ok(new
        {
            user = new
            {
                id = userId,
                email = cmd.Email,
                fullName = loginResult.FullName,
                role = loginResult.Role
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand cmd, CancellationToken ct)
    {
        var result = await _mediator.Send(cmd, ct);
        SetAuthCookies(result);

        return Ok(new
        {
            user = new
            {
                id = result.UserId,
                email = result.Email,
                fullName = result.FullName,
                role = result.Role
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (sub is null || !Guid.TryParse(sub, out var userId)) return Unauthorized();

        var me = await _mediator.Send(new GetMeQuery(userId), ct);
        return me is null ? Unauthorized() : Ok(me);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(CancellationToken ct)
    {
        var refreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

        var result = await _mediator.Send(new RefreshTokenCommand(refreshToken), ct);
        SetAuthCookies(result);

        return Ok(new
        {
            user = new
            {
                id = result.UserId,
                email = result.Email,
                fullName = result.FullName,
                role = result.Role
            }
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = !_env.IsDevelopment(),
            SameSite = _env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Expires = DateTime.UnixEpoch
        };

        Response.Cookies.Delete("access_token", cookieOptions);

        // Refresh token has a specific path, must match to delete
        var refreshOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = !_env.IsDevelopment(),
            SameSite = _env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Path = "/api/auth/refresh",
            Expires = DateTime.UnixEpoch
        };
        Response.Cookies.Delete("refresh_token", refreshOptions);

        return NoContent();
    }

    /// <summary>
    /// Sets httpOnly auth cookies — security-rules: JWT via httpOnly cookies, no localStorage.
    /// Development: Secure=false, SameSite=Lax (Vite proxy makes frontend same-origin as backend).
    /// Staging/Production: Secure=true, SameSite=None (cross-origin — frontend and backend on different domains).
    /// </summary>
    private void SetAuthCookies(LoginResult result)
    {
        bool isDev = _env.IsDevelopment();
        // Only local dev uses insecure/Lax cookies — Vite proxy makes requests same-origin.
        // Staging and Production are cross-origin, so they need Secure + SameSite=None.
        bool secure = !isDev;
        var sameSite = isDev ? SameSiteMode.Lax : SameSiteMode.None;

        Response.Cookies.Append("access_token", result.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = secure,
            SameSite = sameSite,
            MaxAge = TimeSpan.FromMinutes(15)
        });

        Response.Cookies.Append("refresh_token", result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = secure,
            SameSite = sameSite,
            Path = "/api/auth/refresh",
            MaxAge = TimeSpan.FromDays(7)
        });
    }

    [HttpGet("debug-env")]
    public IActionResult DebugEnv()
    {
        return Ok(new
        {
            isDev = _env.IsDevelopment(),
            isHttps = Request.IsHttps,
        });
    }

    [HttpGet("social/providers")]
    public async Task<IActionResult> GetSocialProviders(CancellationToken ct)
    {
        var providers = await _mediator.Send(new GetSocialProvidersQuery(), ct);
        return Ok(providers);
    }

    [HttpGet("social/{provider}/url")]
    public async Task<IActionResult> GetSocialAuthUrl(string provider, [FromQuery] string redirectUri, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetSocialAuthUrlQuery(provider, redirectUri), ct);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.ErrorMessage });

        return Ok(result);
    }

    public record SocialLoginRequest(string Code, string RedirectUri);

    [HttpPost("social/login/{provider}")]
    public async Task<IActionResult> SocialLogin(string provider, [FromBody] SocialLoginRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _mediator.Send(new SocialLoginCommand(provider, req.Code, req.RedirectUri), ct);
            SetAuthCookies(result);

            return Ok(new
            {
                user = new
                {
                    id = result.UserId,
                    email = result.Email,
                    fullName = result.FullName,
                    role = result.Role
                }
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }
}

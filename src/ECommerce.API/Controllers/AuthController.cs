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
    public AuthController(IMediator mediator) => _mediator = mediator;

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
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");
        return NoContent();
    }

    /// <summary>
    /// Sets httpOnly auth cookies — security-rules: JWT via httpOnly cookies, no localStorage.
    /// </summary>
    private void SetAuthCookies(LoginResult result)
    {
        Response.Cookies.Append("access_token", result.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            MaxAge = TimeSpan.FromMinutes(15)
        });

        Response.Cookies.Append("refresh_token", result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth/refresh",
            MaxAge = TimeSpan.FromDays(7)
        });
    }
}

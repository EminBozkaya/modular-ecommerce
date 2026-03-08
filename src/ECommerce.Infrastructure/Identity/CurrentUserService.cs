using System.Security.Claims;
using ECommerce.Domain.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ECommerce.Infrastructure.Identity;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? FullName => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);
}

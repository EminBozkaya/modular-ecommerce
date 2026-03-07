using ECommerce.Domain.Identity.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(AppUser user);
    string GenerateRefreshToken();
    Guid? ValidateRefreshToken(string token);
}

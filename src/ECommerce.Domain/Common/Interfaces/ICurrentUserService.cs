namespace ECommerce.Domain.Common.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? FullName { get; }
}

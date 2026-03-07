using MediatR;

namespace ECommerce.Application.Identity.Commands;

public record RegisterCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password) : IRequest<Guid>;

public record LoginCommand(
    string Email,
    string Password) : IRequest<LoginResult>;

public record LoginResult(
    string AccessToken,
    string RefreshToken,
    DateTime RefreshTokenExpiry,
    Guid UserId,
    string Email,
    string FullName,
    string Role);

public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResult>;

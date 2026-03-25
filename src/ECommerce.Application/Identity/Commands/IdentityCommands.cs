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

public record UpdateProfileCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string? PhoneNumber) : IRequest<UpdateProfileResult>;

public record UpdateProfileResult(string FullName, string FirstName, string LastName, string? PhoneNumber);

public record ChangePasswordCommand(
    Guid UserId,
    string CurrentPassword,
    string NewPassword) : IRequest;

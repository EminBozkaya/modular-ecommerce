using MediatR;

namespace ECommerce.Application.Identity.Queries;

public record UserDto(Guid Id, string FirstName, string LastName, string Email, string Role, DateTime CreatedAt);

public record GetUsersQuery : IRequest<IReadOnlyList<UserDto>>;

public record GetMeQuery(Guid UserId) : IRequest<MeDto?>;
public record MeDto(Guid Id, string Email, string FullName, string Role);

using ECommerce.Domain.Identity;
using MediatR;

namespace ECommerce.Application.Identity.Queries;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, IReadOnlyList<UserDto>>
{
    private readonly IUserRepository _users;
    public GetUsersHandler(IUserRepository users) => _users = users;

    public async Task<IReadOnlyList<UserDto>> Handle(GetUsersQuery q, CancellationToken ct)
    {
        var users = await _users.GetAllAsync(ct);
        return users.Select(u => new UserDto(u.Id, u.FirstName, u.LastName, u.Email, u.Role.ToString(), u.CreatedAt))
            .ToList();
    }
}

public class GetMeHandler : IRequestHandler<GetMeQuery, MeDto?>
{
    private readonly IUserRepository _users;
    public GetMeHandler(IUserRepository users) => _users = users;

    public async Task<MeDto?> Handle(GetMeQuery q, CancellationToken ct)
    {
        var user = await _users.GetByIdAsync(q.UserId, ct);
        return user is null ? null : new MeDto(user.Id, user.Email, user.FullName, user.Role.ToString());
    }
}

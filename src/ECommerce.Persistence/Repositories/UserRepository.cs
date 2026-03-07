using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using ECommerce.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _ctx;

    public UserRepository(ApplicationDbContext ctx) => _ctx = ctx;

    public async Task<AppUser?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _ctx.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public async Task<AppUser?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), ct);

    public async Task<AppUser?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
        => await _ctx.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, ct);

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default)
        => await _ctx.Users.AnyAsync(u => u.Email == email.ToLowerInvariant(), ct);

    public async Task<IReadOnlyList<AppUser>> GetAllAsync(CancellationToken ct = default)
        => await _ctx.Users.AsNoTracking().ToListAsync(ct);

    public async Task AddAsync(AppUser user, CancellationToken ct = default)
        => await _ctx.Users.AddAsync(user, ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _ctx.SaveChangesAsync(ct);
}

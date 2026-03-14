using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using MediatR;

namespace ECommerce.Application.Identity.Commands;

public class AddUserAddressHandler : IRequestHandler<AddUserAddressCommand, Guid>
{
    private readonly IUserAddressRepository _repo;
    public AddUserAddressHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task<Guid> Handle(AddUserAddressCommand cmd, CancellationToken ct)
    {
        // If marked as default, clear existing defaults first (tracked for mutation)
        if (cmd.IsDefault)
        {
            var existing = await _repo.GetByUserIdTrackedAsync(cmd.UserId, ct);
            foreach (var addr in existing.Where(a => a.IsDefault))
                addr.SetDefault(false);
        }

        var address = UserAddress.Create(
            cmd.UserId, cmd.Title, cmd.FullName,
            cmd.AddressLine1, cmd.AddressLine2,
            cmd.City, cmd.PostalCode, cmd.Country,
            cmd.IsDefault, cmd.CountryId, cmd.CityId, cmd.DistrictId);

        await _repo.AddAsync(address, ct);
        await _repo.SaveChangesAsync(ct);
        return address.Id;
    }
}

public class UpdateUserAddressHandler : IRequestHandler<UpdateUserAddressCommand>
{
    private readonly IUserAddressRepository _repo;
    public UpdateUserAddressHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task Handle(UpdateUserAddressCommand cmd, CancellationToken ct)
    {
        var address = await _repo.GetByIdAsync(cmd.AddressId, ct)
            ?? throw new KeyNotFoundException($"Address {cmd.AddressId} not found.");

        if (address.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not have permission to modify this address.");

        address.Update(cmd.Title, cmd.FullName, cmd.AddressLine1, cmd.AddressLine2,
            cmd.City, cmd.PostalCode, cmd.Country,
            cmd.CountryId, cmd.CityId, cmd.DistrictId);

        await _repo.SaveChangesAsync(ct);
    }
}

public class DeleteUserAddressHandler : IRequestHandler<DeleteUserAddressCommand>
{
    private readonly IUserAddressRepository _repo;
    public DeleteUserAddressHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task Handle(DeleteUserAddressCommand cmd, CancellationToken ct)
    {
        var address = await _repo.GetByIdAsync(cmd.AddressId, ct)
            ?? throw new KeyNotFoundException($"Address {cmd.AddressId} not found.");

        if (address.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not have permission to modify this address.");

        // Soft delete is handled by AuditAndSoftDeleteInterceptor
        _repo.Remove(address);
        await _repo.SaveChangesAsync(ct);
    }
}

public class SetDefaultAddressHandler : IRequestHandler<SetDefaultAddressCommand>
{
    private readonly IUserAddressRepository _repo;
    public SetDefaultAddressHandler(IUserAddressRepository repo) => _repo = repo;

    public async Task Handle(SetDefaultAddressCommand cmd, CancellationToken ct)
    {
        // GetByIdAsync returns tracked entity
        var target = await _repo.GetByIdAsync(cmd.AddressId, ct)
            ?? throw new KeyNotFoundException($"Address {cmd.AddressId} not found.");

        if (target.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not have permission to modify this address.");

        // Fetch all user addresses (tracked) to clear existing defaults
        var allTracked = await _repo.GetByUserIdTrackedAsync(cmd.UserId, ct);
        foreach (var addr in allTracked)
            addr.SetDefault(addr.Id == cmd.AddressId);

        await _repo.SaveChangesAsync(ct);
    }
}

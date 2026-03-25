using ECommerce.Domain.Identity;
using ECommerce.Domain.Identity.Entities;
using MediatR;

namespace ECommerce.Application.Identity.Commands;

public class AddUserBillingAddressHandler : IRequestHandler<AddUserBillingAddressCommand, Guid>
{
    private readonly IUserBillingAddressRepository _repo;
    public AddUserBillingAddressHandler(IUserBillingAddressRepository repo) => _repo = repo;

    public async Task<Guid> Handle(AddUserBillingAddressCommand cmd, CancellationToken ct)
    {
        if (cmd.IsDefault)
        {
            var existing = await _repo.GetByUserIdTrackedAsync(cmd.UserId, ct);
            foreach (var addr in existing.Where(a => a.IsDefault))
                addr.SetDefault(false);
        }

        var address = UserBillingAddress.Create(
            cmd.UserId, cmd.Title, cmd.InvoiceType,
            cmd.FullName, cmd.TcKimlikNo,
            cmd.CompanyName, cmd.TaxOffice, cmd.TaxNumber,
            cmd.AddressLine1, cmd.AddressLine2,
            cmd.City, cmd.PostalCode, cmd.Country,
            cmd.IsDefault, cmd.CountryId, cmd.CityId, cmd.DistrictId);

        await _repo.AddAsync(address, ct);
        await _repo.SaveChangesAsync(ct);
        return address.Id;
    }
}

public class UpdateUserBillingAddressHandler : IRequestHandler<UpdateUserBillingAddressCommand>
{
    private readonly IUserBillingAddressRepository _repo;
    public UpdateUserBillingAddressHandler(IUserBillingAddressRepository repo) => _repo = repo;

    public async Task Handle(UpdateUserBillingAddressCommand cmd, CancellationToken ct)
    {
        var address = await _repo.GetByIdAsync(cmd.AddressId, ct: ct)
            ?? throw new KeyNotFoundException($"Billing address {cmd.AddressId} not found.");

        if (address.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not have permission to modify this billing address.");

        address.Update(cmd.Title, cmd.InvoiceType,
            cmd.FullName, cmd.TcKimlikNo,
            cmd.CompanyName, cmd.TaxOffice, cmd.TaxNumber,
            cmd.AddressLine1, cmd.AddressLine2,
            cmd.City, cmd.PostalCode, cmd.Country,
            cmd.CountryId, cmd.CityId, cmd.DistrictId);

        await _repo.SaveChangesAsync(ct);
    }
}

public class DeleteUserBillingAddressHandler : IRequestHandler<DeleteUserBillingAddressCommand>
{
    private readonly IUserBillingAddressRepository _repo;
    public DeleteUserBillingAddressHandler(IUserBillingAddressRepository repo) => _repo = repo;

    public async Task Handle(DeleteUserBillingAddressCommand cmd, CancellationToken ct)
    {
        var address = await _repo.GetByIdAsync(cmd.AddressId, ct: ct)
            ?? throw new KeyNotFoundException($"Billing address {cmd.AddressId} not found.");

        if (address.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not have permission to modify this billing address.");

        _repo.Remove(address);
        await _repo.SaveChangesAsync(ct);
    }
}

public class SetDefaultBillingAddressHandler : IRequestHandler<SetDefaultBillingAddressCommand>
{
    private readonly IUserBillingAddressRepository _repo;
    public SetDefaultBillingAddressHandler(IUserBillingAddressRepository repo) => _repo = repo;

    public async Task Handle(SetDefaultBillingAddressCommand cmd, CancellationToken ct)
    {
        var target = await _repo.GetByIdAsync(cmd.AddressId, ct: ct)
            ?? throw new KeyNotFoundException($"Billing address {cmd.AddressId} not found.");

        if (target.UserId != cmd.UserId)
            throw new UnauthorizedAccessException("You do not have permission to modify this billing address.");

        var allTracked = await _repo.GetByUserIdTrackedAsync(cmd.UserId, ct);
        foreach (var addr in allTracked)
            addr.SetDefault(addr.Id == cmd.AddressId);

        await _repo.SaveChangesAsync(ct);
    }
}

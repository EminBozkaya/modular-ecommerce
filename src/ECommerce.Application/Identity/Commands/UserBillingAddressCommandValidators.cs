using ECommerce.Domain.Ordering.Enums;
using FluentValidation;

namespace ECommerce.Application.Identity.Commands;

public class AddUserBillingAddressCommandValidator : AbstractValidator<AddUserBillingAddressCommand>
{
    public AddUserBillingAddressCommandValidator()
    {
        RuleFor(x => x.UserId).NotEqual(Guid.Empty);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(100);
        RuleFor(x => x.InvoiceType).IsInEnum();

        // Individual (Bireysel)
        When(x => x.InvoiceType == InvoiceType.Individual, () =>
        {
            RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.TcKimlikNo)
                .NotEmpty()
                .Length(11)
                .Matches(@"^\d{11}$").WithMessage("TC Kimlik No must be exactly 11 digits.")
                .Must(BeValidTcKimlikNo).WithMessage("TC Kimlik No is not valid.");
        });

        // Corporate (Kurumsal)
        When(x => x.InvoiceType == InvoiceType.Corporate, () =>
        {
            RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(200);
            RuleFor(x => x.TaxOffice).NotEmpty().MaximumLength(100);
            RuleFor(x => x.TaxNumber)
                .NotEmpty()
                .Length(10)
                .Matches(@"^\d{10}$").WithMessage("Tax Number must be exactly 10 digits.");
        });

        // Common address fields
        RuleFor(x => x.AddressLine1).NotEmpty().MaximumLength(200);
        RuleFor(x => x.AddressLine2).MaximumLength(200).When(x => x.AddressLine2 is not null);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PostalCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
    }

    internal static bool BeValidTcKimlikNoPublic(string? tcKimlik) => BeValidTcKimlikNo(tcKimlik);

    private static bool BeValidTcKimlikNo(string? tcKimlik)
    {
        if (string.IsNullOrWhiteSpace(tcKimlik) || tcKimlik.Length != 11)
            return false;

        if (tcKimlik[0] == '0')
            return false;

        var digits = tcKimlik.Select(c => c - '0').ToArray();

        var oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
        var evenSum = digits[1] + digits[3] + digits[5] + digits[7];
        var d10 = (oddSum * 7 - evenSum) % 10;
        if (d10 < 0) d10 += 10;

        if (digits[9] != d10)
            return false;

        var totalSum = 0;
        for (var i = 0; i < 10; i++)
            totalSum += digits[i];

        return digits[10] == totalSum % 10;
    }
}

public class UpdateUserBillingAddressCommandValidator : AbstractValidator<UpdateUserBillingAddressCommand>
{
    public UpdateUserBillingAddressCommandValidator()
    {
        RuleFor(x => x.AddressId).NotEqual(Guid.Empty);
        RuleFor(x => x.UserId).NotEqual(Guid.Empty);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(100);
        RuleFor(x => x.InvoiceType).IsInEnum();

        When(x => x.InvoiceType == InvoiceType.Individual, () =>
        {
            RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.TcKimlikNo)
                .NotEmpty()
                .Length(11)
                .Matches(@"^\d{11}$").WithMessage("TC Kimlik No must be exactly 11 digits.")
                .Must(AddUserBillingAddressCommandValidator.BeValidTcKimlikNoPublic)
                .WithMessage("TC Kimlik No is not valid.");
        });

        When(x => x.InvoiceType == InvoiceType.Corporate, () =>
        {
            RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(200);
            RuleFor(x => x.TaxOffice).NotEmpty().MaximumLength(100);
            RuleFor(x => x.TaxNumber)
                .NotEmpty()
                .Length(10)
                .Matches(@"^\d{10}$").WithMessage("Tax Number must be exactly 10 digits.");
        });

        RuleFor(x => x.AddressLine1).NotEmpty().MaximumLength(200);
        RuleFor(x => x.AddressLine2).MaximumLength(200).When(x => x.AddressLine2 is not null);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PostalCode).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(100);
    }
}

public class DeleteUserBillingAddressCommandValidator : AbstractValidator<DeleteUserBillingAddressCommand>
{
    public DeleteUserBillingAddressCommandValidator()
    {
        RuleFor(x => x.AddressId).NotEqual(Guid.Empty);
        RuleFor(x => x.UserId).NotEqual(Guid.Empty);
    }
}

public class SetDefaultBillingAddressCommandValidator : AbstractValidator<SetDefaultBillingAddressCommand>
{
    public SetDefaultBillingAddressCommandValidator()
    {
        RuleFor(x => x.AddressId).NotEqual(Guid.Empty);
        RuleFor(x => x.UserId).NotEqual(Guid.Empty);
    }
}

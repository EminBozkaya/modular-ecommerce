using FluentValidation;

namespace ECommerce.Application.Ordering.Commands;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.ShippingAddress)
            .NotEmpty()
            .MinimumLength(10);

        RuleFor(x => x.BillingAddress)
            .MinimumLength(10)
            .When(x => !string.IsNullOrEmpty(x.BillingAddress));

        RuleFor(x => x.GuestEmail)
            .EmailAddress()
            .When(x => !string.IsNullOrEmpty(x.GuestEmail));

        RuleFor(x => x.GuestEmail)
            .NotEmpty()
            .WithMessage("GuestEmail is required when UserId is not provided.")
            .When(x => x.UserId is null);

        RuleFor(x => x)
            .Must(x => x.UserId is not null || !string.IsNullOrWhiteSpace(x.GuestEmail))
            .WithMessage("Either UserId or GuestEmail must be provided.");
    }
}

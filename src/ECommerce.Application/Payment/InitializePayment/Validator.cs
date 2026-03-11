using FluentValidation;

namespace ECommerce.Application.Payment.InitializePayment;

public class InitializePaymentValidator : AbstractValidator<InitializePaymentCommand>
{
    public InitializePaymentValidator()
    {
        RuleFor(x => x.OrderId)
            .NotEmpty().WithMessage("OrderId is required.");

        RuleFor(x => x.ProviderName)
            .NotEmpty().WithMessage("ProviderName is required.");

        RuleFor(x => x.IdempotencyKey)
            .NotEmpty().WithMessage("IdempotencyKey is required.")
            .Must(BeValidGuid).WithMessage("IdempotencyKey must be a valid UUID.");

        RuleFor(x => x.ReturnUrl)
            .NotEmpty().WithMessage("ReturnUrl is required.")
            .Must(BeValidUrl).WithMessage("ReturnUrl must be a valid URL.");

        RuleFor(x => x.CustomerIp)
            .NotEmpty().WithMessage("CustomerIp is required.");
    }

    private static bool BeValidGuid(string key)
        => Guid.TryParse(key, out _);

    private static bool BeValidUrl(string url)
        => Uri.TryCreate(url, UriKind.Absolute, out _);
}

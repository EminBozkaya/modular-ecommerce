using FluentValidation;

namespace ECommerce.Application.Payment.VerifyPaymentWebhook;

public class VerifyPaymentWebhookValidator : AbstractValidator<VerifyPaymentWebhookCommand>
{
    public VerifyPaymentWebhookValidator()
    {
        RuleFor(x => x.ProviderName)
            .NotEmpty().WithMessage("ProviderName is required.");

        RuleFor(x => x.RawBody)
            .NotEmpty().WithMessage("Webhook body cannot be empty.");
    }
}

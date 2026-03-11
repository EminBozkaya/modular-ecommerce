using FluentValidation;

namespace ECommerce.Application.Payment.RefundPayment;

public class RefundPaymentValidator : AbstractValidator<RefundPaymentCommand>
{
    public RefundPaymentValidator()
    {
        RuleFor(x => x.OrderId)
            .NotEmpty().WithMessage("OrderId is required.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Refund amount must be positive.")
            .When(x => x.Amount.HasValue);
    }
}

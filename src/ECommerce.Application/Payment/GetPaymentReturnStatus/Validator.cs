using FluentValidation;

namespace ECommerce.Application.Payment.GetPaymentReturnStatus;

public class GetPaymentReturnStatusQueryValidator : AbstractValidator<GetPaymentReturnStatusQuery>
{
    public GetPaymentReturnStatusQueryValidator()
    {
        RuleFor(x => x.OrderId).NotEqual(Guid.Empty);
    }
}

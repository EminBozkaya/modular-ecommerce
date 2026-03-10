using FluentValidation;

namespace ECommerce.Application.Basket.Commands;

public class AddToBasketCommandValidator : AbstractValidator<AddToBasketCommand>
{
    public AddToBasketCommandValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

public class UpdateBasketItemCommandValidator : AbstractValidator<UpdateBasketItemCommand>
{
    public UpdateBasketItemCommandValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

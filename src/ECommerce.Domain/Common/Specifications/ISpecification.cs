using System.Linq.Expressions;

namespace ECommerce.Domain.Common.Specifications;

public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria { get; }
    List<Expression<Func<T, object>>> Includes { get; }
    /// <summary>String-path includes for nested navigation, e.g. "Unit.Translations"</summary>
    List<string> IncludeStrings { get; }
    Expression<Func<T, object>>? OrderBy { get; }
    Expression<Func<T, object>>? OrderByDescending { get; }

    int? Skip { get; }
    int? Take { get; }
    bool IsPagingEnabled { get; }
    bool IgnoreQueryFilters { get; }
}

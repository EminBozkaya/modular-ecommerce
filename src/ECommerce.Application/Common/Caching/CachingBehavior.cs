using MediatR;
using Microsoft.Extensions.Logging;

namespace ECommerce.Application.Common.Caching;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(ICacheService cacheService, ILogger<CachingBehavior<TRequest, TResponse>> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not ICacheableQuery cacheableQuery)
        {
            return await next();
        }

        var cacheKey = cacheableQuery.CacheKey;
        var cachedResponse = await _cacheService.GetAsync<TResponse>(cacheKey, cancellationToken);
        
        if (cachedResponse is not null)
        {
            _logger.LogInformation("Fetched request {Name} from cache. CacheKey: {CacheKey}", typeof(TRequest).Name, cacheKey);
            return cachedResponse;
        }

        var response = await next();

        await _cacheService.SetAsync(cacheKey, response, cacheableQuery.Expiration, cancellationToken);
        _logger.LogInformation("Set request {Name} to cache. CacheKey: {CacheKey}", typeof(TRequest).Name, cacheKey);

        return response;
    }
}

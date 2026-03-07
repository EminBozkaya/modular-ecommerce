using System.Text.Json;
using ECommerce.Application.Common.Caching;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace ECommerce.Infrastructure.Caching;

public class RedisCacheService : ICacheService
{
    private readonly IConnectionMultiplexer _connectionMultiplexer;
    private readonly ILogger<RedisCacheService> _logger;
    private readonly IDatabase _database;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public RedisCacheService(IConnectionMultiplexer connectionMultiplexer, ILogger<RedisCacheService> logger)
    {
        _connectionMultiplexer = connectionMultiplexer;
        _logger = logger;
        _database = _connectionMultiplexer.GetDatabase();

        _jsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            var cachedResponse = await _database.StringGetAsync(key);
            
            if (cachedResponse.IsNullOrEmpty)
            {
                return default;
            }

            var jsonString = cachedResponse.ToString();
            return JsonSerializer.Deserialize<T>(jsonString, _jsonSerializerOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not get cached value for key {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var serializedResponse = JsonSerializer.Serialize(value, _jsonSerializerOptions);
            if (expiration.HasValue)
            {
                await _database.StringSetAsync(key, serializedResponse, expiration.Value);
            }
            else
            {
                await _database.StringSetAsync(key, serializedResponse);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not set cached value for key {Key}", key);
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            await _database.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not remove cached value for key {Key}", key);
        }
    }

    public async Task RemoveByPrefixAsync(string prefixKey, CancellationToken cancellationToken = default)
    {
        try
        {
            var endpoint = _connectionMultiplexer.GetEndPoints().FirstOrDefault();
            if (endpoint == null)
            {
                return;
            }

            var server = _connectionMultiplexer.GetServer(endpoint);
            var keys = server.Keys(pattern: $"{prefixKey}*").ToArray();

            if (keys.Length > 0)
            {
                await _database.KeyDeleteAsync(keys);
                _logger.LogInformation("Removed {Count} cache keys with prefix {PrefixKey}", keys.Length, prefixKey);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not remove cached values by prefix {PrefixKey}", prefixKey);
        }
    }
}

using FluentValidation;
using System.Net;
using System.Text.Json;

namespace ECommerce.API.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";

        var statusCode = ex switch
        {
            ValidationException => HttpStatusCode.BadRequest,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            KeyNotFoundException => HttpStatusCode.NotFound,
            InvalidOperationException => HttpStatusCode.BadRequest,
            ArgumentException => HttpStatusCode.BadRequest,
            _ => HttpStatusCode.InternalServerError
        };

        context.Response.StatusCode = (int)statusCode;

        object response;
        if (ex is ValidationException ve)
        {
            response = new
            {
                status = (int)statusCode,
                message = "Validation failed.",
                errors = ve.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(x => x.ErrorMessage).ToArray()
                    )
            };
        }
        else
        {
            response = new
            {
                status = (int)statusCode,
                message = statusCode == HttpStatusCode.InternalServerError
                    ? "An unexpected error occurred."
                    : ex.Message
            };
        }

        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(ex, "Unhandled exception");
        else
            _logger.LogWarning("Handled exception ({StatusCode}): {Message}", (int)statusCode, ex.Message);

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}

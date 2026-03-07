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
        var (statusCode, message) = ex switch
        {
            ValidationException ve => (HttpStatusCode.BadRequest, string.Join("; ", ve.Errors.Select(e => e.ErrorMessage))),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Unauthorized."),
            KeyNotFoundException ke => (HttpStatusCode.NotFound, ke.Message),
            InvalidOperationException ioe => (HttpStatusCode.BadRequest, ioe.Message),
            ArgumentException ae => (HttpStatusCode.BadRequest, ae.Message),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
        };

        // backend-rules §4: Sensitive data MUST NOT be logged
        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(ex, "Unhandled exception");
        else
            _logger.LogWarning("Handled exception ({StatusCode}): {Message}", (int)statusCode, message);

        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            status = (int)statusCode,
            error = message
        }));
    }
}

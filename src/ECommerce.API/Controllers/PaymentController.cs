using ECommerce.Application.Payment.GetActivePaymentProviders;
using ECommerce.Application.Payment.GetPaymentReturnStatus;
using ECommerce.Application.Payment.InitializePayment;
using ECommerce.Application.Payment.RefundPayment;
using ECommerce.Application.Payment.VerifyPaymentWebhook;
using ECommerce.Application.Payment.VerifyPaymentCallback;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IConfiguration _config;

    public PaymentController(IMediator mediator, IConfiguration config)
    {
        _mediator = mediator;
        _config = config;
    }

    /// <summary>Returns all active payment providers for the checkout page.</summary>
    [HttpGet("providers")]
    [Authorize]
    public async Task<IActionResult> GetProviders(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetActivePaymentProvidersQuery(), ct);
        return Ok(result);
    }

    /// <summary>Initiates 3D Secure payment — returns RedirectUrl to provider page.</summary>
    [HttpPost("initialize")]
    [Authorize]
    [EnableRateLimiting("PaymentInitialize")]
    public async Task<IActionResult> InitializePayment(
        [FromBody] InitializePaymentRequest request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var customerIp = GetClientIp();

        var command = new InitializePaymentCommand(
            OrderId: request.OrderId,
            ProviderName: request.ProviderName,
            IdempotencyKey: request.IdempotencyKey,
            ReturnUrl: request.ReturnUrl,
            UserId: userId,
            GuestEmail: null,
            CustomerIp: customerIp);

        var result = await _mediator.Send(command, ct);
        return Ok(result);
    }

    /// <summary>
    /// Webhook — server-to-server payment notification from provider.
    /// [AllowAnonymous] because provider calls this directly.
    /// </summary>
    [HttpPost("webhook/{provider}")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook(string provider, CancellationToken ct)
    {
        // Raw body must be read for Stripe signature verification
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync(ct);

        var headers = Request.Headers.ToDictionary(
            h => h.Key,
            h => h.Value.ToString(),
            StringComparer.OrdinalIgnoreCase);

        var command = new VerifyPaymentWebhookCommand(provider, rawBody, headers);
        var result = await _mediator.Send(command, ct);

        // Always return 200 to prevent provider retries on application errors
        return result.IsSuccess ? Ok() : BadRequest(new { error = result.ErrorMessage });
    }

    /// <summary>
    /// User browser return after 3D Secure / Payment Form. Handles both GET (Stub, Stripe return) and POST (Iyzico callback).
    /// Redirects to appropriate frontend page based on verified payment status.
    /// </summary>
    [HttpGet("callback/{provider}")]
    [HttpPost("callback/{provider}")]
    [AllowAnonymous]
    public async Task<IActionResult> Callback(
        string provider,
        [FromQuery] string orderId,
        [FromForm] string? token,
        [FromQuery] string? providerRef,
        CancellationToken ct)
    {
        var frontendBaseUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";

        if (!Guid.TryParse(orderId, out var orderGuid))
            return Redirect($"{frontendBaseUrl}/checkout?error=invalid_order");

        var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString(), StringComparer.OrdinalIgnoreCase);

        // Verify the payment provider response
        var command = new VerifyPaymentCallbackCommand(orderGuid, provider, token ?? providerRef, headers);
        var result = await _mediator.Send(command, ct);

        try
        {
            var redirectUrl = result.IsSuccess 
                ? $"{frontendBaseUrl}/payment/waiting?orderId={orderId}" // Next step confirms it's fully paid
                : $"{frontendBaseUrl}/checkout?error=payment_failed&orderId={orderId}";

            return Redirect(redirectUrl);
        }
        catch
        {
            return Redirect($"{frontendBaseUrl}/checkout?error=payment_failed&orderId={orderId}");
        }
    }

    /// <summary>Returns payment status for polling on the waiting page.</summary>
    [HttpGet("return-status")]
    [AllowAnonymous]
    public async Task<IActionResult> ReturnStatus(
        [FromQuery] string orderId,
        CancellationToken ct)
    {
        if (!Guid.TryParse(orderId, out var orderGuid))
            return BadRequest("Invalid orderId.");

        var userId = GetCurrentUserId();
        var query = new GetPaymentReturnStatusQuery(orderGuid, userId);
        var result = await _mediator.Send(query, ct);
        return Ok(result);
    }

    /// <summary>Initiates a refund — admin only.</summary>
    [HttpPost("{orderId}/refund")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Refund(
        Guid orderId,
        [FromBody] RefundPaymentRequest? request,
        CancellationToken ct)
    {
        var command = new RefundPaymentCommand(orderId, request?.Amount);
        var result = await _mediator.Send(command, ct);
        return Ok(result);
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    private string GetClientIp()
    {
        // X-Forwarded-For aware (reverse proxy)
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwardedFor))
            return forwardedFor.Split(',')[0].Trim();
        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}

// Request DTOs — controller binding only, no business logic
public record InitializePaymentRequest(
    Guid OrderId,
    string ProviderName,
    string IdempotencyKey,
    string ReturnUrl);

public record RefundPaymentRequest(decimal? Amount);

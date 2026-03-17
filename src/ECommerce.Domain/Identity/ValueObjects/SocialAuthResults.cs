namespace ECommerce.Domain.Identity;

/// <summary>OAuth authorization URL sonucu.</summary>
public record SocialAuthUrlResult(
    bool IsSuccess,
    string? AuthorizationUrl,
    string? State,
    string? ErrorMessage);

/// <summary>OAuth code exchange sonrası dönen kullanıcı bilgisi.</summary>
public record SocialAuthResult(
    bool IsSuccess,
    string? ProviderUserId,
    string? Email,
    string? FirstName,
    string? LastName,
    string? AvatarUrl,
    string? ErrorCode,
    string? ErrorMessage);

using ECommerce.Domain.Identity;
using MediatR;

namespace ECommerce.Application.Identity.Commands;

/// <summary>Aktif sosyal provider'ların listesini döndürür.</summary>
public record GetSocialProvidersQuery() : IRequest<List<SocialProviderDto>>;

public record SocialProviderDto(string ProviderName, string DisplayName);


/// <summary>Belirtilen provider için OAuth yetkilendirme URL'sini döndürür.</summary>
public record GetSocialAuthUrlQuery(string Provider, string RedirectUri) : IRequest<SocialAuthUrlResult>;


/// <summary>
/// Sosyal platformdan alınan `code` parametresini işleyip
/// kullanıcı eşleştirmesini yapar ve JWT döndürür.
/// </summary>
public record SocialLoginCommand(string Provider, string Code, string RedirectUri) : IRequest<LoginResult>;

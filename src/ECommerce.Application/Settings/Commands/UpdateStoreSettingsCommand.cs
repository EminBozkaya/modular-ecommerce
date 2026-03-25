using System.Text.Json;
using ECommerce.Application.Common.Caching;
using ECommerce.Application.Settings.Dtos;
using ECommerce.Domain.Settings;
using ECommerce.Domain.Settings.Entities;
using MediatR;

namespace ECommerce.Application.Settings.Commands;

public record UpdateStoreSettingsCommand(
    string? ImageBase64,
    string StoreName,
    bool ShowStoreNameInHeader,
    // area colors
    string PrimaryColor,
    string HeaderBackgroundColor,
    string BannerBackgroundColor,
    string BackgroundColor,
    string AdminSidebarBackgroundColor,
    string AdminPageBackgroundColor,
    // banner
    string FreeShippingBannerText,
    bool FreeShippingBannerVisible,
    bool FreeShippingBannerMarquee,
    int FreeShippingBannerMarqueeSpeed,
    // background pattern
    string? BackgroundPatternBase64,
    int BackgroundPatternOpacity,
    // text colors
    string NavbarActiveColor,
    string NavbarMenuTextColor,
    string StoreNameColor,
    string AvatarTextColor,
    string HeaderIconTextColor,
    string BannerTextColor,
    string PageTitleColor,
    string ProductCardCategoryColor,
    string ProductCardNameColor,
    string ProductCardQuantityColor,
    string ProductCardTotalColor,
    string ProductCardPriceColor,
    string ProductCardButtonColor,
    string AdminSidebarTextColor,
    string AdminPageTitleColor,
    string FooterTextColor,
    // fonts
    string StoreNameFont,
    string AvatarTextFont,
    string HeaderIconTextFont,
    string NavbarMenuTextFont,
    string BannerTextFont,
    string PageTitleFont,
    string ProductCardCategoryFont,
    string ProductCardNameFont,
    string ProductCardQuantityFont,
    string ProductCardTotalFont,
    string ProductCardPriceFont,
    string ProductCardButtonFont,
    string AdminSidebarTextFont,
    string AdminPageTitleFont,
    string FooterTextFont,
    // rich content
    HeroCarouselDto? HeroCarousel,
    List<HomepageSectionDto>? HomepageSections,
    FooterSettingsDto? Footer,
    // localization
    Dictionary<string, Dictionary<string, string>>? Translations = null
) : IRequest;

public class UpdateStoreSettingsHandler : IRequestHandler<UpdateStoreSettingsCommand>
{
    private readonly IStoreSettingsRepository _repo;
    private readonly ICacheService _cache;

    public UpdateStoreSettingsHandler(IStoreSettingsRepository repo, ICacheService cache)
    {
        _repo = repo;
        _cache = cache;
    }

    public async Task Handle(UpdateStoreSettingsCommand cmd, CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(new
        {
            cmd.StoreName,
            cmd.ShowStoreNameInHeader,
            cmd.PrimaryColor,
            cmd.HeaderBackgroundColor,
            cmd.BannerBackgroundColor,
            cmd.BackgroundColor,
            cmd.AdminSidebarBackgroundColor,
            cmd.AdminPageBackgroundColor,
            cmd.FreeShippingBannerText,
            cmd.FreeShippingBannerVisible,
            cmd.FreeShippingBannerMarquee,
            cmd.FreeShippingBannerMarqueeSpeed,
            cmd.BackgroundPatternBase64,
            cmd.BackgroundPatternOpacity,
            cmd.NavbarActiveColor,
            cmd.NavbarMenuTextColor,
            cmd.StoreNameColor,
            cmd.AvatarTextColor,
            cmd.HeaderIconTextColor,
            cmd.BannerTextColor,
            cmd.PageTitleColor,
            cmd.ProductCardCategoryColor,
            cmd.ProductCardNameColor,
            cmd.ProductCardQuantityColor,
            cmd.ProductCardTotalColor,
            cmd.ProductCardPriceColor,
            cmd.ProductCardButtonColor,
            cmd.AdminSidebarTextColor,
            cmd.AdminPageTitleColor,
            cmd.FooterTextColor,
            cmd.StoreNameFont,
            cmd.AvatarTextFont,
            cmd.HeaderIconTextFont,
            cmd.NavbarMenuTextFont,
            cmd.BannerTextFont,
            cmd.PageTitleFont,
            cmd.ProductCardCategoryFont,
            cmd.ProductCardNameFont,
            cmd.ProductCardQuantityFont,
            cmd.ProductCardTotalFont,
            cmd.ProductCardPriceFont,
            cmd.ProductCardButtonFont,
            cmd.AdminSidebarTextFont,
            cmd.AdminPageTitleFont,
            cmd.FooterTextFont,
            cmd.HeroCarousel,
            cmd.HomepageSections,
            cmd.Footer,
            cmd.Translations
        }, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        var existing = await _repo.GetAsync(ct);
        if (existing is null)
        {
            var created = StoreSettings.Create(cmd.ImageBase64, json);
            await _repo.AddAsync(created, ct);
        }
        else
        {
            existing.Update(cmd.ImageBase64, json);
        }

        await _repo.SaveChangesAsync(ct);
        await _cache.RemoveAsync("store:settings", ct);
    }
}

using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

public record FooterLinkDto(string Id, string Label, string Url, int Order, Dictionary<string, Dictionary<string, string>>? Translations = null);
public record FooterColumnDto(string Id, string Type, string Title, int Order, bool Enabled, List<FooterLinkDto>? Links, string? Address, string? Phone, string? Email, List<FooterSocialLinkDto>? SocialLinks, string? FollowText, bool? ShowLogo, string? Description, Dictionary<string, Dictionary<string, string>>? Translations = null);
public record FooterSocialLinkDto(string Id, string Platform, string Url);
public record FooterSettingsDto(List<FooterColumnDto> Columns, string? BackgroundColor, string? TextColor, string? CopyrightText, string? BottomBarAlignment, List<FooterBottomLinkDto> BottomLinks, Dictionary<string, Dictionary<string, string>>? Translations = null);
public record FooterBottomLinkDto(string Id, string Label, string Url, int Order, Dictionary<string, Dictionary<string, string>>? Translations = null);

public record SettingsData(FooterData? Footer);
public record FooterData(List<FooterColumnData>? Columns);
public record FooterColumnData(string? Title, [JsonPropertyName("translations")] Dictionary<string, Dictionary<string, string>>? Translations);

var translations = new Dictionary<string, Dictionary<string, string>> {
    { "en", new Dictionary<string, string> { { "title", "EN TITLE" } } }
};

var col = new FooterColumnDto("1", "links", "TR TITLE", 0, true, null, null, null, null, null, null, null, null, translations);
var footer = new FooterSettingsDto(new List<FooterColumnDto> { col }, null, null, "Copyright", "between", new List<FooterBottomLinkDto>());

var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
var json = JsonSerializer.Serialize(new { Footer = footer }, options);

Console.WriteLine("JSON Output:");
Console.WriteLine(json);

var deserialized = JsonSerializer.Deserialize<SettingsData>(json, options);
var firstCol = deserialized?.Footer?.Columns?[0];

Console.WriteLine($"\nDeserialized Col Title: {firstCol?.Title}");
Console.WriteLine($"Deserialized Col Translations null? {firstCol?.Translations == null}");

if (firstCol?.Translations != null) {
    foreach (var lang in firstCol.Translations) {
        Console.WriteLine($"  Lang: {lang.Key}");
        foreach (var field in lang.Value) {
            Console.WriteLine($"    Field: {field.Key}, Value: {field.Value}");
        }
    }
}

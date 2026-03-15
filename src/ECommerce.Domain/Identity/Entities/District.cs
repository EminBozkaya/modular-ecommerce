namespace ECommerce.Domain.Identity.Entities;

public class District
{
    public int Id { get; private set; }
    public int CityId { get; private set; }
    public string Name { get; private set; } = null!;

    // Navigation
    public City City { get; private set; } = null!;

    private District() { }

    public static District Create(int cityId, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new District
        {
            CityId = cityId,
            Name = name
        };
    }
}

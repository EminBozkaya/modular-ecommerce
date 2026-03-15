namespace ECommerce.Domain.Identity.Entities;

public class Country
{
    public int Id { get; private set; }
    public string Name { get; private set; } = null!;
    public string IsoCode { get; private set; } = null!;

    // Navigation
    public ICollection<City> Cities { get; private set; } = new List<City>();

    private Country() { }

    public static Country Create(string name, string isoCode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(isoCode);

        return new Country
        {
            Name = name,
            IsoCode = isoCode
        };
    }
}

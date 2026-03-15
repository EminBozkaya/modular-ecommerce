namespace ECommerce.Domain.Identity.Entities;

public class City
{
    public int Id { get; private set; }
    public int CountryId { get; private set; }
    public string Name { get; private set; } = null!;
    public int PlateCode { get; private set; }

    // Navigation
    public Country Country { get; private set; } = null!;
    public ICollection<District> Districts { get; private set; } = new List<District>();

    private City() { }

    public static City Create(int countryId, string name, int plateCode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new City
        {
            CountryId = countryId,
            Name = name,
            PlateCode = plateCode
        };
    }
}

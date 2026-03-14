using ECommerce.Domain.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Persistence.Configurations.Seed;

/// <summary>
/// Seeds all 81 cities of Turkey with plate codes.
/// </summary>
public class CitySeedConfiguration : IEntityTypeConfiguration<City>
{
    private const int TurkeyId = 1;

    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.HasData(
            new { Id = 1,  CountryId = TurkeyId, Name = "Adana",          PlateCode = 1  },
            new { Id = 2,  CountryId = TurkeyId, Name = "Adıyaman",       PlateCode = 2  },
            new { Id = 3,  CountryId = TurkeyId, Name = "Afyonkarahisar", PlateCode = 3  },
            new { Id = 4,  CountryId = TurkeyId, Name = "Ağrı",           PlateCode = 4  },
            new { Id = 5,  CountryId = TurkeyId, Name = "Amasya",         PlateCode = 5  },
            new { Id = 6,  CountryId = TurkeyId, Name = "Ankara",         PlateCode = 6  },
            new { Id = 7,  CountryId = TurkeyId, Name = "Antalya",        PlateCode = 7  },
            new { Id = 8,  CountryId = TurkeyId, Name = "Artvin",         PlateCode = 8  },
            new { Id = 9,  CountryId = TurkeyId, Name = "Aydın",          PlateCode = 9  },
            new { Id = 10, CountryId = TurkeyId, Name = "Balıkesir",      PlateCode = 10 },
            new { Id = 11, CountryId = TurkeyId, Name = "Bilecik",        PlateCode = 11 },
            new { Id = 12, CountryId = TurkeyId, Name = "Bingöl",         PlateCode = 12 },
            new { Id = 13, CountryId = TurkeyId, Name = "Bitlis",         PlateCode = 13 },
            new { Id = 14, CountryId = TurkeyId, Name = "Bolu",           PlateCode = 14 },
            new { Id = 15, CountryId = TurkeyId, Name = "Burdur",         PlateCode = 15 },
            new { Id = 16, CountryId = TurkeyId, Name = "Bursa",          PlateCode = 16 },
            new { Id = 17, CountryId = TurkeyId, Name = "Çanakkale",      PlateCode = 17 },
            new { Id = 18, CountryId = TurkeyId, Name = "Çankırı",        PlateCode = 18 },
            new { Id = 19, CountryId = TurkeyId, Name = "Çorum",          PlateCode = 19 },
            new { Id = 20, CountryId = TurkeyId, Name = "Denizli",        PlateCode = 20 },
            new { Id = 21, CountryId = TurkeyId, Name = "Diyarbakır",     PlateCode = 21 },
            new { Id = 22, CountryId = TurkeyId, Name = "Edirne",         PlateCode = 22 },
            new { Id = 23, CountryId = TurkeyId, Name = "Elazığ",         PlateCode = 23 },
            new { Id = 24, CountryId = TurkeyId, Name = "Erzincan",       PlateCode = 24 },
            new { Id = 25, CountryId = TurkeyId, Name = "Erzurum",        PlateCode = 25 },
            new { Id = 26, CountryId = TurkeyId, Name = "Eskişehir",      PlateCode = 26 },
            new { Id = 27, CountryId = TurkeyId, Name = "Gaziantep",      PlateCode = 27 },
            new { Id = 28, CountryId = TurkeyId, Name = "Giresun",        PlateCode = 28 },
            new { Id = 29, CountryId = TurkeyId, Name = "Gümüşhane",      PlateCode = 29 },
            new { Id = 30, CountryId = TurkeyId, Name = "Hakkari",        PlateCode = 30 },
            new { Id = 31, CountryId = TurkeyId, Name = "Hatay",          PlateCode = 31 },
            new { Id = 32, CountryId = TurkeyId, Name = "Isparta",        PlateCode = 32 },
            new { Id = 33, CountryId = TurkeyId, Name = "Mersin",         PlateCode = 33 },
            new { Id = 34, CountryId = TurkeyId, Name = "İstanbul",       PlateCode = 34 },
            new { Id = 35, CountryId = TurkeyId, Name = "İzmir",          PlateCode = 35 },
            new { Id = 36, CountryId = TurkeyId, Name = "Kars",           PlateCode = 36 },
            new { Id = 37, CountryId = TurkeyId, Name = "Kastamonu",      PlateCode = 37 },
            new { Id = 38, CountryId = TurkeyId, Name = "Kayseri",        PlateCode = 38 },
            new { Id = 39, CountryId = TurkeyId, Name = "Kırklareli",     PlateCode = 39 },
            new { Id = 40, CountryId = TurkeyId, Name = "Kırşehir",       PlateCode = 40 },
            new { Id = 41, CountryId = TurkeyId, Name = "Kocaeli",        PlateCode = 41 },
            new { Id = 42, CountryId = TurkeyId, Name = "Konya",          PlateCode = 42 },
            new { Id = 43, CountryId = TurkeyId, Name = "Kütahya",        PlateCode = 43 },
            new { Id = 44, CountryId = TurkeyId, Name = "Malatya",        PlateCode = 44 },
            new { Id = 45, CountryId = TurkeyId, Name = "Manisa",         PlateCode = 45 },
            new { Id = 46, CountryId = TurkeyId, Name = "Kahramanmaraş",  PlateCode = 46 },
            new { Id = 47, CountryId = TurkeyId, Name = "Mardin",         PlateCode = 47 },
            new { Id = 48, CountryId = TurkeyId, Name = "Muğla",          PlateCode = 48 },
            new { Id = 49, CountryId = TurkeyId, Name = "Muş",            PlateCode = 49 },
            new { Id = 50, CountryId = TurkeyId, Name = "Nevşehir",       PlateCode = 50 },
            new { Id = 51, CountryId = TurkeyId, Name = "Niğde",          PlateCode = 51 },
            new { Id = 52, CountryId = TurkeyId, Name = "Ordu",           PlateCode = 52 },
            new { Id = 53, CountryId = TurkeyId, Name = "Rize",           PlateCode = 53 },
            new { Id = 54, CountryId = TurkeyId, Name = "Sakarya",        PlateCode = 54 },
            new { Id = 55, CountryId = TurkeyId, Name = "Samsun",         PlateCode = 55 },
            new { Id = 56, CountryId = TurkeyId, Name = "Siirt",          PlateCode = 56 },
            new { Id = 57, CountryId = TurkeyId, Name = "Sinop",          PlateCode = 57 },
            new { Id = 58, CountryId = TurkeyId, Name = "Sivas",          PlateCode = 58 },
            new { Id = 59, CountryId = TurkeyId, Name = "Tekirdağ",       PlateCode = 59 },
            new { Id = 60, CountryId = TurkeyId, Name = "Tokat",          PlateCode = 60 },
            new { Id = 61, CountryId = TurkeyId, Name = "Trabzon",        PlateCode = 61 },
            new { Id = 62, CountryId = TurkeyId, Name = "Tunceli",        PlateCode = 62 },
            new { Id = 63, CountryId = TurkeyId, Name = "Şanlıurfa",      PlateCode = 63 },
            new { Id = 64, CountryId = TurkeyId, Name = "Uşak",           PlateCode = 64 },
            new { Id = 65, CountryId = TurkeyId, Name = "Van",            PlateCode = 65 },
            new { Id = 66, CountryId = TurkeyId, Name = "Yozgat",         PlateCode = 66 },
            new { Id = 67, CountryId = TurkeyId, Name = "Zonguldak",      PlateCode = 67 },
            new { Id = 68, CountryId = TurkeyId, Name = "Aksaray",        PlateCode = 68 },
            new { Id = 69, CountryId = TurkeyId, Name = "Bayburt",        PlateCode = 69 },
            new { Id = 70, CountryId = TurkeyId, Name = "Karaman",        PlateCode = 70 },
            new { Id = 71, CountryId = TurkeyId, Name = "Kırıkkale",      PlateCode = 71 },
            new { Id = 72, CountryId = TurkeyId, Name = "Batman",         PlateCode = 72 },
            new { Id = 73, CountryId = TurkeyId, Name = "Şırnak",         PlateCode = 73 },
            new { Id = 74, CountryId = TurkeyId, Name = "Bartın",         PlateCode = 74 },
            new { Id = 75, CountryId = TurkeyId, Name = "Ardahan",        PlateCode = 75 },
            new { Id = 76, CountryId = TurkeyId, Name = "Iğdır",          PlateCode = 76 },
            new { Id = 77, CountryId = TurkeyId, Name = "Yalova",         PlateCode = 77 },
            new { Id = 78, CountryId = TurkeyId, Name = "Karabük",        PlateCode = 78 },
            new { Id = 79, CountryId = TurkeyId, Name = "Kilis",          PlateCode = 79 },
            new { Id = 80, CountryId = TurkeyId, Name = "Osmaniye",       PlateCode = 80 },
            new { Id = 81, CountryId = TurkeyId, Name = "Düzce",          PlateCode = 81 }
        );
    }
}

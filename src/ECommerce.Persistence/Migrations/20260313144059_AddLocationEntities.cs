using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerce.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "UserAddresses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "UserAddresses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "UserAddresses",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsoCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CountryId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PlateCode = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cities_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Districts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CityId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Districts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Districts_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Id", "IsoCode", "Name" },
                values: new object[] { 1, "TR", "Türkiye" });

            migrationBuilder.InsertData(
                table: "Cities",
                columns: new[] { "Id", "CountryId", "Name", "PlateCode" },
                values: new object[,]
                {
                    { 1, 1, "Adana", 1 },
                    { 2, 1, "Adıyaman", 2 },
                    { 3, 1, "Afyonkarahisar", 3 },
                    { 4, 1, "Ağrı", 4 },
                    { 5, 1, "Amasya", 5 },
                    { 6, 1, "Ankara", 6 },
                    { 7, 1, "Antalya", 7 },
                    { 8, 1, "Artvin", 8 },
                    { 9, 1, "Aydın", 9 },
                    { 10, 1, "Balıkesir", 10 },
                    { 11, 1, "Bilecik", 11 },
                    { 12, 1, "Bingöl", 12 },
                    { 13, 1, "Bitlis", 13 },
                    { 14, 1, "Bolu", 14 },
                    { 15, 1, "Burdur", 15 },
                    { 16, 1, "Bursa", 16 },
                    { 17, 1, "Çanakkale", 17 },
                    { 18, 1, "Çankırı", 18 },
                    { 19, 1, "Çorum", 19 },
                    { 20, 1, "Denizli", 20 },
                    { 21, 1, "Diyarbakır", 21 },
                    { 22, 1, "Edirne", 22 },
                    { 23, 1, "Elazığ", 23 },
                    { 24, 1, "Erzincan", 24 },
                    { 25, 1, "Erzurum", 25 },
                    { 26, 1, "Eskişehir", 26 },
                    { 27, 1, "Gaziantep", 27 },
                    { 28, 1, "Giresun", 28 },
                    { 29, 1, "Gümüşhane", 29 },
                    { 30, 1, "Hakkari", 30 },
                    { 31, 1, "Hatay", 31 },
                    { 32, 1, "Isparta", 32 },
                    { 33, 1, "Mersin", 33 },
                    { 34, 1, "İstanbul", 34 },
                    { 35, 1, "İzmir", 35 },
                    { 36, 1, "Kars", 36 },
                    { 37, 1, "Kastamonu", 37 },
                    { 38, 1, "Kayseri", 38 },
                    { 39, 1, "Kırklareli", 39 },
                    { 40, 1, "Kırşehir", 40 },
                    { 41, 1, "Kocaeli", 41 },
                    { 42, 1, "Konya", 42 },
                    { 43, 1, "Kütahya", 43 },
                    { 44, 1, "Malatya", 44 },
                    { 45, 1, "Manisa", 45 },
                    { 46, 1, "Kahramanmaraş", 46 },
                    { 47, 1, "Mardin", 47 },
                    { 48, 1, "Muğla", 48 },
                    { 49, 1, "Muş", 49 },
                    { 50, 1, "Nevşehir", 50 },
                    { 51, 1, "Niğde", 51 },
                    { 52, 1, "Ordu", 52 },
                    { 53, 1, "Rize", 53 },
                    { 54, 1, "Sakarya", 54 },
                    { 55, 1, "Samsun", 55 },
                    { 56, 1, "Siirt", 56 },
                    { 57, 1, "Sinop", 57 },
                    { 58, 1, "Sivas", 58 },
                    { 59, 1, "Tekirdağ", 59 },
                    { 60, 1, "Tokat", 60 },
                    { 61, 1, "Trabzon", 61 },
                    { 62, 1, "Tunceli", 62 },
                    { 63, 1, "Şanlıurfa", 63 },
                    { 64, 1, "Uşak", 64 },
                    { 65, 1, "Van", 65 },
                    { 66, 1, "Yozgat", 66 },
                    { 67, 1, "Zonguldak", 67 },
                    { 68, 1, "Aksaray", 68 },
                    { 69, 1, "Bayburt", 69 },
                    { 70, 1, "Karaman", 70 },
                    { 71, 1, "Kırıkkale", 71 },
                    { 72, 1, "Batman", 72 },
                    { 73, 1, "Şırnak", 73 },
                    { 74, 1, "Bartın", 74 },
                    { 75, 1, "Ardahan", 75 },
                    { 76, 1, "Iğdır", 76 },
                    { 77, 1, "Yalova", 77 },
                    { 78, 1, "Karabük", 78 },
                    { 79, 1, "Kilis", 79 },
                    { 80, 1, "Osmaniye", 80 },
                    { 81, 1, "Düzce", 81 }
                });

            migrationBuilder.InsertData(
                table: "Districts",
                columns: new[] { "Id", "CityId", "Name" },
                values: new object[,]
                {
                    { 1, 34, "Adalar" },
                    { 2, 34, "Arnavutköy" },
                    { 3, 34, "Ataşehir" },
                    { 4, 34, "Avcılar" },
                    { 5, 34, "Bağcılar" },
                    { 6, 34, "Bahçelievler" },
                    { 7, 34, "Bakırköy" },
                    { 8, 34, "Başakşehir" },
                    { 9, 34, "Bayrampaşa" },
                    { 10, 34, "Beşiktaş" },
                    { 11, 34, "Beykoz" },
                    { 12, 34, "Beylikdüzü" },
                    { 13, 34, "Beyoğlu" },
                    { 14, 34, "Büyükçekmece" },
                    { 15, 34, "Çatalca" },
                    { 16, 34, "Çekmeköy" },
                    { 17, 34, "Esenler" },
                    { 18, 34, "Esenyurt" },
                    { 19, 34, "Eyüpsultan" },
                    { 20, 34, "Fatih" },
                    { 21, 34, "Gaziosmanpaşa" },
                    { 22, 34, "Güngören" },
                    { 23, 34, "Kadıköy" },
                    { 24, 34, "Kağıthane" },
                    { 25, 34, "Kartal" },
                    { 26, 34, "Küçükçekmece" },
                    { 27, 34, "Maltepe" },
                    { 28, 34, "Pendik" },
                    { 29, 34, "Sancaktepe" },
                    { 30, 34, "Sarıyer" },
                    { 31, 34, "Silivri" },
                    { 32, 34, "Sultanbeyli" },
                    { 33, 34, "Sultangazi" },
                    { 34, 34, "Şile" },
                    { 35, 34, "Şişli" },
                    { 36, 34, "Tuzla" },
                    { 37, 34, "Ümraniye" },
                    { 38, 34, "Üsküdar" },
                    { 39, 34, "Zeytinburnu" },
                    { 40, 6, "Altındağ" },
                    { 41, 6, "Çankaya" },
                    { 42, 6, "Etimesgut" },
                    { 43, 6, "Gölbaşı" },
                    { 44, 6, "Keçiören" },
                    { 45, 6, "Mamak" },
                    { 46, 6, "Pursaklar" },
                    { 47, 6, "Sincan" },
                    { 48, 6, "Yenimahalle" },
                    { 49, 6, "Akyurt" },
                    { 50, 6, "Beypazarı" },
                    { 51, 6, "Kahramankazan" },
                    { 52, 6, "Polatlı" },
                    { 53, 35, "Aliağa" },
                    { 54, 35, "Balçova" },
                    { 55, 35, "Bayındır" },
                    { 56, 35, "Bayraklı" },
                    { 57, 35, "Bergama" },
                    { 58, 35, "Bornova" },
                    { 59, 35, "Buca" },
                    { 60, 35, "Çiğli" },
                    { 61, 35, "Gaziemir" },
                    { 62, 35, "Güzelbahçe" },
                    { 63, 35, "Karabağlar" },
                    { 64, 35, "Karaburun" },
                    { 65, 35, "Karşıyaka" },
                    { 66, 35, "Kemalpaşa" },
                    { 67, 35, "Kınık" },
                    { 68, 35, "Kiraz" },
                    { 69, 35, "Konak" },
                    { 70, 35, "Menderes" },
                    { 71, 35, "Menemen" },
                    { 72, 35, "Narlıdere" },
                    { 73, 35, "Ödemiş" },
                    { 74, 35, "Seferihisar" },
                    { 75, 35, "Selçuk" },
                    { 76, 35, "Tire" },
                    { 77, 35, "Torbalı" },
                    { 78, 35, "Urla" },
                    { 79, 16, "Büyükorhan" },
                    { 80, 16, "Gemlik" },
                    { 81, 16, "Gürsu" },
                    { 82, 16, "Harmancık" },
                    { 83, 16, "İnegöl" },
                    { 84, 16, "İznik" },
                    { 85, 16, "Karacabey" },
                    { 86, 16, "Keles" },
                    { 87, 16, "Kestel" },
                    { 88, 16, "Mudanya" },
                    { 89, 16, "Mustafakemalpaşa" },
                    { 90, 16, "Nilüfer" },
                    { 91, 16, "Orhaneli" },
                    { 92, 16, "Orhangazi" },
                    { 93, 16, "Osmangazi" },
                    { 94, 16, "Yıldırım" },
                    { 95, 16, "Yenişehir" },
                    { 96, 7, "Aksu" },
                    { 97, 7, "Alanya" },
                    { 98, 7, "Döşemealtı" },
                    { 99, 7, "Elmalı" },
                    { 100, 7, "Finike" },
                    { 101, 7, "Gazipaşa" },
                    { 102, 7, "Gündoğmuş" },
                    { 103, 7, "İbradı" },
                    { 104, 7, "Kaş" },
                    { 105, 7, "Kemer" },
                    { 106, 7, "Kepez" },
                    { 107, 7, "Konyaaltı" },
                    { 108, 7, "Korkuteli" },
                    { 109, 7, "Kumluca" },
                    { 110, 7, "Manavgat" },
                    { 111, 7, "Muratpaşa" },
                    { 112, 7, "Serik" },
                    { 113, 1, "Aladağ" },
                    { 114, 1, "Ceyhan" },
                    { 115, 1, "Çukurova" },
                    { 116, 1, "Feke" },
                    { 117, 1, "İmamoğlu" },
                    { 118, 1, "Karaisalı" },
                    { 119, 1, "Karataş" },
                    { 120, 1, "Kozan" },
                    { 121, 1, "Pozantı" },
                    { 122, 1, "Saimbeyli" },
                    { 123, 1, "Sarıçam" },
                    { 124, 1, "Seyhan" },
                    { 125, 1, "Tufanbeyli" },
                    { 126, 1, "Yumurtalık" },
                    { 127, 1, "Yüreğir" },
                    { 128, 42, "Ahırlı" },
                    { 129, 42, "Akören" },
                    { 130, 42, "Akşehir" },
                    { 131, 42, "Altınekin" },
                    { 132, 42, "Beyşehir" },
                    { 133, 42, "Bozkır" },
                    { 134, 42, "Cihanbeyli" },
                    { 135, 42, "Çeltik" },
                    { 136, 42, "Çumra" },
                    { 137, 42, "Derbent" },
                    { 138, 42, "Derebucak" },
                    { 139, 42, "Doğanhisar" },
                    { 140, 42, "Emirgazi" },
                    { 141, 42, "Ereğli" },
                    { 142, 42, "Güneysınır" },
                    { 143, 42, "Hadim" },
                    { 144, 42, "Halkapınar" },
                    { 145, 42, "Hüyük" },
                    { 146, 42, "Ilgın" },
                    { 147, 42, "Kadınhanı" },
                    { 148, 42, "Karapınar" },
                    { 149, 42, "Karatay" },
                    { 150, 42, "Kulu" },
                    { 151, 42, "Meram" },
                    { 152, 42, "Sarayönü" },
                    { 153, 42, "Selçuklu" },
                    { 154, 42, "Seydişehir" },
                    { 155, 42, "Taşkent" },
                    { 156, 42, "Tuzlukçu" },
                    { 157, 42, "Yalıhüyük" },
                    { 158, 42, "Yunak" },
                    { 159, 27, "Araban" },
                    { 160, 27, "İslahiye" },
                    { 161, 27, "Karkamış" },
                    { 162, 27, "Nurdağı" },
                    { 163, 27, "Oğuzeli" },
                    { 164, 27, "Şahinbey" },
                    { 165, 27, "Şehitkamil" },
                    { 166, 27, "Yavuzeli" },
                    { 167, 38, "Akkışla" },
                    { 168, 38, "Bünyan" },
                    { 169, 38, "Develi" },
                    { 170, 38, "Felahiye" },
                    { 171, 38, "Hacılar" },
                    { 172, 38, "İncesu" },
                    { 173, 38, "Kocasinan" },
                    { 174, 38, "Melikgazi" },
                    { 175, 38, "Özvatan" },
                    { 176, 38, "Pınarbaşı" },
                    { 177, 38, "Sarıoğlan" },
                    { 178, 38, "Sarız" },
                    { 179, 38, "Talas" },
                    { 180, 38, "Tomarza" },
                    { 181, 38, "Yahyalı" },
                    { 182, 38, "Yeşilhisar" },
                    { 183, 33, "Akdeniz" },
                    { 184, 33, "Anamur" },
                    { 185, 33, "Aydıncık" },
                    { 186, 33, "Bozyazı" },
                    { 187, 33, "Çamlıyayla" },
                    { 188, 33, "Erdemli" },
                    { 189, 33, "Gülnar" },
                    { 190, 33, "Mezitli" },
                    { 191, 33, "Mut" },
                    { 192, 33, "Silifke" },
                    { 193, 33, "Tarsus" },
                    { 194, 33, "Toroslar" },
                    { 195, 33, "Yenişehir" },
                    { 196, 21, "Bağlar" },
                    { 197, 21, "Bismil" },
                    { 198, 21, "Çermik" },
                    { 199, 21, "Çınar" },
                    { 200, 21, "Çüngüş" },
                    { 201, 21, "Dicle" },
                    { 202, 21, "Eğil" },
                    { 203, 21, "Ergani" },
                    { 204, 21, "Hani" },
                    { 205, 21, "Hazro" },
                    { 206, 21, "Kayapınar" },
                    { 207, 21, "Kocaköy" },
                    { 208, 21, "Kulp" },
                    { 209, 21, "Lice" },
                    { 210, 21, "Silvan" },
                    { 211, 21, "Sur" },
                    { 212, 21, "Yenişehir" },
                    { 213, 55, "Alaçam" },
                    { 214, 55, "Asarcık" },
                    { 215, 55, "Atakum" },
                    { 216, 55, "Ayvacık" },
                    { 217, 55, "Bafra" },
                    { 218, 55, "Canik" },
                    { 219, 55, "Çarşamba" },
                    { 220, 55, "Havza" },
                    { 221, 55, "İlkadım" },
                    { 222, 55, "Kavak" },
                    { 223, 55, "Ladik" },
                    { 224, 55, "Ondokuzmayıs" },
                    { 225, 55, "Salıpazarı" },
                    { 226, 55, "Tekkeköy" },
                    { 227, 55, "Terme" },
                    { 228, 55, "Vezirköprü" },
                    { 229, 55, "Yakakent" },
                    { 230, 61, "Akçaabat" },
                    { 231, 61, "Araklı" },
                    { 232, 61, "Arsin" },
                    { 233, 61, "Beşikdüzü" },
                    { 234, 61, "Çaykara" },
                    { 235, 61, "Dernekpazarı" },
                    { 236, 61, "Düzköy" },
                    { 237, 61, "Hayrat" },
                    { 238, 61, "Köprübaşı" },
                    { 239, 61, "Maçka" },
                    { 240, 61, "Of" },
                    { 241, 61, "Ortahisar" },
                    { 242, 61, "Sürmene" },
                    { 243, 61, "Şalpazarı" },
                    { 244, 61, "Tonya" },
                    { 245, 61, "Vakfıkebir" },
                    { 246, 61, "Yomra" },
                    { 247, 41, "Başiskele" },
                    { 248, 41, "Çayırova" },
                    { 249, 41, "Darıca" },
                    { 250, 41, "Derince" },
                    { 251, 41, "Dilovası" },
                    { 252, 41, "Gebze" },
                    { 253, 41, "Gölcük" },
                    { 254, 41, "İzmit" },
                    { 255, 41, "Kandıra" },
                    { 256, 41, "Karamürsel" },
                    { 257, 41, "Kartepe" },
                    { 258, 41, "Körfez" },
                    { 259, 54, "Adapazarı" },
                    { 260, 54, "Akyazı" },
                    { 261, 54, "Arife" },
                    { 262, 54, "Erenler" },
                    { 263, 54, "Ferizli" },
                    { 264, 54, "Geyve" },
                    { 265, 54, "Hendek" },
                    { 266, 54, "Karapürçek" },
                    { 267, 54, "Karasu" },
                    { 268, 54, "Kaynarca" },
                    { 269, 54, "Kocaali" },
                    { 270, 54, "Mithatpaşa" },
                    { 271, 54, "Pamukova" },
                    { 272, 54, "Sapanca" },
                    { 273, 54, "Serdivan" },
                    { 274, 54, "Söğütlü" },
                    { 275, 54, "Taraklı" },
                    { 276, 26, "Alpu" },
                    { 277, 26, "Beylikova" },
                    { 278, 26, "Çifteler" },
                    { 279, 26, "Günyüzü" },
                    { 280, 26, "Han" },
                    { 281, 26, "İnönü" },
                    { 282, 26, "Mahmudiye" },
                    { 283, 26, "Mihalgazi" },
                    { 284, 26, "Mihalıççık" },
                    { 285, 26, "Odunpazarı" },
                    { 286, 26, "Sarıcakaya" },
                    { 287, 26, "Seyitgazi" },
                    { 288, 26, "Sivrihisar" },
                    { 289, 26, "Tepebaşı" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_CityId",
                table: "UserAddresses",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_CountryId",
                table: "UserAddresses",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_DistrictId",
                table: "UserAddresses",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_CountryId",
                table: "Cities",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_PlateCode",
                table: "Cities",
                column: "PlateCode");

            migrationBuilder.CreateIndex(
                name: "IX_Countries_IsoCode",
                table: "Countries",
                column: "IsoCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Districts_CityId",
                table: "Districts",
                column: "CityId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAddresses_Cities_CityId",
                table: "UserAddresses",
                column: "CityId",
                principalTable: "Cities",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_UserAddresses_Countries_CountryId",
                table: "UserAddresses",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_UserAddresses_Districts_DistrictId",
                table: "UserAddresses",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAddresses_Cities_CityId",
                table: "UserAddresses");

            migrationBuilder.DropForeignKey(
                name: "FK_UserAddresses_Countries_CountryId",
                table: "UserAddresses");

            migrationBuilder.DropForeignKey(
                name: "FK_UserAddresses_Districts_DistrictId",
                table: "UserAddresses");

            migrationBuilder.DropTable(
                name: "Districts");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropIndex(
                name: "IX_UserAddresses_CityId",
                table: "UserAddresses");

            migrationBuilder.DropIndex(
                name: "IX_UserAddresses_CountryId",
                table: "UserAddresses");

            migrationBuilder.DropIndex(
                name: "IX_UserAddresses_DistrictId",
                table: "UserAddresses");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "UserAddresses");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "UserAddresses");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "UserAddresses");
        }
    }
}

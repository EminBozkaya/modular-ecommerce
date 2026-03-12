-- Mock Data Seed Script for EbrarKuruyemis (ROBUST)
-- Generated on 2026-03-12

-- 1. Units
INSERT INTO "Units" ("Id", "Name", "Code", "CreatedAt", "IsDeleted")
VALUES 
    (gen_random_uuid(), 'Kilogram', 'kg', NOW(), false),
    (gen_random_uuid(), 'Adet', 'adet', NOW(), false)
ON CONFLICT ("Name") DO NOTHING;

-- 2. Categories
INSERT INTO "Categories" ("Id", "Name", "Description", "IsActive", "CreatedAt", "IsDeleted")
VALUES 
    (gen_random_uuid(), 'Kuruyemiş', 'Taze ve kaliteli kuruyemiş çeşitleri', true, NOW(), false),
    (gen_random_uuid(), 'Baharat & Şifalı Bitkiler', 'Doğal baharatlar ve bitki çayları', true, NOW(), false),
    (gen_random_uuid(), 'Genel', 'Diğer ürünler', true, NOW(), false),
    (gen_random_uuid(), 'Kuru Meyve', 'Güneşte kurutulmuş meyveler', true, NOW(), false),
    (gen_random_uuid(), 'Atıştırmalık & Mix', 'Karışık atıştırmalıklar', true, NOW(), false)
ON CONFLICT ("Name") DO NOTHING;

-- 3. Products
DO $$
BEGIN
    -- Product 1
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Karışık Kavrulmuş Kuruyemiş' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (
            gen_random_uuid(), 
            'Karışık Kavrulmuş Kuruyemiş', 
            'Badem, kaju ve ceviz içeren premium kavrulmuş kuruyemiş karışımı.', 
            'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=300&h=300&fit=crop', 
            159.99, 'TRY', 100, 
            (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuruyemiş' LIMIT 1), 
            (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), 
            true, NOW(), false
        );
    END IF;

    -- Product 2
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Kuru Kayısı' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Kuru Kayısı', 'Çiftliklerden doğrudan temin edilen güneşte kurutulmuş tatlı kayısılar.', 'https://images.unsplash.com/photo-1590005354167-6da97870c757?w=300&h=300&fit=crop', 89.50, 'TRY', 45, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuru Meyve' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 3
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Premium Antep Fıstığı' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Premium Antep Fıstığı', 'Hafif tuzlu ve taze kavrulmuş Antep fıstığı.', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=300&h=300&fit=crop', 249.00, 'TRY', 60, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuruyemiş' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 4
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Kuru İncir' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Kuru İncir', 'Ege bölgesinden özenle seçilmiş doğal kuru incirler.', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=300&h=300&fit=crop', 79.99, 'TRY', 80, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuru Meyve' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 5
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Organik Bal' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Organik Bal', 'Yerel arıcılardan taze organik süzme bal.', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop', 220.00, 'TRY', 8, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Genel' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Adet' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 6
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Kavrulmuş Badem' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Kavrulmuş Badem', 'Doğal yöntemlerle kavrulmuş taze badem.', 'https://images.unsplash.com/photo-1574570173583-a65fc27484be?w=300&h=300&fit=crop', 185.50, 'TRY', 60, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuruyemiş' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 7
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Trail Mix - Enerji Karışımı' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Trail Mix - Enerji Karışımı', 'Fındık, badem, kuru üzüm ve çikolata parçacıkları içeren enerji karışımı.', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop', 125.00, 'TRY', 150, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Atıştırmalık & Mix' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 8
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Çekirdekli Hurma' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Çekirdekli Hurma', 'Taze ve yumuşak Medjool hurma.', 'https://images.unsplash.com/photo-1513135065346-a098a63a71ee?w=300&h=300&fit=crop', 169.50, 'TRY', 0, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuru Meyve' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 9
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Kabuklu Ceviz' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Kabuklu Ceviz', 'Yerli üretim doğal kabuklu ceviz. Taze ve kaliteli.', 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=300&h=300&fit=crop', 139.00, 'TRY', 35, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuruyemiş' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;

    -- Product 10
    IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Name" = 'Kaju Fıstığı' AND "IsDeleted" = false) THEN
        INSERT INTO "Products" ("Id", "Name", "Description", "ImageUrl", "Price_Amount", "Price_Currency", "StockQuantity", "CategoryId", "UnitId", "IsActive", "CreatedAt", "IsDeleted")
        VALUES (gen_random_uuid(), 'Kaju Fıstığı', 'Premium kalite tuzlu kavrulmuş kaju fıstığı.', 'https://images.unsplash.com/photo-1563292769-4405eb6e7add?w=300&h=300&fit=crop', 299.00, 'TRY', 25, (SELECT "Id" FROM "Categories" WHERE "Name" = 'Kuruyemiş' LIMIT 1), (SELECT "Id" FROM "Units" WHERE "Name" = 'Kilogram' LIMIT 1), true, NOW(), false);
    END IF;
END $$;

-- 4. Users (AppUser)
INSERT INTO "Users" ("Id", "FirstName", "LastName", "Email", "PasswordHash", "Role", "IsEmailConfirmed", "CreatedAt", "IsDeleted")
VALUES 
    (gen_random_uuid(), 'Admin', 'User', 'admin@test.com', 'AQAAAAIAAYagAAAAEG3c...', 1, true, NOW(), false),
    (gen_random_uuid(), 'Test', 'Customer', 'user@test.com', 'AQAAAAIAAYagAAAAEG3c...', 0, true, NOW(), false)
ON CONFLICT ("Email") DO NOTHING;





-------------------------------------------------------------------------
--to add products to the database on windows with power shell:
--Get-Content scripts/seed.sql | docker exec -i ebrar-db psql -U postgres -d EbrarKuruyemisDb

--to add products to the database on linux/MAC with bash:
--docker exec -i ebrar-db psql -U postgres -d EbrarKuruyemisDb < scripts/seed.sql



--Not: Komutun çalışması için 
--Docker'daki PostgreSQL konteyner isminin (ebrar-db) ve 
--veri tabanı isminin (EbrarKuruyemisDb) aynı olması yeterlidir. 
--Script kendi içerisinde "eğer veri yoksa ekle" (ROBUST) mantığıyla çalıştığı için, 
--aynı veri tabanına birden fazla kez çalıştırsan bile hata vermez 
--veya mükerrer kayıt oluşturmaz.


--Admin Kullanıcısı (admin@test.com): Admin123!
--Test Kullanıcısı (user@test.com): User123!
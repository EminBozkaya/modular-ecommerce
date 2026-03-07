CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Baskets" (
    "Id" uuid NOT NULL,
    "UserId" uuid,
    "SessionId" character varying(128),
    CONSTRAINT "PK_Baskets" PRIMARY KEY ("Id")
);

CREATE TABLE "Categories" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Description" character varying(500),
    "ImageUrl" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" text,
    "UpdatedAt" timestamp with time zone,
    "UpdatedBy" text,
    "IsDeleted" boolean NOT NULL,
    "DeletedAt" timestamp with time zone,
    CONSTRAINT "PK_Categories" PRIMARY KEY ("Id")
);

CREATE TABLE "Orders" (
    "Id" uuid NOT NULL,
    "OrderNumber" character varying(50) NOT NULL,
    "UserId" uuid,
    "GuestEmail" character varying(200),
    "ShippingAddress" character varying(500) NOT NULL,
    "Status" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" text,
    "UpdatedAt" timestamp with time zone,
    "UpdatedBy" text,
    "IsDeleted" boolean NOT NULL,
    "DeletedAt" timestamp with time zone,
    CONSTRAINT "PK_Orders" PRIMARY KEY ("Id")
);

CREATE TABLE "PaymentRecords" (
    "Id" uuid NOT NULL,
    "OrderId" uuid NOT NULL,
    "Amount_Value" numeric(18,2) NOT NULL,
    "Amount_Currency" character varying(3) NOT NULL,
    "Provider" character varying(50) NOT NULL,
    "ProviderTransactionId" character varying(200),
    "Status" integer NOT NULL,
    "FailureReason" character varying(500),
    "IdempotencyKey" character varying(100) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" text,
    "UpdatedAt" timestamp with time zone,
    "UpdatedBy" text,
    "IsDeleted" boolean NOT NULL,
    "DeletedAt" timestamp with time zone,
    CONSTRAINT "PK_PaymentRecords" PRIMARY KEY ("Id")
);

CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "FirstName" character varying(100) NOT NULL,
    "LastName" character varying(100) NOT NULL,
    "Email" character varying(200) NOT NULL,
    "PasswordHash" text NOT NULL,
    "Role" integer NOT NULL,
    "IsEmailConfirmed" boolean NOT NULL,
    "RefreshToken" character varying(500),
    "RefreshTokenExpiresAt" timestamp with time zone,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" text,
    "UpdatedAt" timestamp with time zone,
    "UpdatedBy" text,
    "IsDeleted" boolean NOT NULL,
    "DeletedAt" timestamp with time zone,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE "BasketItems" (
    "Id" uuid NOT NULL,
    "ProductId" uuid NOT NULL,
    "ProductName" character varying(200) NOT NULL,
    "UnitPrice_Amount" numeric(18,2) NOT NULL,
    "UnitPrice_Currency" character varying(3) NOT NULL,
    "Quantity" integer NOT NULL,
    "BasketId" uuid,
    CONSTRAINT "PK_BasketItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_BasketItems_Baskets_BasketId" FOREIGN KEY ("BasketId") REFERENCES "Baskets" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Products" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" character varying(2000),
    "ImageUrl" character varying(500),
    "Price_Amount" numeric(18,2) NOT NULL,
    "Price_Currency" character varying(3) NOT NULL,
    "StockQuantity" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "CategoryId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedBy" text,
    "UpdatedAt" timestamp with time zone,
    "UpdatedBy" text,
    "IsDeleted" boolean NOT NULL,
    "DeletedAt" timestamp with time zone,
    CONSTRAINT "PK_Products" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Products_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "OrderItems" (
    "Id" uuid NOT NULL,
    "ProductId" uuid NOT NULL,
    "ProductName" character varying(200) NOT NULL,
    "UnitPrice_Amount" numeric(18,2) NOT NULL,
    "UnitPrice_Currency" character varying(3) NOT NULL,
    "Quantity" integer NOT NULL,
    "OrderId" uuid,
    CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES "Orders" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_BasketItems_BasketId" ON "BasketItems" ("BasketId");

CREATE UNIQUE INDEX "IX_Categories_Name" ON "Categories" ("Name");

CREATE INDEX "IX_OrderItems_OrderId" ON "OrderItems" ("OrderId");

CREATE UNIQUE INDEX "IX_Orders_OrderNumber" ON "Orders" ("OrderNumber");

CREATE INDEX "IX_Orders_UserId" ON "Orders" ("UserId");

CREATE INDEX "IX_PaymentRecords_OrderId" ON "PaymentRecords" ("OrderId");

CREATE UNIQUE INDEX "IX_PaymentRecords_OrderId_IdempotencyKey" ON "PaymentRecords" ("OrderId", "IdempotencyKey");

CREATE INDEX "IX_Products_CategoryId" ON "Products" ("CategoryId");

CREATE INDEX "IX_Products_Name" ON "Products" ("Name");

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260306191734_InitialCreate', '10.0.3');

COMMIT;


using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Payment_MultiProvider_3DSecure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Provider",
                table: "PaymentRecords",
                newName: "ProviderName");

            // Data migration: convert integer Status to string before changing column type
            // Old enum: 0=Pending, 1=Succeeded→Completed, 2=Failed, 3=Refunded
            migrationBuilder.AddColumn<string>(
                name: "Status_New",
                table: "PaymentRecords",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE ""PaymentRecords""
                SET ""Status_New"" = CASE ""Status""
                    WHEN 0 THEN 'Pending'
                    WHEN 1 THEN 'Completed'
                    WHEN 2 THEN 'Failed'
                    WHEN 3 THEN 'Refunded'
                    ELSE 'Pending'
                END;
            ");

            migrationBuilder.DropColumn(name: "Status", table: "PaymentRecords");
            migrationBuilder.RenameColumn(name: "Status_New", table: "PaymentRecords", newName: "Status");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "PaymentRecords",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Pending",
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProviderTransactionId",
                table: "PaymentRecords",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FailureReason",
                table: "PaymentRecords",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CallbackPayload",
                table: "PaymentRecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "PaymentRecords",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProviderReference",
                table: "PaymentRecords",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PaymentProviderLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PaymentRecordId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProviderName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SanitizedRequest = table.Column<string>(type: "text", nullable: true),
                    SanitizedResponse = table.Column<string>(type: "text", nullable: true),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    HttpStatusCode = table.Column<int>(type: "integer", nullable: true),
                    DurationMs = table.Column<long>(type: "bigint", nullable: false),
                    ErrorCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentProviderLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentRecords_Processing_ExpiresAt",
                table: "PaymentRecords",
                columns: new[] { "Status", "ExpiresAt" },
                filter: "\"Status\" = 'Processing'");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentRecords_ProviderReference",
                table: "PaymentRecords",
                column: "ProviderReference");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentProviderLogs_CreatedAt",
                table: "PaymentProviderLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentProviderLogs_PaymentRecordId",
                table: "PaymentProviderLogs",
                column: "PaymentRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentProviderLogs");

            migrationBuilder.DropIndex(
                name: "IX_PaymentRecords_Processing_ExpiresAt",
                table: "PaymentRecords");

            migrationBuilder.DropIndex(
                name: "IX_PaymentRecords_ProviderReference",
                table: "PaymentRecords");

            migrationBuilder.DropColumn(
                name: "CallbackPayload",
                table: "PaymentRecords");

            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "PaymentRecords");

            migrationBuilder.DropColumn(
                name: "ProviderReference",
                table: "PaymentRecords");

            migrationBuilder.RenameColumn(
                name: "ProviderName",
                table: "PaymentRecords",
                newName: "Provider");

            // Data migration: convert string Status back to integer
            migrationBuilder.AddColumn<int>(
                name: "Status_Old",
                table: "PaymentRecords",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE ""PaymentRecords""
                SET ""Status_Old"" = CASE ""Status""
                    WHEN 'Pending'    THEN 0
                    WHEN 'Completed'  THEN 1
                    WHEN 'Failed'     THEN 2
                    WHEN 'Refunded'   THEN 3
                    ELSE 0
                END;
            ");

            migrationBuilder.DropColumn(name: "Status", table: "PaymentRecords");
            migrationBuilder.RenameColumn(name: "Status_Old", table: "PaymentRecords", newName: "Status");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "PaymentRecords",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProviderTransactionId",
                table: "PaymentRecords",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FailureReason",
                table: "PaymentRecords",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);
        }
    }
}

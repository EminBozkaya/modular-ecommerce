using Npgsql;
using System;

const string connString = "Host=localhost;Port=5433;Database=EbrarKuruyemisDb;Username=postgres;Password=postgres";
using var conn = new NpgsqlConnection(connString);
await conn.OpenAsync();

Console.WriteLine("--- Migration History ---");
using (var cmd = new NpgsqlCommand("SELECT \"MigrationId\" FROM \"__EFMigrationsHistory\" ORDER BY \"MigrationId\";", conn))
using (var reader = await cmd.ExecuteReaderAsync())
{
    while (await reader.ReadAsync())
    {
        Console.WriteLine(reader[0]);
    }
}

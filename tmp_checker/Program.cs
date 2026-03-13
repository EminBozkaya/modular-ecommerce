using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ECommerce.Persistence.Context;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

var builder = new ConfigurationBuilder()
    .AddJsonFile("src/ECommerce.API/appsettings.json")
    .AddJsonFile("src/ECommerce.API/appsettings.Development.json", optional: true);
var config = builder.Build();

var services = new ServiceCollection();
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

using var sp = services.BuildServiceProvider();
using var db = sp.GetRequiredService<ApplicationDbContext>();

Console.WriteLine("--- Database Applied Migrations ---");
var applied = await db.Database.GetAppliedMigrationsAsync();
foreach (var m in applied) {
    Console.WriteLine(m);
}

Console.WriteLine("\n--- BasketItems Quantity Column Type ---");
using var conn = db.Database.GetDbConnection();
await conn.OpenAsync();
using var cmd = conn.CreateCommand();
cmd.CommandText = "SELECT data_type FROM information_schema.columns WHERE table_name = 'BasketItems' AND column_name = 'Quantity';";
var type = await cmd.ExecuteScalarAsync();
Console.WriteLine($"Type: {type}");

using var cmd2 = conn.CreateCommand();
cmd2.CommandText = "SELECT \"ProductName\", \"Quantity\" FROM \"BasketItems\" LIMIT 5;";
using var reader = await cmd2.ExecuteReaderAsync();
while (await reader.ReadAsync()) {
    Console.WriteLine($"- Product: {reader[0]}, Qty: {reader[1]} (type: {reader[1].GetType()})");
}

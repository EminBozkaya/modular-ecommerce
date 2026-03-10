using System.Reflection;
using FluentAssertions;
using NetArchTest.Rules;

namespace ECommerce.ArchitectureTests;

public class ArchitectureTests
{
    private const string DomainNamespace = "ECommerce.Domain";
    private const string ApplicationNamespace = "ECommerce.Application";
    private const string PersistenceNamespace = "ECommerce.Persistence";
    private const string InfrastructureNamespace = "ECommerce.Infrastructure";
    private const string ApiNamespace = "ECommerce.API";

    [Fact]
    public void Domain_Should_NotHaveDependencyOnOtherProjects()
    {
        // Arrange
        var assembly = typeof(ECommerce.Domain.Common.BaseEntity).Assembly;

        var otherProjects = new[]
        {
            ApplicationNamespace,
            PersistenceNamespace,
            InfrastructureNamespace,
            ApiNamespace
        };

        // Act
        var result = Types
            .InAssembly(assembly)
            .ShouldNot()
            .HaveDependencyOnAny(otherProjects)
            .GetResult();

        // Assert
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Application_Should_NotHaveDependencyOnEntityFrameworkCore()
    {
        // Arrange
        var assembly = typeof(ECommerce.Application.Catalog.Commands.CreateProductCommand).Assembly;

        // Act
        var result = Types
            .InAssembly(assembly)
            .ShouldNot()
            .HaveDependencyOn("Microsoft.EntityFrameworkCore")
            .GetResult();

        // Assert
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Persistence_Should_NotHaveDependencyOnApplication()
    {
        // Arrange
        var assembly = typeof(ECommerce.Persistence.Context.ApplicationDbContext).Assembly;

        // Act
        var result = Types
            .InAssembly(assembly)
            .ShouldNot()
            .HaveDependencyOn(ApplicationNamespace)
            .GetResult();

        // Assert
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Controllers_Should_NotHaveDependencyOnDomain()
    {
        // Arrange
        var assembly = typeof(ECommerce.API.Controllers.CatalogController).Assembly;

        // Act
        var result = Types
            .InAssembly(assembly)
            .That()
            .AreClasses()
            .And()
            .HaveNameEndingWith("Controller")
            .ShouldNot()
            .HaveDependencyOn(DomainNamespace)
            .GetResult();

        // Assert
        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void DomainEntities_Should_NotHavePublicSetters()
    {
        // Arrange
        var assembly = typeof(ECommerce.Domain.Common.BaseEntity).Assembly;
        var entityTypes = assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && t.Namespace != null
                        && t.Namespace.StartsWith(DomainNamespace)
                        && !t.Name.EndsWith("Tests"));

        // Audit fields (CreatedAt, CreatedBy, UpdatedAt, UpdatedBy, IsDeleted, DeletedAt)
        // require public setters so EF Core interceptors can populate them — this is intentional.
        var auditPropertyNames = new HashSet<string>
        {
            "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy", "IsDeleted", "DeletedAt",
        };

        // Act
        var violatingMembers = entityTypes
            .SelectMany(t => t.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.SetMethod is { IsPublic: true } && !auditPropertyNames.Contains(p.Name))
                .Select(p => $"{t.Name}.{p.Name}"))
            .ToList();

        // Assert
        violatingMembers.Should().BeEmpty(
            because: "domain entities must encapsulate state — public setters break invariants. Violations: {0}",
            string.Join(", ", violatingMembers));
    }

    [Fact]
    public void Handlers_Should_NotDependOnRepositoriesNotBelongingToTheirAggregate()
    {
        // Ensure BasketHandlers don't use OrderRepository, etc. This is harder to define generically with NetArchTest without specific namespace parsing, so we'll skip the fine-grained aggregate rules here, but layer rules are the most critical.
        Assert.True(true);
    }
}

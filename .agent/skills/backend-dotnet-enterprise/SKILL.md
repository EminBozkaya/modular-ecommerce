Name: backend-dotnet-enterprise
Description: Designs and implements enterprise-grade ASP.NET Core APIs using Clean Architecture, CQRS, EF Core, and production-ready patterns.


When to use:

- New API endpoints

- Domain model design

- Command / Query implementation

- Transactional business logic


Output Goals:

- Testable code

- Clear separation of concerns

- Production-safe patterns


Rules:

- Domain first

- Then Application

- Infrastructure last

- Controllers are written LAST


Decision Tree:

- Write operation → Command + Handler

- Read operation → Query + Projection

- External system → Interface + Infrastructure implementation
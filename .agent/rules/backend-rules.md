Backend Workspace Rules
Activation: Always On

1. Technology Stack

- ASP.NET Core (.NET 10 or newer LTS version)

- C# nullable reference types ENABLED

- EF Core (Code First)


2. Coding Rules

- Controllers perform orchestration only

- Business logic in controllers is FORBIDDEN

- Every write operation = Command

- Every read operation = Query


3. EF Core Standards

- Soft delete is mandatory

- Global query filters are mandatory

- AsNoTracking is the default for read queries

- Raw SQL ONLY when required for performance


4. Logging

- Serilog structured logging is mandatory

- Sensitive data MUST NOT be logged


5. Scope Control

- The agent MUST NOT add extra endpoints

- The agent MUST NOT propose scope expansion
Architecture Workspace Rules
Activation: Always On

This file defines high-level architectural rules that apply to all backend, frontend, security, and DevOps work.


1. Architectural Approach

- Initial architecture: Modular Monolith

- Clean Architecture + CQRS + DDD are mandatory

- Early decomposition into microservices is FORBIDDEN


2. MVP Discipline

- Start with a working, testable MVP

- Advanced patterns (Saga, Event Sourcing, Read Replicas, etc.):

- ONLY when explicitly requested


3. Layering Discipline

Domain layer:

- MUST NOT reference Infrastructure

- MUST NOT use EF Core attributes

Application layer:

- MUST NOT be aware of HTTP, DB, or cache details

API layer:

- MUST NOT contain business logic


4. Explanation Style

Architectural decisions MUST be explained as:

- Why this approach was chosen

- Which alternatives were considered and why they were rejected


5. Ambiguity Handling

If requirements are incomplete:

- The agent STOPS

- Asks clarification questions

- Does NOT proceed until clarified
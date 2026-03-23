DevOps Workspace Rules
Activation: Always On

1. Deployment Model

- Container-based deployment is mandatory

- Snowflake servers are FORBIDDEN


2. CI/CD

- Deployment without passing tests is FORBIDDEN

- Database migrations MUST run before production deployment


3. Secrets Management

- Secrets in appsettings.json in production are FORBIDDEN

- Azure Key Vault is mandatory


4. Rollback

- A deployment without a rollback plan is INVALID
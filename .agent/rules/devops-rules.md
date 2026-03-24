# DevOps Rules

## Deployment Model
- Container-based deployment (Railway, Cloudflare Pages)
- Snowflake servers are FORBIDDEN
- Frontend: Cloudflare Pages (static SPA)
- Backend: Railway (Docker container)
- Database: Neon (PostgreSQL)
- Cache: Upstash (Redis)

## CI/CD
- Push-to-deploy on `develop` branch (staging)
- Production deployments will use separate branch/pipeline (future)
- Deployment without passing tests is FORBIDDEN
- Database migrations MUST run before deployment

## Secrets Management
- Secrets in appsettings.json in production are FORBIDDEN
- All secrets stored as Railway environment variables
- Connection strings, JWT secrets, API keys → Railway env vars only
- `.env` files MUST be in `.gitignore`

## Environment Configuration
- `ASPNETCORE_ENVIRONMENT=Staging` for Railway
- `appsettings.Staging.json` is the active config file
- CORS origins configured via `Cors__Origins__N` env vars
- Frontend base URL via `Frontend__BaseUrl` env var

## Rollback
- A deployment without a rollback plan is INVALID
- Railway supports instant rollback via revision history
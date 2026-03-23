Security Workspace Rules
Activation: Always On


1. Authentication

- JWT via httpOnly cookies

- Short-lived access tokens

- Refresh token rotation is mandatory


2. Authorization

- Backend is always the source of truth

- Frontend guards are for UX purposes only


3. Prohibitions

- Tokens in localStorage are FORBIDDEN

- Hardcoded secrets are FORBIDDEN

- Storing card data is FORBIDDEN


4. Secure Defaults

- HTTPS is mandatory

- Rate limiting enabled by default

- CORS whitelist is mandatory
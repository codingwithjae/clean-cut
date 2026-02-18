# Deployment

## Production Stack

- Frontend: Vercel
- Backend: Koyeb
- Database: PostgreSQL (Koyeb-managed)

## Backend Configuration Checklist (Koyeb)

- Public route/path: `/`
- Health check path: `/api/v1/health`
- Start command runs backend server (`pnpm start`)

Required env vars:

- `DATABASE_URL`
- `JWT_SECRET` (or `JWT_SECRET_KEY`)
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

## Frontend Configuration Checklist (Vercel)

Required env vars:

- `VITE_API_URL=https://cleancut.koyeb.app/api/v1`
- `VITE_GOOGLE_AUTH_URL=https://cleancut.koyeb.app/api/v1/auth/google`
- `VITE_BASE_URL=https://clean-cut-psi.vercel.app` (production app URL)

`VITE_BASE_URL` notes:

- Production: set to the deployed frontend origin (Vercel URL).
- Local development: set to local frontend origin (for example `http://localhost:5173`).

## Local Dev/Test Env Strategy

- Use `.env.development` for local backend/frontend development defaults.
- Use `TEST_DATABASE_URL` for automated test database connections.
- Use `SHADOW_DATABASE_URL` for Prisma migration/test shadow database isolation.

## OAuth Configuration (Google)

Set in Google Cloud OAuth client:

- Authorized JavaScript origins:
  - `https://clean-cut-psi.vercel.app`
- Authorized redirect URIs:
  - `https://cleancut.koyeb.app/api/v1/auth/google/callback`

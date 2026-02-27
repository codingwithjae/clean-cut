# Korta

Simple open-source link shortener for developers and creators.

## Live Links

- App: `https://korta.click/`
- API: `https://api.korta.click/api/v1`
- API Health: `https://api.korta.click/api/v1/health`

## Work In Progress

This project is currently under active development.

- Features and API contracts may change.
- Some docs and examples may be incomplete or outdated.
- Breaking changes can happen between commits.

## Project Overview

Korta is a full-stack URL shortener split into:

- `frontend/`: React + Vite app (landing, auth, dashboard).
- `backend/`: Express + Prisma API (auth, URL management, redirects).
- PostgreSQL database via Prisma models.

Main user-facing capabilities:

- Public link shortening (no account required).
- Authenticated dashboard for managing personal links.
- API key support for programmatic access.
- Email verification for account security.
- Basic analytics (`clicks`) per shortened URL.

## Tech Stack

### Backend

- Node.js + TypeScript
- Express
- PostgreSQL + Prisma
- JWT + Argon2
- Passport (Google OAuth2)
- Zod + Vitest

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Architecture

### Backend Responsibilities

- Authentication:
  - Email/password login with email verification.
  - Password recovery flow (`forgot-password` and `reset-password`).
  - Google OAuth callback support.
  - API key generation/regeneration.
- URL system:
  - Public shortening endpoint.
  - Private link CRUD for authenticated users.
  - Redirect endpoint by `shortId`.
- Security/ops:
  - Rate limiting.
  - CORS allowlist for frontend origin.
  - Health endpoint at `/api/v1/health`.

### Frontend Responsibilities

- Public landing flow (anonymous short URL creation).
- Auth flows (register, login, verify email, OAuth callback).
- Dashboard:
  - Overview and basic stats.
  - Link CRUD.
  - API key management.
  - Explicit loading and error state handling for dashboard API requests.
- Centralized API client + normalized API error handling.

### Data Model (Core)

- `User`
  - Email, optional password/googleId, `isVerified`, optional `apiKey`.
- `Url`
  - `originalUrl`, unique `shortId`, `clicks`, optional owner (`userId`).

## API Contract

### Base URL

- Production: `https://api.korta.click/api/v1`
- Local: `http://localhost:5000/api/v1`

### Authentication Modes

- Bearer token:
  - `Authorization: Bearer <jwt>`
- API key:
  - `X-API-Key: <key>`

### Main Endpoints

#### Health

- `GET /health`

#### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/verify/:token`
- `GET /auth/api-key`
- `POST /auth/api-key/regenerate`
- `POST /auth/change-password` (authenticated)
- `POST /auth/forgot-password` (public)
- `POST /auth/reset-password` (public; requires `token`, `newPassword`, `confirmPassword`)
- `DELETE /auth/account` (authenticated; delete-account flow)
- `GET /auth/google`
- `GET /auth/google/callback`

Notes:

- `POST /auth/forgot-password` is anti-enumeration: existing and non-existing emails receive the same `200` generic response.
- `GET /auth/verify/:token` is idempotent by user state: first valid call verifies email (`Email verified successfully`), already-verified user returns `200` with `Email already verified. You can sign in.`

#### URLs

- `POST /urls/public` (anonymous or authenticated)
- `POST /urls` (authenticated)
- `GET /urls/my-links` (authenticated)
- `PATCH /urls/:shortId` (owner only)
  - Partial update only: send `newShortId` and/or `originalUrl`; at least one is required.
- `DELETE /urls/:shortId` (owner only)

### Error Shape

The backend returns consistent API errors:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {}
}
```

Notes:

- `details` is optional.
- Frontend normalizes API errors through the shared Axios client.

## Deployment

### Production Stack

- Frontend: Railway
- Backend: Railway
- Database: PostgreSQL (Railway-managed)

### Backend Configuration Checklist (Railway)

- Public route/path: `/`
- Health check path: `/api/v1/health`
- Start command runs backend server (`pnpm start`)

Required env vars:

- `DATABASE_URL`
- `JWT_SECRET` (or `JWT_SECRET_KEY`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `RESEND_API_KEY` (required in production for email sending)

Recommended env vars:

- `FRONTEND_URL` (defaults to `http://localhost:5173` if unset)
- `CORS_ORIGINS` (optional; falls back to `FRONTEND_URL` when unset)
- `EMAIL_FROM` (optional; defaults to `noreply@korta.click`)
- `TRUST_PROXY_HOPS` (recommended for reverse proxy deployments like Railway)

Optional test/tooling env vars:

- `TEST_DATABASE_URL`
- `SHADOW_DATABASE_URL`

Env file resolution:

- Backend defaults to `.env.development`.
- Production defaults to `.env.production`.
- Override with `ENV_FILE` (example: `ENV_FILE=.env.staging`).

### Frontend Configuration Checklist

Required env vars:

- `VITE_API_URL=https://api.korta.click/api/v1`
- `VITE_GOOGLE_AUTH_URL=https://api.korta.click/api/v1/auth/google`
- `VITE_BASE_URL=https://korta.click` (production app URL)

`VITE_BASE_URL` notes:

- Production: set to the deployed frontend origin.
- Local development: set to local frontend origin (for example `http://localhost:5173`).

Local env files:

- Use `.env.development` for shared local frontend defaults.
- Use `.env.development.local` for machine-specific local overrides.

### Local Dev/Test Env Strategy

- Use `.env.development` for local backend/frontend development defaults.
- Optionally override backend env file selection with `ENV_FILE`.
- Use `TEST_DATABASE_URL` for automated test database connections.
- Use `SHADOW_DATABASE_URL` for Prisma migration/test shadow database isolation.

### OAuth Configuration (Google)

Set in Google Cloud OAuth client:

- Authorized JavaScript origins:
  - `https://korta.click/`
- Authorized redirect URIs:
  - `https://api.korta.click/api/v1/auth/google/callback`

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- `pnpm`
- Environment variables (see `.env.example` in `backend/`)

## Quick Demo Flow

1. Open the app and shorten a URL from the landing page.
2. Register a new user and verify the email.
3. Sign in and create a private short link.
4. Open Dashboard to review links and click stats.
5. Generate an API key and test authenticated API usage.

## Changelog Notes

This file tracks notable engineering-level changes relevant to reviewers.

### 2026-02

- Migrated infrastructure providers to Railway.
- Normalized frontend API error handling with a centralized Axios interceptor.
- Improved backend CORS handling for production origin allowlists.
- Added explicit CORS preflight support (`OPTIONS`) in backend.
- Added backend Vitest configuration and shared test setup file.
- Added account self-service endpoints (`change-password`, account deletion).
- Added password recovery flow (`forgot-password`, `reset-password`) with token validation and confirmation checks.
- Made email verification behavior idempotent (first verify succeeds, repeated verify returns already-verified success).
- Enforced URL `PATCH /urls/:shortId` partial-update validation (at least one of `newShortId` or `originalUrl`).
- Improved dashboard loading/error state handling for link and API-key data fetches.
- Expanded E2E coverage for health, auth/account, password recovery, and URL update/delete flows.
- Standardized lint/tooling setup and TypeScript config alignment.
- Fixed API key regenerate response message (`create` vs `regenerate`).
- Complete migration to TypeScript.

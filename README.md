# Clean Cut

Simple open-source link shortener for developers and creators.

## Live Links

- App: `https://clean-cut-psi.vercel.app`
- API: `https://cleancut.koyeb.app/api/v1`
- API Health: `https://cleancut.koyeb.app/api/v1/health`

## Documentation (GitHub)

- Project docs index: `docs/README.md`
- Architecture: `docs/architecture.md`
- API contract: `docs/api-contract.md`
- Deployment: `docs/deployment.md`
- Changelog notes: `docs/changelog.md`

## Work In Progress

This project is currently under active development.

- Features and API contracts may change.
- Some docs and examples may be incomplete or outdated.
- Breaking changes can happen between commits.

## Project Overview

Clean Cut is a full-stack URL shortener with:

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

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- `pnpm`
- Environment variables (see `.env.example` in `backend/`)

### Install

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

### Run (development)

```bash
# backend
cd backend
pnpm prisma generate
pnpm dev

# frontend (new terminal)
cd frontend
pnpm dev
```

## Quick Demo Flow

1. Open the app and shorten a URL from the landing page.
2. Register a new user and verify the email.
3. Sign in and create a private short link.
4. Open Dashboard to review links and click stats.
5. Generate an API key and test authenticated API usage.

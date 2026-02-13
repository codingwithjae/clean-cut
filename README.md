# Clean Cut

Simple open-source link shortener for developers and creators.

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

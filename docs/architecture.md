# Architecture

## Overview

Clean Cut is a full-stack URL shortener split into:

- `frontend/`: React + Vite app (landing, auth, dashboard).
- `backend/`: Express + Prisma API (auth, URL management, redirects).
- PostgreSQL database via Prisma models.

## Backend Responsibilities

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

## Frontend Responsibilities

- Public landing flow (anonymous short URL creation).
- Auth flows (register, login, verify email, OAuth callback).
- Dashboard:
  - Overview and basic stats.
  - Link CRUD.
  - API key management.
  - Explicit loading and error state handling for dashboard API requests.
- Centralized API client + normalized API error handling.

## Data Model (Core)

- `User`
  - Email, optional password/googleId, `isVerified`, optional `apiKey`.
- `Url`
  - `originalUrl`, unique `shortId`, `clicks`, optional owner (`userId`).

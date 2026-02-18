# Changelog Notes

This file tracks notable engineering-level changes relevant to reviewers.

## 2026-02

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

## Maintainer Notes

- Keep this file focused on high-impact changes.
- Use commit hashes/tags when preparing release snapshots.

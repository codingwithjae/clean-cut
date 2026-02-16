# Changelog Notes

This file tracks notable engineering-level changes relevant to reviewers.

## 2026-02

- Normalized frontend API error handling with a centralized Axios interceptor.
- Improved backend CORS handling for production origin allowlists.
- Added explicit CORS preflight support (`OPTIONS`) in backend.
- Added backend Vitest configuration and shared test setup file.
- Expanded E2E suite with health and URL update/delete coverage.
- Standardized lint/tooling setup and TypeScript config alignment.
- Added account self-service endpoints (change password, delete account).
- URL update now supports `originalUrl` updates.
- Fixed API key regenerate response message (`create` vs `regenerate`).
- Expanded E2E coverage for password/account/originalUrl update flows.

## Maintainer Notes

- Keep this file focused on high-impact changes.
- Use commit hashes/tags when preparing release snapshots.

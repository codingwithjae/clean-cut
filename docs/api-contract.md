# API Contract

## Base URL

- Production: `https://cleancut.koyeb.app/api/v1`
- Local: `http://localhost:5000/api/v1`

## Authentication Modes

- Bearer token:
  - `Authorization: Bearer <jwt>`
- API key:
  - `X-API-Key: <key>`

## Main Endpoints

### Health

- `GET /health`

### Auth

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

### URLs

- `POST /urls/public` (anonymous or authenticated)
- `POST /urls` (authenticated)
- `GET /urls/my-links` (authenticated)
- `PATCH /urls/:shortId` (owner only)
  - Partial update only: send `newShortId` and/or `originalUrl`; at least one is required.
- `DELETE /urls/:shortId` (owner only)

## Error Shape

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

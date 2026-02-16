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
- `POST /auth/change-password` (authenticated)
- `DELETE /auth/account` (authenticated)
- `GET /auth/verify/:token`
- `GET /auth/api-key`
- `POST /auth/api-key/regenerate`
- `GET /auth/google`
- `GET /auth/google/callback`

### URLs

- `POST /urls/public` (anonymous or authenticated)
- `POST /urls` (authenticated)
- `GET /urls/my-links` (authenticated)
- `PATCH /urls/:shortId` (owner only)
  - Accepts partial body updates: `newShortId` and/or `originalUrl` (at least one required).
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

# Clean Cut Docs (Repo Summary)

Starlight is the full documentation source for this project: `[Starlight docs URL]`.

This `/docs` folder is a concise technical summary for repository reviewers.

## Reading Order

1. `architecture.md` - high-level design and responsibilities.
2. `api-contract.md` - base URL, auth endpoints, URL behaviors, and errors.
3. `deployment.md` - production setup and env strategy.
4. `changelog.md` - recent engineering changes.

## PR Sync Checklist

- API contract changed -> update `api-contract.md`.
- Env/config changed -> update `deployment.md`.
- Core user/system flow changed -> update `architecture.md` and `changelog.md`.

# AGENTS.md

## Scope
This file guides AI agents working in the Noteo mobile app.

## Architecture
- Expo Router file-based routing lives in src/app/.
- Reusable UI belongs in src/components/.
- Screen-specific logic belongs in src/screens/.
- Shared logic belongs in src/hooks/, src/utilities/, or src/services/.
- State updates should follow the Redux Toolkit + Saga flow.

## Rules
- Do not put business logic directly into route files.
- Do not add new folders unless necessary.
- Reuse existing theme, utilities, and services before creating new ones.
- Prefer type-safe TypeScript and avoid any.
- Keep offline-first behavior intact and preserve persistence patterns.

## Verification
Run the relevant checks before finishing:
- npm run preflight
- npm test

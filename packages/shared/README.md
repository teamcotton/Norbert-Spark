# @level-2-gym/shared

Shared types and schemas for the monorepo.

This package provides Zod schemas and TypeScript types that are intended to be
imported by both the frontend and backend so they share a single source of
truth for DTOs, validation and common types.

Current exports:

- `LoginSchema`, `RegisterSchema`, `AuthResponseSchema`
- `UserSchema`, `PublicUserSchema`
- `LoginDTO`, `RegisterDTO`, `AuthResponse`, `User`

Usage (frontend or backend):

```ts
import { LoginSchema, LoginDTO } from '@level-2-gym/shared'
```

Notes:
- Add build step and package exports as needed when the package grows.
- This scaffold expects `zod` to be installed in the workspace.

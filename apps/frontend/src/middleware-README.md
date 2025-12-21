# Middleware Documentation

## Overview

Next.js middleware for route protection and authentication checks. This file must be located at `apps/frontend/src/middleware.ts` per Next.js conventions.

## Phase 1 Part 4: Middleware Implementation

✅ **Status**: COMPLETED

### Implementation Details

**File Location**: `apps/frontend/src/middleware.ts`

**Purpose**: Protect routes requiring authentication before pages are rendered.

**Key Features**:

- JWT token verification via `getToken()` from next-auth/jwt
- Protected routes: `/admin/*`, `/dashboard/*`, `/profile/*`
- Auth routes: `/login`, `/register` (redirect if already authenticated)
- Callback URL preservation for post-login redirect

### Protected Routes

Routes requiring authentication:

- `/admin/*` - Admin panel (role checks handled by page components)
- `/dashboard/*` - User dashboard
- `/profile/*` - User profile pages

### Public Routes

Routes redirecting authenticated users:

- `/login` - Redirects to `/admin` if already logged in
- `/register` - Redirects to `/admin` if already logged in

All other routes are public and accessible without authentication.

### Authentication Flow

1. Middleware checks if route requires protection
2. Verifies JWT token from cookies using next-auth
3. Redirects unauthenticated users to `/login` with callback URL
4. Redirects authenticated users away from auth pages
5. Allows access if authenticated or route is public

### Matcher Configuration

Processes all routes except:

- Static files (`/_next/static/*`)
- Image optimization (`/_next/image/*`)
- Favicon and public assets (`*.svg`, `*.png`, etc.)
- API routes (handled by Server Actions)

## Technical Notes

### Why Not in Infrastructure Folder?

While DDD architecture suggests placing infrastructure concerns in `src/infrastructure/`, Next.js has strict conventions for middleware:

1. **Next.js Convention**: Middleware must be at `src/middleware.ts` or root `middleware.ts`
2. **Framework Limitation**: Next.js 16 doesn't support custom middleware locations
3. **Type Resolution**: Using standard location ensures proper TypeScript support

This is a framework-imposed exception to DDD structure.

### TypeScript Workaround

The middleware uses native `Request` instead of Next.js `NextRequest` to avoid `next/server` import issues:

```typescript
// Instead of:
import type { NextRequest } from 'next/server'
export async function middleware(request: NextRequest) {}

// We use:
export async function middleware(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url
  // ...
}
```

The `getToken()` function requires a typed request, so we use `as unknown` type assertion:

```typescript
const token = await getToken({
  req: request as unknown, // Type assertion for next-auth compatibility
  secret: process.env.NEXTAUTH_SECRET,
})
```

### Next.js 16 Deprecation Warning

Next.js 16 shows a deprecation warning:

> ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.

This is expected behavior. The middleware still works correctly. The "proxy" convention is the future direction for Next.js, but `middleware.ts` is still fully supported in Next.js 16.

## Testing

### Build Verification

```bash
pnpm build  # ✅ Compiles successfully
```

### Type Checking

```bash
pnpm typecheck  # ✅ No type errors
```

### Lint Checks

```bash
pnpm lint  # ✅ All checks pass
```

### Unit Tests

```bash
pnpm test  # ✅ 649 tests passing
```

## Related Files

- **Auth Config**: `apps/frontend/src/lib/auth-config.ts` - NextAuth configuration
- **Auth Utilities**: `apps/frontend/src/lib/auth.ts` - Server Action auth helpers
- **Auth Tests**: `apps/frontend/src/test/lib/auth.test.ts` - 49 tests for auth utilities
- **Auth Examples**: `apps/frontend/src/lib/auth-examples.md` - Usage documentation

## Next Steps

**Phase 1 Part 5**: Add rate limiting middleware

- Install `@upstash/ratelimit` and `@upstash/redis`
- Add rate limiting (10 requests per 10 seconds)
- Implement for API routes and Server Actions
- Add rate limit headers: X-RateLimit-Limit, Remaining, Reset
- Configure Upstash Redis connection

## References

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth Middleware](https://next-auth.js.org/configuration/nextjs#in-middleware)
- [REFACTORING_PLAN.md](../../../REFACTORING_PLAN.md) - Phase 1 Part 4

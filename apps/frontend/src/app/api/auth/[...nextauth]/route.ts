import NextAuth from 'next-auth'

import { authOptions } from '../../../../lib/auth-config.js'

/**
 * NextAuth v4 Route Handler for Next.js App Router
 *
 * KNOWN LIMITATION:
 * NextAuth v4 was designed for Next.js Pages Router and has incomplete type
 * definitions for the App Router's route handlers. The `NextAuth()` function
 * returns a handler that is compatible with App Router but TypeScript doesn't
 * recognize it as such.
 *
 * WORKAROUND:
 * Using @ts-expect-error to suppress the type error while maintaining runtime
 * functionality. The handler works correctly at runtime - it's purely a type
 * definition issue.
 *
 * FUTURE MIGRATION:
 * NextAuth v5 (Auth.js) provides first-class App Router support with proper
 * TypeScript definitions. Once v5 is stable and production-ready, we should
 * migrate to remove this workaround.
 *
 * Reference: https://next-auth.js.org/configuration/initialization#route-handlers-app
 */
// @ts-expect-error - NextAuth v4 type definitions don't support App Router
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

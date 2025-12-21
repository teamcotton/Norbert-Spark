// Mock next-auth/jwt as in existing tests
import { getToken } from 'next-auth/jwt'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { __resetRateLimiter, middleware } from '../middleware.js'

vi.mock('next-auth/jwt', () => ({ getToken: vi.fn() }))

describe('Middleware Rate Limiting', () => {
  const baseUrl = 'http://localhost:3000'
  const origEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...origEnv,
      NEXTAUTH_SECRET: 'test-secret',
      // no external rate-limit service required for in-memory limiter
    }
    __resetRateLimiter()
  })

  afterEach(() => {
    process.env = origEnv
  })

  const createRequest = (pathname: string, method = 'GET') =>
    new Request(`${baseUrl}${pathname}`, { method })

  it('allows requests under the rate limit and sets rate-limit headers', async () => {
    vi.mocked(getToken).mockResolvedValue(null)

    const req = createRequest('/api/test')
    const res = await middleware(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('X-RateLimit-Limit')).toBe('10')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('9')
    expect(res.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })

  it('blocks requests when over the limit with 429 and headers', async () => {
    vi.mocked(getToken).mockResolvedValue(null)

    // consume the limit
    for (let i = 0; i < 10; i++) {
      const r = await middleware(createRequest('/api/test'))
      expect(r.status).toBe(200)
    }

    // the next request should be blocked
    const blocked = await middleware(createRequest('/api/test'))
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('X-RateLimit-Limit')).toBe('10')
    expect(blocked.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(blocked.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })

  it('attaches rate-limit headers to redirect responses', async () => {
    // unauthenticated -> protected route triggers redirect
    vi.mocked(getToken).mockResolvedValue(null)

    const req = createRequest('/admin', 'POST')
    const res = await middleware(req)

    expect(res.status).toBe(302)
    expect(res.headers.get('X-RateLimit-Limit')).toBe('10')
    // first request uses 1 of 10, so remaining should be 9
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('9')
    expect(res.headers.get('X-RateLimit-Reset')).toBeTruthy()
  })
})

import type { FastifyInstance } from 'fastify'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { buildApp } from '../src/app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Check if certificates exist for HTTPS tests
const certsPath = join(__dirname, '..', 'certs')
const certificatesExist =
  existsSync(join(certsPath, 'key.pem')) && existsSync(join(certsPath, 'cert.pem'))

describe('Fastify API Server', () => {
  let app: FastifyInstance

  beforeEach(() => {
    app = buildApp()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toEqual({ message: 'Level 2 Gym API' })
    })

    it('should return JSON content type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      })

      expect(response.headers['content-type']).toContain('application/json')
    })
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body).toHaveProperty('status', 'ok')
      expect(body).toHaveProperty('timestamp')
    })

    it('should return valid ISO timestamp', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      })

      const body = response.json()
      const timestamp = new Date(body.timestamp)
      expect(timestamp.toISOString()).toBe(body.timestamp)
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/unknown',
      })

      expect(response.statusCode).toBe(404)
    })
  })

  describe('Server Configuration', () => {
    it('should accept custom options', async () => {
      const customApp = buildApp({
        logger: false,
      })

      const response = await customApp.inject({
        method: 'GET',
        url: '/',
      })

      expect(response.statusCode).toBe(200)
      await customApp.close()
    })

    it.skipIf(!certificatesExist)('should accept HTTPS options', async () => {
      const key = readFileSync(join(certsPath, 'key.pem'))
      const cert = readFileSync(join(certsPath, 'cert.pem'))

      const httpsApp = buildApp({
        logger: false,
        http2: true,
        https: {
          key,
          cert,
        },
      } as any)

      const response = await httpsApp.inject({
        method: 'GET',
        url: '/',
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toEqual({ message: 'Level 2 Gym API' })

      await httpsApp.close()
    })

    it('should work with HTTP configuration (no HTTPS)', async () => {
      const httpApp = buildApp({
        logger: false,
      })

      const response = await httpApp.inject({
        method: 'GET',
        url: '/health',
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toHaveProperty('status', 'ok')
      await httpApp.close()
    })

    it('should merge custom options with defaults', async () => {
      const customApp = buildApp({
        logger: false,
        requestIdHeader: 'x-custom-request-id',
      })

      const response = await customApp.inject({
        method: 'GET',
        url: '/',
      })

      expect(response.statusCode).toBe(200)
      await customApp.close()
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('EnvConfig', () => {
  let originalEnv: typeof process.env

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env }
    // Clear module cache to ensure fresh imports
    vi.resetModules()
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
    vi.resetModules()
  })

  describe('NODE_ENV', () => {
    it('should use NODE_ENV from environment when set', async () => {
      process.env.NODE_ENV = 'production'
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(EnvConfig.NODE_ENV).toBe('production')
    })

    it('should default to "development" when NODE_ENV is not set', async () => {
      delete process.env.NODE_ENV
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(EnvConfig.NODE_ENV).toBe('development')
    })

    it('should be a static property', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      const descriptor = Object.getOwnPropertyDescriptor(EnvConfig, 'NODE_ENV')
      expect(descriptor).toBeDefined()
      expect(descriptor?.configurable).toBe(true)
      expect(descriptor?.enumerable).toBe(true)
    })
  })

  describe('DATABASE_URL', () => {
    it('should have DATABASE_URL property loaded from environment or .env file', async () => {
      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(EnvConfig.DATABASE_URL).toBeDefined()
      expect(typeof EnvConfig.DATABASE_URL).toBe('string')
      // Should be loaded from .env file
      expect(EnvConfig.DATABASE_URL).toBeTruthy()
      expect(EnvConfig.DATABASE_URL!.length).toBeGreaterThan(0)
    })

    it('should be a static readonly property', async () => {
      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      const descriptor = Object.getOwnPropertyDescriptor(EnvConfig, 'DATABASE_URL')
      expect(descriptor).toBeDefined()
      expect(descriptor?.configurable).toBe(true)
      expect(descriptor?.enumerable).toBe(true)
    })
  })

  describe('validate()', () => {
    it('should not throw error when DATABASE_URL is loaded from .env', async () => {
      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      // Since DATABASE_URL is in .env file, validate should pass
      expect(() => EnvConfig.validate()).not.toThrow()
    })

    it('should validate that DATABASE_URL exists', async () => {
      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      // DATABASE_URL should be loaded from .env file and not be empty
      expect(EnvConfig.DATABASE_URL).toBeTruthy()
    })

    it('should be a static method accessible without instantiation', async () => {
      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(typeof EnvConfig.validate).toBe('function')
    })
  })

  describe('EnvConfig class', () => {
    it('should be instantiable', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      const envConfig = new EnvConfig()
      expect(envConfig).toBeInstanceOf(EnvConfig)
    })

    it('should have static NODE_ENV property accessible without instantiation', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(EnvConfig.NODE_ENV).toBeDefined()
      expect(typeof EnvConfig.NODE_ENV).toBe('string')
    })

    it('should have static DATABASE_URL property accessible without instantiation', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(EnvConfig.DATABASE_URL).toBeDefined()
      expect(typeof EnvConfig.DATABASE_URL).toBe('string')
    })

    it('should have static validate method accessible without instantiation', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

      const { EnvConfig } = await import('../../../src/infrastructure/config/env.config.js')

      expect(typeof EnvConfig.validate).toBe('function')
    })
  })
})

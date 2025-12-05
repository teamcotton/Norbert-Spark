import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { EnvConfig } from '../../../src/infrastructure/config/env.config.js'

describe('EnvConfig', () => {
  let originalEnv: typeof process.env

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('NODE_ENV', () => {
    it('should return the NODE_ENV value when set', () => {
      process.env.NODE_ENV = 'production'
      expect(EnvConfig.NODE_ENV).toBe('production')
    })

    it('should return "development" as default when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV
      expect(EnvConfig.NODE_ENV).toBe('development')
    })

    it('should return the NODE_ENV value for test environment', () => {
      process.env.NODE_ENV = 'test'
      expect(EnvConfig.NODE_ENV).toBe('test')
    })

    it('should return the NODE_ENV value for staging environment', () => {
      process.env.NODE_ENV = 'staging'
      expect(EnvConfig.NODE_ENV).toBe('staging')
    })
  })

  describe('validate()', () => {
    it('should not throw error when all required environment variables are set', () => {
      process.env.NODE_ENV = 'test'
      expect(() => EnvConfig.validate()).not.toThrow()
    })

    it('should throw error when NODE_ENV is missing', () => {
      delete process.env.NODE_ENV
      expect(() => EnvConfig.validate()).toThrow('Missing required environment variables: NODE_ENV')
    })

    it('should throw error message containing missing variable name', () => {
      delete process.env.NODE_ENV
      expect(() => EnvConfig.validate()).toThrow(/NODE_ENV/)
    })

    it('should throw error when NODE_ENV is empty string', () => {
      // Empty string is considered as "set" but empty
      process.env.NODE_ENV = ''
      expect(() => EnvConfig.validate()).toThrow('Missing required environment variables: NODE_ENV')
    })

    it('should validate successfully with valid NODE_ENV values', () => {
      const validEnvs = ['development', 'test', 'production', 'staging']

      validEnvs.forEach((env) => {
        process.env.NODE_ENV = env
        expect(() => EnvConfig.validate()).not.toThrow()
      })
    })
  })

  describe('EnvConfig class', () => {
    it('should be instantiable', () => {
      process.env.NODE_ENV = 'test'
      const envConfig = new EnvConfig()
      expect(envConfig).toBeInstanceOf(EnvConfig)
    })

    it('should have static NODE_ENV property accessible without instantiation', () => {
      process.env.NODE_ENV = 'test'
      expect(EnvConfig.NODE_ENV).toBeDefined()
      expect(typeof EnvConfig.NODE_ENV).toBe('string')
    })

    it('should have static validate method accessible without instantiation', () => {
      process.env.NODE_ENV = 'test'
      expect(typeof EnvConfig.validate).toBe('function')
    })
  })
})

import { describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/shared/constants/error-codes.js'
import { HttpStatus } from '../../../src/shared/constants/http-status.js'
import { BaseException } from '../../../src/shared/exceptions/base.exception.js'
import { ExternalServiceException } from '../../../src/shared/exceptions/external-service.exception.js'

describe('ExternalServiceException', () => {
  describe('constructor', () => {
    it('should create an external service exception with message', () => {
      const message = 'External API call failed'
      const exception = new ExternalServiceException(message)

      expect(exception.message).toBe(message)
      expect(exception.code).toBe(ErrorCode.EXTERNAL_SERVICE_ERROR)
      expect(exception.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('should create an external service exception with details', () => {
      const message = 'Payment gateway error'
      const details = { service: 'stripe', statusCode: 503 }
      const exception = new ExternalServiceException(message, details)

      expect(exception.message).toBe(message)
      expect(exception.details).toEqual(details)
    })

    it('should work without details', () => {
      const exception = new ExternalServiceException('Error without details')
      expect(exception.details).toBeUndefined()
    })

    it('should set the correct name', () => {
      const exception = new ExternalServiceException('Error')
      expect(exception.name).toBe('ExternalServiceException')
    })

    it('should be instance of BaseException and Error', () => {
      const exception = new ExternalServiceException('Error')
      expect(exception).toBeInstanceOf(ExternalServiceException)
      expect(exception).toBeInstanceOf(BaseException)
      expect(exception).toBeInstanceOf(Error)
    })
  })

  describe('properties', () => {
    it('should always have INTERNAL_SERVER_ERROR status code', () => {
      const exception1 = new ExternalServiceException('Error 1')
      const exception2 = new ExternalServiceException('Error 2', { service: 'api' })

      expect(exception1.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(exception2.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(exception1.statusCode).toBe(500)
    })

    it('should always have EXTERNAL_SERVICE_ERROR code', () => {
      const exception1 = new ExternalServiceException('Error 1')
      const exception2 = new ExternalServiceException('Error 2', { service: 'api' })

      expect(exception1.code).toBe(ErrorCode.EXTERNAL_SERVICE_ERROR)
      expect(exception2.code).toBe(ErrorCode.EXTERNAL_SERVICE_ERROR)
    })
  })

  describe('toJSON', () => {
    it('should serialize with all properties', () => {
      const message = 'External service error'
      const details = { service: 'payment-api', endpoint: '/charge' }
      const exception = new ExternalServiceException(message, details)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'ExternalServiceException',
        message: message,
        code: ErrorCode.EXTERNAL_SERVICE_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: details,
      })
    })

    it('should serialize without details', () => {
      const message = 'External service error'
      const exception = new ExternalServiceException(message)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'ExternalServiceException',
        message: message,
        code: ErrorCode.EXTERNAL_SERVICE_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: undefined,
      })
    })
  })

  describe('common external service scenarios', () => {
    it('should handle API timeout', () => {
      const exception = new ExternalServiceException('API request timeout', {
        service: 'payment-gateway',
        url: 'https://api.stripe.com/v1/charges',
        timeout: 5000,
      })

      expect(exception.message).toContain('timeout')
      expect(exception.details).toHaveProperty('service', 'payment-gateway')
      expect(exception.statusCode).toBe(500)
    })

    it('should handle service unavailable', () => {
      const exception = new ExternalServiceException('Service unavailable', {
        service: 'email-service',
        statusCode: 503,
        retryAfter: 60,
      })

      expect(exception.message).toContain('unavailable')
      expect(exception.details).toHaveProperty('statusCode', 503)
    })

    it('should handle authentication failure', () => {
      const exception = new ExternalServiceException('API authentication failed', {
        service: 'google-api',
        endpoint: '/oauth/token',
        statusCode: 401,
      })

      expect(exception.details).toHaveProperty('service', 'google-api')
      expect(exception.details).toHaveProperty('statusCode', 401)
    })

    it('should handle rate limiting', () => {
      const exception = new ExternalServiceException('Rate limit exceeded', {
        service: 'twitter-api',
        limit: 100,
        remaining: 0,
        resetAt: new Date('2025-12-10T12:00:00Z'),
      })

      expect(exception.message).toContain('Rate limit')
      expect(exception.details).toHaveProperty('limit')
      expect(exception.details).toHaveProperty('remaining', 0)
    })

    it('should handle invalid response format', () => {
      const exception = new ExternalServiceException('Invalid response from service', {
        service: 'weather-api',
        expectedFormat: 'JSON',
        receivedFormat: 'XML',
      })

      expect(exception.message).toContain('Invalid response')
      expect(exception.details).toHaveProperty('expectedFormat')
    })

    it('should handle network error', () => {
      const exception = new ExternalServiceException('Network error', {
        service: 'cdn',
        error: 'ECONNREFUSED',
        host: 'cdn.example.com',
      })

      expect(exception.details).toHaveProperty('error', 'ECONNREFUSED')
      expect(exception.details).toHaveProperty('host')
    })
  })

  describe('error throwing', () => {
    it('should be throwable and catchable', () => {
      expect(() => {
        throw new ExternalServiceException('Service error')
      }).toThrow(ExternalServiceException)
    })

    it('should preserve details when caught', () => {
      const details = { service: 'api', statusCode: 500 }
      const error = new ExternalServiceException('API failed', details)
      expect(error).toBeInstanceOf(ExternalServiceException)
      expect(error.details).toEqual(details)
    })

    it('should be catchable as BaseException', () => {
      let caughtError: any
      try {
        throw new ExternalServiceException('Error')
      } catch (error) {
        caughtError = error
      }
      expect(caughtError).toBeInstanceOf(BaseException)
      expect(caughtError).toBeInstanceOf(ExternalServiceException)
    })
  })
})

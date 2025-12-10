import { describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/shared/constants/error-codes.js'
import { HttpStatus } from '../../../src/shared/constants/http-status.js'
import { BaseException } from '../../../src/shared/exceptions/base.exception.js'
import { InternalErrorException } from '../../../src/shared/exceptions/internal-error.exception.js'

describe('InternalErrorException', () => {
  describe('constructor', () => {
    it('should create an internal error exception with message', () => {
      const message = 'Unexpected error occurred'
      const exception = new InternalErrorException(message)

      expect(exception.message).toBe(message)
      expect(exception.code).toBe(ErrorCode.INTERNAL_ERROR)
      expect(exception.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('should create an internal error exception with details', () => {
      const message = 'System malfunction'
      const details = { component: 'cache', operation: 'flush' }
      const exception = new InternalErrorException(message, details)

      expect(exception.message).toBe(message)
      expect(exception.details).toEqual(details)
    })

    it('should work without details', () => {
      const exception = new InternalErrorException('Error without details')
      expect(exception.details).toBeUndefined()
    })

    it('should set the correct name', () => {
      const exception = new InternalErrorException('Error')
      expect(exception.name).toBe('InternalErrorException')
    })

    it('should be instance of BaseException and Error', () => {
      const exception = new InternalErrorException('Error')
      expect(exception).toBeInstanceOf(InternalErrorException)
      expect(exception).toBeInstanceOf(BaseException)
      expect(exception).toBeInstanceOf(Error)
    })
  })

  describe('properties', () => {
    it('should always have INTERNAL_SERVER_ERROR status code', () => {
      const exception1 = new InternalErrorException('Error 1')
      const exception2 = new InternalErrorException('Error 2', { module: 'auth' })

      expect(exception1.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(exception2.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(exception1.statusCode).toBe(500)
    })

    it('should always have INTERNAL_ERROR code', () => {
      const exception1 = new InternalErrorException('Error 1')
      const exception2 = new InternalErrorException('Error 2', { module: 'auth' })

      expect(exception1.code).toBe(ErrorCode.INTERNAL_ERROR)
      expect(exception2.code).toBe(ErrorCode.INTERNAL_ERROR)
    })
  })

  describe('toJSON', () => {
    it('should serialize with all properties', () => {
      const message = 'Internal error'
      const details = { stack: 'Error stack trace', module: 'payment' }
      const exception = new InternalErrorException(message, details)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'InternalErrorException',
        message: message,
        code: ErrorCode.INTERNAL_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: details,
      })
    })

    it('should serialize without details', () => {
      const message = 'Internal error'
      const exception = new InternalErrorException(message)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'InternalErrorException',
        message: message,
        code: ErrorCode.INTERNAL_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: undefined,
      })
    })
  })

  describe('common internal error scenarios', () => {
    it('should handle null pointer errors', () => {
      const exception = new InternalErrorException('Null reference error', {
        operation: 'getUserById',
        variable: 'userCache',
      })

      expect(exception.message).toContain('Null')
      expect(exception.details).toHaveProperty('operation')
      expect(exception.statusCode).toBe(500)
    })

    it('should handle configuration errors', () => {
      const exception = new InternalErrorException('Invalid configuration', {
        configKey: 'MAX_UPLOAD_SIZE',
        expectedType: 'number',
        actualType: 'string',
      })

      expect(exception.message).toContain('configuration')
      expect(exception.details).toHaveProperty('configKey')
    })

    it('should handle unhandled promise rejections', () => {
      const exception = new InternalErrorException('Unhandled promise rejection', {
        promise: 'fetchUserData',
        reason: 'Network timeout',
      })

      expect(exception.message).toContain('rejection')
      expect(exception.details).toHaveProperty('promise')
    })

    it('should handle memory errors', () => {
      const exception = new InternalErrorException('Out of memory', {
        heapUsed: 1024 * 1024 * 1024,
        heapLimit: 1024 * 1024 * 1024,
      })

      expect(exception.message).toContain('memory')
      expect(exception.details).toHaveProperty('heapUsed')
    })

    it('should handle assertion failures', () => {
      const exception = new InternalErrorException('Assertion failed', {
        assertion: 'user.age > 0',
        actualValue: -5,
      })

      expect(exception.message).toContain('Assertion')
      expect(exception.details).toHaveProperty('assertion')
    })

    it('should handle unexpected state errors', () => {
      const exception = new InternalErrorException('Invalid state transition', {
        currentState: 'PENDING',
        attemptedState: 'COMPLETED',
        validTransitions: ['PROCESSING', 'CANCELLED'],
      })

      expect(exception.details).toHaveProperty('currentState')
      expect(exception.details).toHaveProperty('validTransitions')
    })
  })

  describe('error throwing', () => {
    it('should be throwable and catchable', () => {
      expect(() => {
        throw new InternalErrorException('Internal error')
      }).toThrow(InternalErrorException)
    })

    it('should preserve details when caught', () => {
      const details = { component: 'logger', error: 'Write failed' }
      const error = new InternalErrorException('Logging failed', details)
      expect(error).toBeInstanceOf(InternalErrorException)
      expect(error.details).toEqual(details)
    })

    it('should be catchable as BaseException', () => {
      let caughtError: any
      try {
        throw new InternalErrorException('Error')
      } catch (error) {
        caughtError = error
      }
      expect(caughtError).toBeInstanceOf(BaseException)
      expect(caughtError).toBeInstanceOf(InternalErrorException)
    })
  })
})

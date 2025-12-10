import { describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/shared/constants/error-codes.js'
import { HttpStatus } from '../../../src/shared/constants/http-status.js'
import { BaseException } from '../../../src/shared/exceptions/base.exception.js'
import { ConflictException } from '../../../src/shared/exceptions/conflict.exception.js'

describe('ConflictException', () => {
  describe('constructor', () => {
    it('should create a conflict exception with message', () => {
      const message = 'Resource already exists'
      const exception = new ConflictException(message)

      expect(exception.message).toBe(message)
      expect(exception.code).toBe(ErrorCode.ALREADY_EXISTS)
      expect(exception.statusCode).toBe(HttpStatus.CONFLICT)
    })

    it('should create a conflict exception with details', () => {
      const message = 'Duplicate entry'
      const details = { field: 'email', value: 'test@example.com' }
      const exception = new ConflictException(message, details)

      expect(exception.message).toBe(message)
      expect(exception.details).toEqual(details)
    })

    it('should work without details', () => {
      const exception = new ConflictException('Error without details')
      expect(exception.details).toBeUndefined()
    })

    it('should set the correct name', () => {
      const exception = new ConflictException('Error')
      expect(exception.name).toBe('ConflictException')
    })

    it('should be instance of BaseException and Error', () => {
      const exception = new ConflictException('Error')
      expect(exception).toBeInstanceOf(ConflictException)
      expect(exception).toBeInstanceOf(BaseException)
      expect(exception).toBeInstanceOf(Error)
    })
  })

  describe('properties', () => {
    it('should always have CONFLICT status code', () => {
      const exception1 = new ConflictException('Error 1')
      const exception2 = new ConflictException('Error 2', { field: 'email' })

      expect(exception1.statusCode).toBe(HttpStatus.CONFLICT)
      expect(exception2.statusCode).toBe(HttpStatus.CONFLICT)
      expect(exception1.statusCode).toBe(409)
    })

    it('should always have ALREADY_EXISTS code', () => {
      const exception1 = new ConflictException('Error 1')
      const exception2 = new ConflictException('Error 2', { field: 'email' })

      expect(exception1.code).toBe(ErrorCode.ALREADY_EXISTS)
      expect(exception2.code).toBe(ErrorCode.ALREADY_EXISTS)
    })
  })

  describe('toJSON', () => {
    it('should serialize with all properties', () => {
      const message = 'Conflict error'
      const details = { resource: 'user', id: '123' }
      const exception = new ConflictException(message, details)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'ConflictException',
        message: message,
        code: ErrorCode.ALREADY_EXISTS,
        statusCode: HttpStatus.CONFLICT,
        details: details,
      })
    })

    it('should serialize without details', () => {
      const message = 'Conflict error'
      const exception = new ConflictException(message)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'ConflictException',
        message: message,
        code: ErrorCode.ALREADY_EXISTS,
        statusCode: HttpStatus.CONFLICT,
        details: undefined,
      })
    })
  })

  describe('common conflict scenarios', () => {
    it('should handle duplicate email error', () => {
      const exception = new ConflictException('Email already exists', {
        field: 'email',
        value: 'user@example.com',
        resource: 'user',
      })

      expect(exception.message).toBe('Email already exists')
      expect(exception.details).toHaveProperty('field', 'email')
      expect(exception.statusCode).toBe(409)
    })

    it('should handle duplicate username error', () => {
      const exception = new ConflictException('Username already taken', {
        field: 'username',
        value: 'johndoe',
      })

      expect(exception.message).toBe('Username already taken')
      expect(exception.details?.field).toBe('username')
    })

    it('should handle resource conflict with ID', () => {
      const exception = new ConflictException('User already exists', {
        resourceType: 'user',
        resourceId: 'user-123',
        conflictingField: 'email',
      })

      expect(exception.details).toHaveProperty('resourceType', 'user')
      expect(exception.details).toHaveProperty('resourceId', 'user-123')
    })

    it('should handle concurrent modification conflict', () => {
      const exception = new ConflictException('Resource was modified by another user', {
        resourceId: '456',
        expectedVersion: 1,
        actualVersion: 2,
      })

      expect(exception.message).toContain('modified')
      expect(exception.details).toHaveProperty('expectedVersion')
      expect(exception.details).toHaveProperty('actualVersion')
    })
  })

  describe('error throwing', () => {
    it('should be throwable and catchable', () => {
      expect(() => {
        throw new ConflictException('Conflict occurred')
      }).toThrow(ConflictException)
    })

    it('should preserve details when caught', () => {
      const details = { field: 'email', value: 'test@test.com' }
      const error = new ConflictException('Duplicate email', details)
      expect(error).toBeInstanceOf(ConflictException)
      expect(error.details).toEqual(details)
    })

    it('should be catchable as BaseException', () => {
      let caughtError: any
      try {
        throw new ConflictException('Error')
      } catch (error) {
        caughtError = error
      }
      expect(caughtError).toBeInstanceOf(BaseException)
      expect(caughtError).toBeInstanceOf(ConflictException)
    })
  })
})

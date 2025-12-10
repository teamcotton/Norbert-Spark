import { describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/shared/constants/error-codes.js'
import { HttpStatus } from '../../../src/shared/constants/http-status.js'
import { BaseException } from '../../../src/shared/exceptions/base.exception.js'
import { DatabaseException } from '../../../src/shared/exceptions/database.exception.js'

describe('DatabaseException', () => {
  describe('constructor', () => {
    it('should create a database exception with message', () => {
      const message = 'Database connection failed'
      const exception = new DatabaseException(message)

      expect(exception.message).toBe(message)
      expect(exception.code).toBe(ErrorCode.DATABASE_ERROR)
      expect(exception.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('should create a database exception with details', () => {
      const message = 'Query execution failed'
      const details = { query: 'SELECT * FROM users', error: 'Syntax error' }
      const exception = new DatabaseException(message, details)

      expect(exception.message).toBe(message)
      expect(exception.details).toEqual(details)
    })

    it('should work without details', () => {
      const exception = new DatabaseException('Error without details')
      expect(exception.details).toBeUndefined()
    })

    it('should set the correct name', () => {
      const exception = new DatabaseException('Error')
      expect(exception.name).toBe('DatabaseException')
    })

    it('should be instance of BaseException and Error', () => {
      const exception = new DatabaseException('Error')
      expect(exception).toBeInstanceOf(DatabaseException)
      expect(exception).toBeInstanceOf(BaseException)
      expect(exception).toBeInstanceOf(Error)
    })
  })

  describe('properties', () => {
    it('should always have INTERNAL_SERVER_ERROR status code', () => {
      const exception1 = new DatabaseException('Error 1')
      const exception2 = new DatabaseException('Error 2', { table: 'users' })

      expect(exception1.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(exception2.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(exception1.statusCode).toBe(500)
    })

    it('should always have DATABASE_ERROR code', () => {
      const exception1 = new DatabaseException('Error 1')
      const exception2 = new DatabaseException('Error 2', { table: 'users' })

      expect(exception1.code).toBe(ErrorCode.DATABASE_ERROR)
      expect(exception2.code).toBe(ErrorCode.DATABASE_ERROR)
    })
  })

  describe('toJSON', () => {
    it('should serialize with all properties', () => {
      const message = 'Database error'
      const details = { table: 'users', operation: 'insert' }
      const exception = new DatabaseException(message, details)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'DatabaseException',
        message: message,
        code: ErrorCode.DATABASE_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: details,
      })
    })

    it('should serialize without details', () => {
      const message = 'Database error'
      const exception = new DatabaseException(message)

      const json = exception.toJSON()

      expect(json).toEqual({
        name: 'DatabaseException',
        message: message,
        code: ErrorCode.DATABASE_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: undefined,
      })
    })
  })

  describe('common database scenarios', () => {
    it('should handle connection failure', () => {
      const exception = new DatabaseException('Failed to connect to database', {
        host: 'localhost',
        port: 5432,
        database: 'myapp',
        errorCode: 'ECONNREFUSED',
      })

      expect(exception.message).toContain('connect')
      expect(exception.details).toHaveProperty('host', 'localhost')
      expect(exception.statusCode).toBe(500)
    })

    it('should handle query timeout', () => {
      const exception = new DatabaseException('Query execution timeout', {
        query: 'SELECT * FROM large_table',
        timeout: 30000,
      })

      expect(exception.message).toContain('timeout')
      expect(exception.details).toHaveProperty('timeout')
    })

    it('should handle constraint violation', () => {
      const exception = new DatabaseException('Foreign key constraint violation', {
        constraint: 'fk_user_id',
        table: 'orders',
        column: 'user_id',
      })

      expect(exception.details).toHaveProperty('constraint')
      expect(exception.details).toHaveProperty('table')
    })

    it('should handle transaction rollback', () => {
      const exception = new DatabaseException('Transaction rolled back', {
        transactionId: 'txn-123',
        reason: 'Deadlock detected',
      })

      expect(exception.message).toContain('rolled back')
      expect(exception.details).toHaveProperty('transactionId')
    })

    it('should handle pool exhaustion', () => {
      const exception = new DatabaseException('Connection pool exhausted', {
        poolSize: 10,
        activeConnections: 10,
        waitingRequests: 5,
      })

      expect(exception.message).toContain('pool')
      expect(exception.details).toHaveProperty('poolSize')
    })
  })

  describe('error throwing', () => {
    it('should be throwable and catchable', () => {
      expect(() => {
        throw new DatabaseException('Database error')
      }).toThrow(DatabaseException)
    })

    it('should preserve details when caught', () => {
      const details = { table: 'users', operation: 'delete' }
      const error = new DatabaseException('Delete failed', details)
      expect(error).toBeInstanceOf(DatabaseException)
      expect(error.details).toEqual(details)
    })

    it('should be catchable as BaseException', () => {
      let caughtError: any
      try {
        throw new DatabaseException('Error')
      } catch (error) {
        caughtError = error
      }
      expect(caughtError).toBeInstanceOf(BaseException)
      expect(caughtError).toBeInstanceOf(DatabaseException)
    })
  })
})

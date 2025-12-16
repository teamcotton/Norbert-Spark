import type { FastifyRequest } from 'fastify'
import { describe, expect, it } from 'vitest'

import { FastifyUtil } from '../../../src/shared/utils/fastify.utils.js'

describe('FastifyUtil', () => {
  describe('createResponse', () => {
    describe('Basic Response Creation', () => {
      it('should create a response with default status 200', async () => {
        const message = 'success'
        const response = FastifyUtil.createResponse(message)

        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('application/json')
        const text = await response.text()
        expect(text).toBe(message)
      })

      it('should create a response with custom status code', async () => {
        const message = 'Not Found'
        const response = FastifyUtil.createResponse(message, 404)

        expect(response.status).toBe(404)
        const text = await response.text()
        expect(text).toBe(message)
      })

      it('should create a response with status 201 (Created)', async () => {
        const message = 'Created'
        const response = FastifyUtil.createResponse(message, 201)

        expect(response.status).toBe(201)
        const text = await response.text()
        expect(text).toBe(message)
      })

      it('should create a response with status 500 (Server Error)', async () => {
        const message = 'Internal Server Error'
        const response = FastifyUtil.createResponse(message, 500)

        expect(response.status).toBe(500)
        const text = await response.text()
        expect(text).toBe(message)
      })
    })

    describe('Body Serialization', () => {
      it('should handle simple string message', async () => {
        const message = 'simple string'
        const response = FastifyUtil.createResponse(message)

        const text = await response.text()
        expect(text).toBe('simple string')
      })

      it('should handle JSON stringified object', async () => {
        const message = JSON.stringify({ value: 42 })
        const response = FastifyUtil.createResponse(message)

        const data = await response.json()
        expect(data).toEqual({ value: 42 })
      })

      it('should handle JSON stringified boolean', async () => {
        const message = JSON.stringify(true)
        const response = FastifyUtil.createResponse(message)

        const data = await response.json()
        expect(data).toBe(true)
      })

      it('should handle JSON stringified null', async () => {
        const message = JSON.stringify(null)
        const response = FastifyUtil.createResponse(message)

        const data = await response.json()
        expect(data).toBeNull()
      })

      it('should handle JSON stringified array', async () => {
        const message = JSON.stringify([1, 2, 3, 4, 5])
        const response = FastifyUtil.createResponse(message)

        const data = await response.json()
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

      it('should handle JSON stringified nested object', async () => {
        const obj = {
          user: {
            name: 'John',
            address: {
              street: '123 Main St',
              city: 'New York',
            },
          },
        }
        const message = JSON.stringify(obj)
        const response = FastifyUtil.createResponse(message)

        const data = await response.json()
        expect(data).toEqual(obj)
      })

      it('should handle empty string', async () => {
        const message = ''
        const response = FastifyUtil.createResponse(message)

        const text = await response.text()
        expect(text).toBe('')
      })

      it('should handle JSON stringified empty array', async () => {
        const message = JSON.stringify([])
        const response = FastifyUtil.createResponse(message)

        const data = await response.json()
        expect(data).toEqual([])
      })
    })

    describe('Edge Cases', () => {
      it('should handle message with special characters', async () => {
        const message = 'Hello "World" & <Test>'
        const response = FastifyUtil.createResponse(message)

        const text = await response.text()
        expect(text).toBe(message)
      })

      it('should handle message with unicode characters', async () => {
        const message = '你好世界 🌍'
        const response = FastifyUtil.createResponse(message)

        const text = await response.text()
        expect(text).toBe(message)
      })

      it('should create multiple independent responses', async () => {
        const response1 = FastifyUtil.createResponse('First message', 200)
        const response2 = FastifyUtil.createResponse('Second message', 201)

        expect(response1.status).toBe(200)
        expect(response2.status).toBe(201)

        const text1 = await response1.text()
        const text2 = await response2.text()

        expect(text1).toBe('First message')
        expect(text2).toBe('Second message')
      })
    })

    describe('Status Code Edge Cases', () => {
      it('should handle status code 200', async () => {
        const response = FastifyUtil.createResponse('test message', 200)
        expect(response.status).toBe(200)
      })

      it('should handle large status code', async () => {
        const response = FastifyUtil.createResponse('test message', 599)
        expect(response.status).toBe(599)
      })

      it('should handle status code 400', async () => {
        const response = FastifyUtil.createResponse('test message', 400)
        expect(response.status).toBe(400)
      })
    })
  })

  describe('convertFastifyRequest', () => {
    describe('Basic Header Conversion', () => {
      it('should convert string headers correctly', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
            authorization: 'Bearer token123',
          },
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers).toEqual({
          'content-type': 'application/json',
          authorization: 'Bearer token123',
        })
      })

      it('should convert array headers to comma-separated string', () => {
        const mockRequest = {
          headers: {
            accept: 'application/json',
            'accept-encoding': ['gzip', 'deflate', 'br'],
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers).toEqual({
          accept: 'application/json',
          'accept-encoding': 'gzip, deflate, br',
        })
      })

      it('should handle empty headers object', () => {
        const mockRequest = {
          headers: {},
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers).toEqual({})
      })

      it('should handle single-element array header', () => {
        const mockRequest = {
          headers: {
            'x-custom-header': ['value1'],
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['x-custom-header']).toBe('value1')
      })
    })

    describe('Mixed Header Types', () => {
      it('should handle mix of string and array headers', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
            accept: ['text/html', 'application/json'],
            authorization: 'Bearer token',
            'x-forwarded-for': ['192.168.1.1', '10.0.0.1'],
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers).toEqual({
          'content-type': 'application/json',
          accept: 'text/html, application/json',
          authorization: 'Bearer token',
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        })
      })

      it('should preserve header key casing', () => {
        const mockRequest = {
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value',
            'UPPERCASE-HEADER': 'value',
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['Content-Type']).toBe('application/json')
        expect(result.headers['X-Custom-Header']).toBe('custom-value')
        expect(result.headers['UPPERCASE-HEADER']).toBe('value')
      })
    })

    describe('Edge Cases', () => {
      it('should skip undefined header values', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
            'undefined-header': undefined,
            'valid-header': 'value',
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers).toEqual({
          'content-type': 'application/json',
          'valid-header': 'value',
        })
        expect(result.headers['undefined-header']).toBeUndefined()
      })

      it('should handle empty array header', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
            'empty-array': [],
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['empty-array']).toBe('')
      })

      it('should handle special characters in header values', () => {
        const mockRequest = {
          headers: {
            'x-special': 'value with "quotes" and <brackets>',
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['x-special']).toBe('value with "quotes" and <brackets>')
      })

      it('should handle unicode in header values', () => {
        const mockRequest = {
          headers: {
            'x-unicode': '你好世界',
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['x-unicode']).toBe('你好世界')
      })

      it('should handle array with empty strings', () => {
        const mockRequest = {
          headers: {
            'x-array': ['', 'value', ''],
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['x-array']).toBe(', value, ')
      })
    })

    describe('Common HTTP Headers', () => {
      it('should convert standard HTTP headers correctly', () => {
        const mockRequest = {
          headers: {
            host: 'example.com',
            'user-agent': 'Mozilla/5.0',
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'accept-encoding': 'gzip, deflate',
            connection: 'keep-alive',
            'content-type': 'application/json',
            'content-length': '123',
          },
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers.host).toBe('example.com')
        expect(result.headers['user-agent']).toBe('Mozilla/5.0')
        expect(result.headers.accept).toBe('application/json')
        expect(result.headers['accept-language']).toBe('en-US,en;q=0.9')
        expect(result.headers['accept-encoding']).toBe('gzip, deflate')
        expect(result.headers.connection).toBe('keep-alive')
        expect(result.headers['content-type']).toBe('application/json')
        expect(result.headers['content-length']).toBe('123')
      })

      it('should handle authorization header formats', () => {
        const mockRequest = {
          headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers.authorization).toBe('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      })

      it('should handle cookie header', () => {
        const mockRequest = {
          headers: {
            cookie: 'sessionId=abc123; userId=456; theme=dark',
          },
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers.cookie).toBe('sessionId=abc123; userId=456; theme=dark')
      })
    })

    describe('Return Value Structure', () => {
      it('should return object with headers property', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
          },
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result).toHaveProperty('headers')
        expect(typeof result.headers).toBe('object')
      })

      it('should return new object each time (not mutating)', () => {
        const mockRequest = {
          headers: {
            'content-type': 'application/json',
          },
        } as FastifyRequest

        const result1 = FastifyUtil.convertFastifyRequest(mockRequest)
        const result2 = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result1).not.toBe(result2)
        expect(result1.headers).not.toBe(result2.headers)
        expect(result1).toEqual(result2)
      })
    })

    describe('Multiple Headers Conversion', () => {
      it('should handle large number of headers', () => {
        const headers: Record<string, string> = {}
        for (let i = 0; i < 100; i++) {
          headers[`x-header-${i}`] = `value-${i}`
        }

        const mockRequest = {
          headers,
        } as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(Object.keys(result.headers)).toHaveLength(100)
        expect(result.headers['x-header-0']).toBe('value-0')
        expect(result.headers['x-header-99']).toBe('value-99')
      })

      it('should handle array headers with many values', () => {
        const mockRequest = {
          headers: {
            'x-many-values': ['val1', 'val2', 'val3', 'val4', 'val5'],
          },
        } as unknown as FastifyRequest

        const result = FastifyUtil.convertFastifyRequest(mockRequest)

        expect(result.headers['x-many-values']).toBe('val1, val2, val3, val4, val5')
      })
    })
  })
})

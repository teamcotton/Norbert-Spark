import { beforeEach, describe, expect, it } from 'vitest'

import { TokeniseOpenAI } from '../../../src/infrastructure/ai/tokeniseOpenAI.js'

describe('TokeniseOpenAI', () => {
  describe('Singleton Pattern', () => {
    beforeEach(() => {
      // Reset the singleton instance between tests
      // @ts-expect-error - Accessing private static property for testing
      TokeniseOpenAI.instance = undefined
    })

    it('should return the same instance on multiple calls to getInstance', () => {
      const instance1 = TokeniseOpenAI.getInstance()
      const instance2 = TokeniseOpenAI.getInstance()

      expect(instance1).toBe(instance2)
    })

    it('should create only one instance', () => {
      const instance1 = TokeniseOpenAI.getInstance()
      const instance2 = TokeniseOpenAI.getInstance()
      const instance3 = TokeniseOpenAI.getInstance()

      expect(instance1).toBe(instance2)
      expect(instance2).toBe(instance3)
    })

    it('should have getInstance as a static method', () => {
      expect(typeof TokeniseOpenAI.getInstance).toBe('function')
    })

    it('should have a private constructor (TypeScript compile-time check)', () => {
      // This test documents that the constructor is private
      // TypeScript prevents direct instantiation at compile time
      const instance = TokeniseOpenAI.getInstance()
      expect(instance).toBeDefined()
    })
  })

  describe('tokeniseFile', () => {
    let tokenizer: TokeniseOpenAI

    beforeEach(() => {
      // Reset the singleton instance between tests
      // @ts-expect-error - Accessing private static property for testing
      TokeniseOpenAI.instance = undefined
      tokenizer = TokeniseOpenAI.getInstance()
    })

    it('should tokenize a simple text file', () => {
      const tokens = tokenizer.tokeniseFile('sample.txt')

      expect(Array.isArray(tokens)).toBe(true)
      expect(tokens.length).toBeGreaterThan(0)
      expect(tokens.every((token) => typeof token === 'number')).toBe(true)
    })

    it('should tokenize an empty file', () => {
      const tokens = tokenizer.tokeniseFile('empty.txt')

      expect(Array.isArray(tokens)).toBe(true)
      expect(tokens.length).toBe(0)
    })

    it('should tokenize files with special characters', () => {
      const tokens = tokenizer.tokeniseFile('special-chars.txt')

      expect(Array.isArray(tokens)).toBe(true)
      expect(tokens.length).toBeGreaterThan(0)
      expect(tokens.every((token) => typeof token === 'number')).toBe(true)
    })

    it('should return consistent tokens for the same file', () => {
      const tokens1 = tokenizer.tokeniseFile('sample.txt')
      const tokens2 = tokenizer.tokeniseFile('sample.txt')

      expect(tokens1).toEqual(tokens2)
    })

    it('should return different tokens for different files', () => {
      const tokens1 = tokenizer.tokeniseFile('sample.txt')
      const tokens2 = tokenizer.tokeniseFile('special-chars.txt')

      expect(tokens1).not.toEqual(tokens2)
    })
  })

  describe('Path Validation', () => {
    let tokenizer: TokeniseOpenAI

    beforeEach(() => {
      // Reset the singleton instance between tests
      // @ts-expect-error - Accessing private static property for testing
      TokeniseOpenAI.instance = undefined
      tokenizer = TokeniseOpenAI.getInstance()
    })

    it('should reject paths with parent directory traversal (..)', () => {
      expect(() => tokenizer.tokeniseFile('../secret.txt')).toThrow('Invalid file path')
    })

    it('should reject paths with forward slashes', () => {
      expect(() => tokenizer.tokeniseFile('subdir/file.txt')).toThrow('Invalid file path')
    })

    it('should reject paths with backslashes', () => {
      expect(() => tokenizer.tokeniseFile('subdir\\file.txt')).toThrow('Invalid file path')
    })

    it('should reject paths with multiple parent directory traversals', () => {
      expect(() => tokenizer.tokeniseFile('../../etc/passwd')).toThrow('Invalid file path')
    })
  })

  describe('Error Handling', () => {
    let tokenizer: TokeniseOpenAI

    beforeEach(() => {
      // Reset the singleton instance between tests
      // @ts-expect-error - Accessing private static property for testing
      TokeniseOpenAI.instance = undefined
      tokenizer = TokeniseOpenAI.getInstance()
    })

    it('should throw an error for non-existent files', () => {
      expect(() => tokenizer.tokeniseFile('non-existent-file.txt')).toThrow(
        /Failed to tokenize file "non-existent-file.txt"/
      )
    })

    it('should include the original error message in the thrown error', () => {
      expect(() => tokenizer.tokeniseFile('non-existent-file.txt')).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Failed to tokenize file'),
        })
      )
      expect(() => tokenizer.tokeniseFile('non-existent-file.txt')).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('non-existent-file.txt'),
        })
      )
    })
  })

  describe('Integration', () => {
    it('should work with the same tokenizer instance across multiple calls', () => {
      const instance1 = TokeniseOpenAI.getInstance()
      const instance2 = TokeniseOpenAI.getInstance()

      const tokens1 = instance1.tokeniseFile('sample.txt')
      const tokens2 = instance2.tokeniseFile('sample.txt')

      expect(tokens1).toEqual(tokens2)
      expect(instance1).toBe(instance2)
    })

    it('should handle multiple file tokenizations in sequence', () => {
      const tokenizer = TokeniseOpenAI.getInstance()

      const tokens1 = tokenizer.tokeniseFile('sample.txt')
      const tokens2 = tokenizer.tokeniseFile('empty.txt')
      const tokens3 = tokenizer.tokeniseFile('special-chars.txt')

      expect(tokens1.length).toBeGreaterThan(0)
      expect(tokens2.length).toBe(0)
      expect(tokens3.length).toBeGreaterThan(0)
    })
  })

  describe('Token Properties', () => {
    let tokenizer: TokeniseOpenAI

    beforeEach(() => {
      // Reset the singleton instance between tests
      // @ts-expect-error - Accessing private static property for testing
      TokeniseOpenAI.instance = undefined
      tokenizer = TokeniseOpenAI.getInstance()
    })

    it('should return an array of numbers', () => {
      const tokens = tokenizer.tokeniseFile('sample.txt')

      expect(Array.isArray(tokens)).toBe(true)
      tokens.forEach((token) => {
        expect(typeof token).toBe('number')
        expect(Number.isInteger(token)).toBe(true)
      })
    })

    it('should return positive token IDs', () => {
      const tokens = tokenizer.tokeniseFile('sample.txt')

      tokens.forEach((token) => {
        expect(token).toBeGreaterThanOrEqual(0)
      })
    })
  })
})

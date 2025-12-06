import { describe, expect, it } from 'vitest'

import { Email } from '../../../src/domain/value-objects/email.js'

describe('Email', () => {
  describe('constructor', () => {
    it('should create an email with valid email address', () => {
      const email = new Email('test@example.com')
      expect(email).toBeInstanceOf(Email)
      expect(email.getValue()).toBe('test@example.com')
    })

    it('should convert email to lowercase', () => {
      const email = new Email('TEST@EXAMPLE.COM')
      expect(email.getValue()).toBe('test@example.com')
    })

    it('should trim whitespace from email', () => {
      const email = new Email('  test@example.com  ')
      expect(email.getValue()).toBe('test@example.com')
    })

    it('should trim and lowercase email', () => {
      const email = new Email('  TEST@EXAMPLE.COM  ')
      expect(email.getValue()).toBe('test@example.com')
    })

    it('should throw error for invalid email format', () => {
      expect(() => new Email('invalid-email')).toThrow('Invalid email format')
    })

    it('should throw error for email without @', () => {
      expect(() => new Email('testexample.com')).toThrow('Invalid email format')
    })

    it('should throw error for email without domain', () => {
      expect(() => new Email('test@')).toThrow('Invalid email format')
    })

    it('should throw error for email without local part', () => {
      expect(() => new Email('@example.com')).toThrow('Invalid email format')
    })

    it('should throw error for email without TLD', () => {
      expect(() => new Email('test@example')).toThrow('Invalid email format')
    })

    it('should throw error for email with spaces', () => {
      expect(() => new Email('test @example.com')).toThrow('Invalid email format')
    })

    it('should throw error for empty string', () => {
      expect(() => new Email('')).toThrow('Invalid email format')
    })
  })

  describe('getValue', () => {
    it('should return the email value', () => {
      const email = new Email('user@domain.com')
      expect(email.getValue()).toBe('user@domain.com')
    })

    it('should return normalized email value', () => {
      const email = new Email('  USER@DOMAIN.COM  ')
      expect(email.getValue()).toBe('user@domain.com')
    })
  })

  describe('equals', () => {
    it('should return true for identical emails', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('test@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return true for emails with different casing', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('TEST@EXAMPLE.COM')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return true for emails with whitespace differences', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('  test@example.com  ')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('other@example.com')
      expect(email1.equals(email2)).toBe(false)
    })

    it('should return false for different domains', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('test@other.com')
      expect(email1.equals(email2)).toBe(false)
    })

    it('should handle comparison with itself', () => {
      const email = new Email('test@example.com')
      expect(email.equals(email)).toBe(true)
    })
  })

  describe('valid email formats', () => {
    it('should accept standard email format', () => {
      const email = new Email('user@example.com')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should accept email with subdomain', () => {
      const email = new Email('user@mail.example.com')
      expect(email.getValue()).toBe('user@mail.example.com')
    })

    it('should accept email with numbers', () => {
      const email = new Email('user123@example456.com')
      expect(email.getValue()).toBe('user123@example456.com')
    })

    it('should accept email with dots in local part', () => {
      const email = new Email('first.last@example.com')
      expect(email.getValue()).toBe('first.last@example.com')
    })

    it('should accept email with plus sign', () => {
      const email = new Email('user+tag@example.com')
      expect(email.getValue()).toBe('user+tag@example.com')
    })

    it('should accept email with hyphen in domain', () => {
      const email = new Email('user@my-domain.com')
      expect(email.getValue()).toBe('user@my-domain.com')
    })

    it('should accept email with underscore', () => {
      const email = new Email('user_name@example.com')
      expect(email.getValue()).toBe('user_name@example.com')
    })

    it('should accept email with long TLD', () => {
      const email = new Email('user@example.museum')
      expect(email.getValue()).toBe('user@example.museum')
    })
  })

  describe('immutability', () => {
    it('should not allow modification of value through getValue', () => {
      const email = new Email('test@example.com')
      const value = email.getValue()
      expect(value).toBe('test@example.com')
      // Value is a string primitive, so it's already immutable
      expect(email.getValue()).toBe('test@example.com')
    })

    it('should maintain original value after equals comparison', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('other@example.com')
      email1.equals(email2)
      expect(email1.getValue()).toBe('test@example.com')
      expect(email2.getValue()).toBe('other@example.com')
    })
  })

  describe('type safety', () => {
    it('should work with string literal types', () => {
      const email = new Email('typed@example.com' as const)
      expect(email.getValue()).toBe('typed@example.com')
    })

    it('should work with generic string types', () => {
      const emailString: string = 'generic@example.com'
      const email = new Email(emailString)
      expect(email.getValue()).toBe('generic@example.com')
    })
  })
})

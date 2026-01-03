import { Uuid7Util } from '../../shared/utils/uuid7.util.js'

/**
 * Unique symbol for UUID branding to ensure type safety.
 * This prevents regular strings from being used where UUID types are expected.
 */
declare const UserIdBrand: unique symbol

/**
 * Branded UUIDType that wraps the Uuid class with compile-time type safety.
 * The brand ensures that only validated Uuid instances can be used where this type is expected.
 *
 * @template T - The string literal type of the uuid (defaults to string)
 */
export type UserIdType<T extends string = string> = UserId<T> & { readonly [UserIdBrand]: T }

export class UserId<T> {
  private readonly value: string | undefined
  declare readonly [UserIdBrand]: T

  constructor(value: string) {
    this.value = this.processUserIdUUID(value)
  }

  private processUserIdUUID(userUUID: string): string | undefined {
    if (!Uuid7Util.isValidUUID(userUUID)) {
      throw new Error('Invalid UUID format provided')
    }
    return Uuid7Util.uuidVersionValidation(userUUID)
  }

  getValue(): string | undefined {
    return this.value
  }
}

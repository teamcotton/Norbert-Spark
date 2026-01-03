import { Uuid7Util } from '../../shared/utils/uuid7.util.js'

/**
 * Unique symbol for UUID branding to ensure type safety.
 * This prevents regular strings from being used where UUID types are expected.
 */
declare const UserIdBrand: unique symbol

/**
 * Branded type for User IDs that ensures type safety at compile time.
 * The brand prevents regular strings from being used where UserIdType is expected,
 * enforcing proper validation through the UserId class.
 *
 * @template T - The string literal type of the UUID (defaults to string)
 */
export type UserIdType<T extends string = string> = string & { readonly [UserIdBrand]: T }

function brandUserId<T extends string>(value: string): UserIdType<T> {
  return value as UserIdType<T>
}

export class UserId<T extends string = string> {
  private readonly value: UserIdType<T>
  declare readonly [UserIdBrand]: T

  constructor(value: string) {
    this.value = this.processUserIdUUID(value)
  }

  private processUserIdUUID<T extends string = string>(userUUID: string): UserIdType<T> {
    if (!Uuid7Util.isValidUUID(userUUID)) {
      throw new Error('Invalid UUID format provided')
    }
    // Validate the UUID version but return the UUID itself, not the version string
    const version = Uuid7Util.uuidVersionValidation(userUUID)
    if (version !== 'v7') {
      throw new Error(`Invalid UUID version: ${version}`)
    }
    return brandUserId<T>(userUUID)
  }

  getValue(): UserIdType {
    return this.value
  }
}

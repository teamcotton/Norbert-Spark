import { ValidationException } from '../../shared/exceptions/validation.exception.js'

export class RegisterUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string
  ) {}

  static validate(data: any): RegisterUserDto {
    if (!data.email || typeof data.email !== 'string') {
      throw new ValidationException('Email is required and must be a string')
    }
    if (!data.password || typeof data.password !== 'string') {
      throw new ValidationException('Password is required and must be a string')
    }
    if (!data.name || typeof data.name !== 'string') {
      throw new ValidationException('Name is required and must be a string')
    }

    return new RegisterUserDto(data.email, data.password, data.name)
  }
}

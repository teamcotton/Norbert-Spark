import { LoginUserDto } from '../dtos/login-user.dto.js'
import type { UserRepositoryPort } from '../ports/user.repository.port.js'
import type { LoggerPort } from '../ports/logger.port.js'
import type { TokenGeneratorPort } from '../ports/token-generator.port.js'
import { UnauthorizedException } from '../../shared/exceptions/unauthorized.exception.js'

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: LoggerPort,
    private readonly tokenGenerator: TokenGeneratorPort
  ) {}

  async execute(dto: LoginUserDto): Promise<{
    userId: string
    email: string
    access_token: string
    roles: string[]
  }> {
    this.logger.info('User login attempt', { email: dto.email })

    const user = await this.userRepository.findByEmail(dto.email)

    if (!user) {
      this.logger.warn('Login failed: User not found', { email: dto.email })
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordValid = await user.verifyPassword(dto.password)

    if (!isPasswordValid) {
      this.logger.warn('Login failed: Invalid password', { email: dto.email, userId: user.id })
      throw new UnauthorizedException('Invalid email or password')
    }

    this.logger.info('User logged in successfully', { userId: user.id, email: dto.email })

    // Generate JWT access token
    const accessToken = this.tokenGenerator.generateToken({
      sub: user.id,
      email: user.getEmail(),
      roles: [user.getRole()],
    })

    return {
      userId: user.id,
      email: user.getEmail(),
      access_token: accessToken,
      roles: [user.getRole()],
    }
  }
}

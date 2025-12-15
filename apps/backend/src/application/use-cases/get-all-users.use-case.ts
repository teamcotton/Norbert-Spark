import type { UserRepositoryPort } from '../ports/user.repository.port.js'
import type { LoggerPort } from '../ports/logger.port.js'

export interface UserDto {
  userId: string
  email: string
  name: string
  role: string
  createdAt: Date
}

export class GetAllUsersUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: LoggerPort
  ) {}

  async execute(): Promise<UserDto[]> {
    this.logger.info('Fetching all users')

    try {
      const users = await this.userRepository.findAll()

      const userDtos = users.map((user) => ({
        userId: user.id,
        email: user.getEmail(),
        name: user.getName(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
      }))

      this.logger.info('Successfully fetched all users', { count: userDtos.length })

      return userDtos
    } catch (error) {
      this.logger.error('Failed to fetch all users', error as Error)
      throw error
    }
  }
}

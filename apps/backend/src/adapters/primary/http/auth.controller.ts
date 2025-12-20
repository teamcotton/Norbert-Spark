import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case.js'
import { LoginUserDto } from '../../../application/dtos/login-user.dto.js'
import { BaseException } from '../../../shared/exceptions/base.exception.js'

export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  registerRoutes(app: FastifyInstance): void {
    app.post('/auth/login', this.login.bind(this))
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Convert HTTP request to DTO
      const dto = LoginUserDto.validate(request.body)

      // Execute use case
      const result = await this.loginUserUseCase.execute(dto)

      // Convert result to HTTP response
      reply.code(200).send({
        success: true,
        data: result,
      })
    } catch (error) {
      const err = error as Error
      const statusCode = err instanceof BaseException ? err.statusCode : 500
      const errorMessage = err?.message || 'An unexpected error occurred'
      reply.code(statusCode).send({
        success: false,
        error: errorMessage,
      })
    }
  }
}

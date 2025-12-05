import dotenv from 'dotenv'

dotenv.config()

const requiredEnvs: string[] = ['NODE_ENV']

export class EnvConfig {
  static get NODE_ENV(): string {
    return process.env.NODE_ENV || 'development'
  }

  static validate(): void {
    const missing = requiredEnvs.filter((key) => !process.env[key])

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
}

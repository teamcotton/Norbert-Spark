import dotenv from 'dotenv'
import { obscured } from 'obscured'

dotenv.config()

const requiredEnvs: string[] = ['DATABASE_URL']

export class EnvConfig {
  static readonly NODE_ENV = process.env.NODE_ENV || 'development'
  static readonly DATABASE_URL = obscured.make(process.env.DATABASE_URL)

  static validate(): void {
    const missing = requiredEnvs.filter((key) => !process.env[key])

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
}

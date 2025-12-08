import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { obscured } from 'obscured'
import { EnvConfig } from '../config/env.config.js'
import { ValidationException } from '../../shared/exceptions/validation.exception.js'

const connectionString = obscured.value(EnvConfig.DATABASE_URL)
if (!connectionString) {
  throw new ValidationException('DATABASE_URL is required but not configured')
}

export const pool = new Pool({
  connectionString: obscured.value(EnvConfig.DATABASE_URL),
  ssl:
    EnvConfig.DATABASE_SSL_ENABLED === 'true'
      ? { rejectUnauthorized: EnvConfig.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' }
      : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
  min: 5,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export const db = drizzle(pool)

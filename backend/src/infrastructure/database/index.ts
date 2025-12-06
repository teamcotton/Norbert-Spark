import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { obscured } from 'obscured'
import { EnvConfig } from '../config/env.config.js'

const pool = new Pool({
  connectionString: obscured.value(EnvConfig.DATABASE_URL),
  ssl: EnvConfig.NODE_ENV === 'production',
})

export const db = drizzle(pool)

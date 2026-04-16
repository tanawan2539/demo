import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../config/env'
import * as schema from './schema'

/** PostgreSQL connection */
const client = postgres(env.DATABASE_URL, {
  max: Number(process.env.DB_POOL_SIZE || '10'),
  idle_timeout: Number(process.env.DB_IDLE_TIMEOUT || '20'),
  connect_timeout: Number(process.env.DB_CONNECT_TIMEOUT || '10'),
})

/** Drizzle ORM instance */
export const db = drizzle(client, { schema })

export type Database = typeof db

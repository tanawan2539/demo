import knex from 'knex'
import { env } from '../config/env'

/**
 * Query builder แบบ `db('table').select(...).where(...).first()`
 * แยกจาก Drizzle ที่ `import { db } from '../../db'`
 */
export const db = knex({
  client: 'pg',
  connection: env.DATABASE_URL,
  pool: { min: 0, max: 10 },
})

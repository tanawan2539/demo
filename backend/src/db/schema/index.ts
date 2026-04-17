import { pgTable, serial, varchar, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const broker = pgTable('broker', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 250 }),
  slug: varchar('slug', { length: 250 }).notNull(),
  description: text('description'),
  logo_url: varchar('logo_url', { length: 250 }),
  website: varchar('website', { length: 250 }),
  broker_type: varchar('broker_type', { length: 250 }),
  created_at: timestamp('created_at').default(sql`now()`),
  events: jsonb('events'),
  status_del: integer('status_del').default(0),
})

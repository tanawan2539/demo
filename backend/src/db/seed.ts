/**
 * Seed script — สร้าง admin user เริ่มต้น
 * ใช้: bun run db:seed
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { users } from './schema'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌ ต้องระบุ DATABASE_URL')
  process.exit(1)
}

const client = postgres(DATABASE_URL)
const db = drizzle(client)

const SEED_USERS = [
  {
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin',
  },
  {
    email: 'user@example.com',
    password: 'password123',
    name: 'User',
  },
]

async function seed() {
  console.log('🌱 Seeding database...\n')

  for (const userData of SEED_USERS) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1)

    if (existing) {
      console.log(`  ⏭️  ${userData.email} — มีอยู่แล้ว`)
      continue
    }

    const hashedPassword = await Bun.password.hash(userData.password, {
      algorithm: 'bcrypt',
      cost: 12,
    })

    await db.insert(users).values({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
    })

    console.log(`  ✅ ${userData.email} — สร้างแล้ว`)
  }

  console.log('\n🎉 Seed เสร็จเรียบร้อย!')
  console.log('\n📋 ข้อมูล login:')
  for (const u of SEED_USERS) {
    console.log(`   ${u.email} / ${u.password}`)
  }

  await client.end()
}

seed().catch((err) => {
  console.error('❌ Seed ล้มเหลว:', err)
  process.exit(1)
})

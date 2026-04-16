import { t } from 'elysia'

/** ตรวจสอบ environment variables ที่จำเป็น */
const envSchema = t.Object({
  PORT: t.Number({ default: 5007 }),
  NODE_ENV: t.Union([t.Literal('development'), t.Literal('production'), t.Literal('test')], {
    default: 'development',
  }),
  DATABASE_URL: t.String({ minLength: 1 }),
  CORS_ORIGINS: t.String({ default: '*' }),
})

type Env = typeof envSchema.static

function loadEnv(): Env {
  const nodeEnv = (process.env.NODE_ENV as Env['NODE_ENV']) || 'development'

  const config: Env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5007,
    NODE_ENV: nodeEnv,
    DATABASE_URL: process.env.DATABASE_URL || '',
    CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
  }

  // บังคับ validate ค่าสำคัญ (ยกเว้น test mode)
  if (nodeEnv !== 'test') {
    if (!config.DATABASE_URL) {
      throw new Error('DATABASE_URL ต้องระบุ')
    }
  }

  // ห้าม wildcard CORS ใน production ถ้าเปิด credentials
  if (nodeEnv === 'production' && config.CORS_ORIGINS === '*') {
    console.warn('⚠️ CORS_ORIGINS เป็น * ใน production — ควรระบุ domain ที่อนุญาต')
  }

  return config
}

export const env = loadEnv()
export { envSchema }

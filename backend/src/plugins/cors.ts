import cors from '@elysiajs/cors'
import { env } from '../config/env'

export const corsPlugin = cors({
  origin: env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(',').map((o) => o.trim()),
  credentials: env.CORS_ORIGINS !== '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

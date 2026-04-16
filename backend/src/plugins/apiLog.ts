import Elysia from 'elysia'
import { db as knexDb } from '../db/knex'
import timezone from 'moment-timezone'

const requestStartTimes = new WeakMap<Request, number>()
const rawBodyPromises = new WeakMap<Request, Promise<unknown>>()

/** จำกัดขนาดที่เขียนลง jsonb */
const MAX_JSONB_CHARS = 48_000
const MAX_RAW_BODY_BYTES = 512 * 1024

function shouldSkipLogging(pathname: string): boolean {
  if (pathname === '/health' || pathname.startsWith('/health/')) return true
  if (pathname.startsWith('/swagger')) return true
  if (pathname.startsWith('/uploads/')) return true
  return false
}

function resolveStatus(set: { status?: string | number } | undefined): number {
  const s = set?.status
  if (typeof s === 'number' && Number.isFinite(s)) return s
  if (typeof s === 'string') {
    const n = Number(s)
    if (Number.isFinite(n)) return n
  }
  return 200
}

/** แปลงค่าให้ใส่ PostgreSQL jsonb ได้ — ตัดความยาว / รูปแบบพิเศษ */
function safeJsonb(value: unknown): unknown {
  if (value === undefined || value === null) return null
  try {
    if (
      typeof value === 'object' &&
      value !== null &&
      typeof ReadableStream !== 'undefined' &&
      value instanceof ReadableStream
    ) {
      return { _type: 'ReadableStream' }
    }
    if (typeof FormData !== 'undefined' && (value as object) instanceof FormData) {
      const form = value as FormData
      const fields: Record<string, string> = {}
      let n = 0
      for (const [k, v] of form.entries()) {
        if (n >= 80) {
          fields._truncated = 'max_fields'
          break
        }
        const key = String(k)
        if (key in fields) continue
        if (typeof File !== 'undefined' && (v as unknown) instanceof File) {
          const f = v as unknown as File
          fields[key] = `[File:${f.name}:${f.size}b]`
        } else {
          fields[key] = String(v).slice(0, 2000)
        }
        n++
      }
      return { _formData: fields }
    }
    if (typeof Blob !== 'undefined' && (value as object) instanceof Blob) {
      const blob = value as Blob
      return { _blob: { type: blob.type, size: blob.size } }
    }
    if (typeof value === 'string') {
      const s =
        value.length > MAX_JSONB_CHARS ? `${value.slice(0, MAX_JSONB_CHARS)}…[truncated]` : value
      if (!s.trim()) return null
      try {
        return JSON.parse(s) as unknown
      } catch {
        return { _text: s }
      }
    }
    if (typeof value === 'object') {
      const s = JSON.stringify(value)
      if (s.length > MAX_JSONB_CHARS) {
        return { _truncated: true, preview: s.slice(0, MAX_JSONB_CHARS) }
      }
      return JSON.parse(s) as unknown
    }
    return value
  } catch {
    return { _error: 'safeJsonb_failed', _typeof: typeof value }
  }
}

/** หัวข้อที่เก็บใน log_api_header (jsonb) — ตัดความยาว / ปิดบัง token */
function headerSnapshot(
  request: Request,
  extra: { durationMs: number; statusCode: number; },
): Record<string, unknown> {
  const out: Record<string, unknown> = {
    method: request.method,
    durationMs: extra.durationMs,
    statusCode: extra.statusCode,
  }
  const names = ['content-type', 'accept', 'user-agent', 'x-request-id', 'authorization']
  for (const name of names) {
    const v = request.headers.get(name)
    if (!v) continue
    out[name] =
      name === 'authorization' ? '[redacted]' : v.length > 2000 ? `${v.slice(0, 2000)}…` : v
  }
  return out
}

type AfterCtx = {
  request: Request
  set: { status?: string | number }
  body?: unknown
  responseValue?: unknown
  /** @deprecated Elysia — ใช้ responseValue */
  response?: unknown
}

function scheduleRawBodyRead(request: Request): void {
  const method = request.method
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return

  const cl = request.headers.get('content-length')
  const len = cl ? Number(cl) : 0
  if (Number.isFinite(len) && len > MAX_RAW_BODY_BYTES) {
    rawBodyPromises.set(
      request,
      Promise.resolve({
        _skipped: 'payload_too_large',
        contentLength: len,
      }),
    )
    return
  }

  const ct = request.headers.get('content-type') ?? ''
  if (ct.includes('multipart/form-data')) {
    rawBodyPromises.set(
      request,
      Promise.resolve({ _note: 'multipart/form-data; use parsed body when available' }),
    )
    return
  }

  rawBodyPromises.set(
    request,
    request
      .clone()
      .text()
      .then((text) => {
        const t =
          text.length > MAX_JSONB_CHARS ? `${text.slice(0, MAX_JSONB_CHARS)}…[truncated]` : text
        if (!t.trim()) return null
        if (ct.includes('application/json')) {
          try {
            return JSON.parse(t) as unknown
          } catch {
            return { _rawJson: t }
          }
        }
        return { _raw: t }
      })
      .catch(() => ({ _error: 'body_read_failed' })),
  )
}

async function resolveLogBody(request: Request, parsedBody: unknown): Promise<unknown> {
  if (parsedBody !== undefined) {
    return safeJsonb(parsedBody)
  }
  const pending = rawBodyPromises.get(request)
  if (pending) {
    return safeJsonb(await pending)
  }
  return null
}

function resolveLogResponse(ctx: AfterCtx): unknown {
  const raw = ctx.responseValue ?? ctx.response
  return safeJsonb(raw)
}

/**
 * บันทึกลงตาราง `log_api` ตามคอลัมน์จริง (log_api_*)
 * log_api_body / log_api_response มาจาก Elysia context (body, responseValue) และสำรองอ่าน raw จาก clone
 */
export function onRequestLog({ request }: { request: Request }): void {
  requestStartTimes.set(request, Date.now())
  scheduleRawBodyRead(request)
}

export async function onAfterHandleLog(ctx: AfterCtx): Promise<void> {
  const { request, set } = ctx
  const pathname = new URL(request.url).pathname
  if (shouldSkipLogging(pathname)) {
    rawBodyPromises.delete(request)
    return
  }

  const start = requestStartTimes.get(request) ?? Date.now()
  const durationMs = Math.max(0, Date.now() - start)
  const statusCode = resolveStatus(set)
  const forwarded = request.headers.get('x-forwarded-for')
  const rawIp = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? null
  const ip = rawIp && rawIp.length <= 100 ? rawIp : (rawIp?.slice(0, 100) ?? null)

  const logBody = await resolveLogBody(request, ctx.body)
  const logResponse = resolveLogResponse(ctx)
  rawBodyPromises.delete(request)

  const row = {
    log_api_uuid: crypto.randomUUID(),
    log_api_path: pathname.slice(0, 100),
    log_api_body: logBody,
    log_api_response: logResponse,
    log_api_request_id: null as null,
    log_api_function_name: `${request.method} ${pathname}`.slice(0, 50),
    log_api_ipaddress: ip,
    log_api_header: headerSnapshot(request, { durationMs, statusCode }),
    log_api_status: String(statusCode),
    log_api_created_at: timezone.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
    log_api_updated_at: timezone.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
  }

  console.log('[apiLog] inserting row:', row.log_api_path)
  await knexDb('log_api')
    .insert(row)
    .then(() => console.log('[apiLog] insert ok'))
    .catch((err: unknown) => {
      console.error('[apiLog] insert failed:', err)
    })
}

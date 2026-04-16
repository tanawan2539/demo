# Starter Elysia.js

## ภาพรวม
Elysia.js REST API starter template พร้อม Drizzle ORM + PostgreSQL

## Tech Stack
- **Runtime:** Bun
- **Framework:** Elysia.js 1.4
- **ORM:** Drizzle ORM + postgres.js driver
- **Database:** PostgreSQL 16
- **Linter:** Biome

## Port
- API: **5007**
- Socket.IO (public, เรียลไทม์อุปกรณ์): **`SOCKET_PORT`** (ค่าเริ่มต้น **5010**) — ดูรายละเอียดอีเวนต์/query ที่ [`docs/socket-realtime.md`](docs/socket-realtime.md)

## โครงสร้าง
```
src/
├── index.ts                # Entry point — compose plugins + modules
├── config/env.ts           # Environment validation
├── modules/                # Feature modules (route + service + model)
│   ├── health/             # GET /health
│   ├── auth/               # POST /auth/login, GET /auth/me
│   └── user/               # CRUD /users
├── plugins/                # Elysia plugins (cors, jwt, swagger, logger, responseWrapper)
├── middleware/              # Auth derive + requireAuth guard
├── db/                     # Drizzle client + schema + migrations
└── lib/                    # Errors, response helpers, validation schemas
```

## Conventions

### Module Pattern
- แต่ละ module = Elysia instance พร้อม prefix
- Chain methods เพื่อรักษา type inference (ห้าม break chain)
- ไฟล์: `index.ts` (routes), `service.ts` (business logic), `model.ts` (TypeBox schemas)

### Service Pattern
- Business logic อยู่ใน service เท่านั้น
- Controller (module routes) เป็น thin layer — เรียก service แล้ว return response

### Auth Pattern
- `authDerive` — passive JWT derive (scoped) ไม่บังคับ login
- `requireAuth` — guard ที่บังคับ login ผ่าน beforeHandle

### Error Handling
- throw custom errors (AppError, NotFoundError, etc.)
- responseWrapper plugin จัดการ format error response

### Response Format
```json
{ "success": true, "data": {...}, "meta": {...} }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

### Database
- ใช้ Drizzle ORM เท่านั้น (ห้าม raw SQL ยกเว้นจำเป็น)
- Schema อยู่ใน `src/db/schema/`
- Soft delete ใช้ `status: 'deleted'` (ห้าม hard delete)

### Validation
- ใช้ `Elysia.t` (TypeBox) เป็น single source of truth
- Schema อยู่ใน `model.ts` ของแต่ละ module

### Scope
- ทุก derive/decorate ใช้ `as: 'scoped'` เพื่อป้องกัน type leak

## Commands
```bash
bun run dev          # Development (hot reload)
bun run build        # Compile binary
bun test             # Run tests
bun run lint         # Lint check
bun run lint:fix     # Lint fix
bun run db:generate  # Generate migration
bun run db:migrate   # Run migration
bun run db:studio    # Drizzle Studio
```

## Docker
```bash
docker compose up -d          # รันทั้ง api + postgres + redis
docker compose up -d postgres # รันแค่ postgres
```

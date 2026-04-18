# Woxa — Institutional Broker Network

ระบบ directory สำหรับ institutional brokers รองรับการค้นหา, กรองตาม broker type และแสดงรายละเอียดแต่ละ broker

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| Backend | Bun, Elysia.js 1.4, TypeScript |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 |
| Container | Docker, Docker Compose |

---

## Project Structure

```
demo/
├── frontend/        # Next.js app (port 3000)
├── backend/         # Bun + Elysia.js API (port 1001)
└── docker-compose.yml
```

---

## วิธี Setup — Docker (แนะนำ)

**ข้อกำหนด:** ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Build และ Start services

```bash
docker compose up -d --build
```

### 2. รัน Migration (ครั้งแรก หรือเมื่อมี schema ใหม่)

```bash
docker compose run --rm backend bun run db:migrate
```

### 3. (ไม่บังคับ) Seed ข้อมูลตัวอย่าง

```bash
docker compose run --rm backend bun run db:seed
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:1001 |
| PostgreSQL | localhost:5432 |

หยุดทุก service:
```bash
docker compose down
```

---

## วิธี Setup — Local Development

### ข้อกำหนด

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 20
- PostgreSQL 16

---

### 1. สร้าง Database

เปิด `psql` หรือเครื่องมืออื่น เช่น pgAdmin แล้วรันคำสั่ง:

```sql
CREATE DATABASE demo;
```

ถ้าใช้ command line:

```bash
psql -U postgres -c "CREATE DATABASE demo;"
```

> ถ้ายังไม่มี user `postgres` ให้สร้างก่อน:
> ```sql
> CREATE USER postgres WITH PASSWORD '<password>';
> ALTER USER postgres CREATEDB;
> ```

---

### 2. ตั้งค่า Environment — Backend

สร้างไฟล์ `backend/.env`:

```env
PORT=1001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/demo
```

---

### 3. Install Dependencies

```bash
# Backend
cd backend
bun install

# Frontend
cd ../frontend
npm install
```

---

### 4. สร้าง Table

เลือกวิธีใดวิธีหนึ่ง:

**ตัวเลือก A — รัน Migration (แนะนำ)**

```bash
cd backend
bun run db:migrate
```

**ตัวเลือก B — สร้าง Table ด้วย SQL โดยตรง**

```bash
psql -U postgres -d demo
```

แล้วรัน SQL นี้:

```sql
CREATE TABLE "broker" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(250),
    "slug" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "logo_url" VARCHAR(250),
    "website" VARCHAR(250),
    "broker_type" VARCHAR(250),
    "created_at" TIMESTAMP DEFAULT now(),
    "events" JSONB,
    "status_del" INTEGER DEFAULT 0
);
```

---

### 5. ตั้งค่า Environment — Frontend

สร้างไฟล์ `frontend/.env`:

```env
API_URL=http://localhost:1001
NEXT_PUBLIC_API_URL=http://localhost:1001
```

---

### 6. Start Project

เปิด 2 terminal:

```bash
# Terminal 1 — Backend
cd backend
bun run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:1001 |

---

## Database Commands

```bash
cd backend

bun run db:migrate    # รัน migration
bun run db:generate   # generate migration จาก schema
bun run db:studio     # เปิด Drizzle Studio (GUI)
bun run db:seed       # seed ข้อมูลตัวอย่าง
```

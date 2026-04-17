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

รันทุกอย่างด้วยคำสั่งเดียว Docker จัดการ Database + Migration + Backend + Frontend ให้อัตโนมัติ

**ข้อกำหนด:** ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
docker compose up -d --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:1001 |
| PostgreSQL | localhost:5433 |

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

### 1. Setup Database

สร้าง database ชื่อ `demo` ใน PostgreSQL แล้วตั้งค่า `.env` ใน `backend/`:

```env
PORT=1001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/demo
```

รัน migration:

```bash
cd backend
bun run db:migrate
```

### 2. Install Dependencies

```bash
# Backend
cd backend
bun install

# Frontend
cd ../frontend
npm install
```

### 3. ตั้งค่า Environment — Frontend

สร้างไฟล์ `frontend/.env`:

```env
API_URL=http://localhost:1001
NEXT_PUBLIC_API_URL=http://localhost:1001
```

### 4. Start Project

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

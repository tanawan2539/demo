-- =============================================================================
-- Queue core schema — แดชบอร์ดคิว (รอเรียก / เรียกแล้ว / ส่งต่อ / รีเซ็ต)
-- ผูกกับของเดิม: hospital, room เท่านั้น (ไม่มีตาราง customer / ไม่ FK ไป service)
-- รัน: แยก statement ด้วย ; หรือใช้สคริปต์แบบ run-room-migration.ts
-- หมายเหตุ: ปรับชนิด INTEGER ของ FK ให้ตรงกับ hospital_id / room_id ในฐานจริง
-- การสร้าง ENUM อยู่ใน DO ... EXCEPTION duplicate_object — รัน migration ซ้ำได้โดยไม่ error
-- ถ้า runner แยกสคริปต์ด้วย ";" ทุกตัว บล็อก DO อาจถูกตัดผิด — ใช้ psql -f ไฟล์นี้ หรือส่งทั้งไฟล์เป็น query เดียว
-- =============================================================================

-- ----- หมวด sidebar (จุดบริการ / หมวดซ้อน) -----
CREATE TABLE IF NOT EXISTS queue_nav_category (
  queue_nav_category_id BIGSERIAL PRIMARY KEY,
  hospital_id           INTEGER NOT NULL REFERENCES hospital (hospital_id),
  parent_id             BIGINT REFERENCES queue_nav_category (queue_nav_category_id),
  name                  VARCHAR(250) NOT NULL,
  sort_order            INT NOT NULL DEFAULT 0,
  nav_del               SMALLINT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_queue_nav_hospital ON queue_nav_category (hospital_id) WHERE nav_del = 1;
CREATE INDEX IF NOT EXISTS idx_queue_nav_parent ON queue_nav_category (parent_id);

-- เชื่อมหมวดกับห้อง (หนึ่งห้องอยู่ได้หลายหมวดถ้าต้องการ — หรือใส่ UNIQUE(room_id) ถ้าห้องละหนึ่งหมวด)
CREATE TABLE IF NOT EXISTS queue_nav_category_room (
  queue_nav_category_id BIGINT NOT NULL REFERENCES queue_nav_category (queue_nav_category_id) ON DELETE CASCADE,
  room_id               INTEGER NOT NULL REFERENCES room (room_id) ON DELETE CASCADE,
  PRIMARY KEY (queue_nav_category_id, room_id)
);

CREATE INDEX IF NOT EXISTS idx_queue_nav_room ON queue_nav_category_room (room_id);

-- ----- เลขคิวรายวันตาม prefix (เช่น B2-001) -----
CREATE TABLE IF NOT EXISTS queue_daily_counter (
  hospital_id   INTEGER NOT NULL REFERENCES hospital (hospital_id),
  counter_date  DATE NOT NULL,
  room_prefix   VARCHAR(32) NOT NULL,
  last_number   INT NOT NULL DEFAULT 0,
  PRIMARY KEY (hospital_id, counter_date, room_prefix)
);

-- ----- บัตรคิวหลัก -----
-- ENUM สร้างเฉพาะเมื่อยังไม่มี (รัน migration ซ้ำได้ — กรณีรอบก่อนสร้าง type แล้วแต่ตารางไม่ครบ)
DO $queue_ticket_status_enum$
BEGIN
  CREATE TYPE queue_ticket_status AS ENUM (
    'waiting',
    'called',
    'forwarded',
    'serving',
    'done',
    'cancelled',
    'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$queue_ticket_status_enum$;

CREATE TABLE IF NOT EXISTS queue_ticket (
  queue_ticket_id     BIGSERIAL PRIMARY KEY,
  hospital_id         INTEGER NOT NULL REFERENCES hospital (hospital_id),
  -- เลขที่แสดงคงที่ (snapshot ตอนออกบัตร)
  ticket_label        VARCHAR(32) NOT NULL,
  room_prefix         VARCHAR(32) NOT NULL,
  daily_sequence      INT NOT NULL,
  counter_date        DATE NOT NULL,
  customer_type_label VARCHAR(80),
  -- เช่น "ลูกค้าหน้าร้าน" (เก็บเป็นข้อความ ไม่มีตารางลูกค้า)
  service_slot_count  INT NOT NULL DEFAULT 1,
  -- "จำนวนรับบริการ N ที่"
  service_tags        JSONB NOT NULL DEFAULT '[]',
  -- รายการ service_id ของบัตรคิว เช่น [12,15] — คงชื่อคอลัมน์เดิมไว้เพื่อ compatibility
  status              queue_ticket_status NOT NULL DEFAULT 'waiting',
  -- ห้อง/จุดที่กำลังรับผิดชอบคิวนี้ (กรอง sidebar / forward)
  current_room_id     INTEGER REFERENCES room (room_id),
  -- เวลา workflow
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  called_at           TIMESTAMPTZ,
  last_recalled_at    TIMESTAMPTZ,
  forwarded_at        TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  ticket_del          SMALLINT NOT NULL DEFAULT 1,
  internal_note       TEXT,
  CONSTRAINT uq_queue_ticket_hospital_label_date UNIQUE (hospital_id, ticket_label, counter_date)
);

CREATE INDEX IF NOT EXISTS idx_queue_ticket_hospital_status_created
  ON queue_ticket (hospital_id, status, created_at DESC) WHERE ticket_del = 1;

CREATE INDEX IF NOT EXISTS idx_queue_ticket_hospital_room_status
  ON queue_ticket (hospital_id, current_room_id, status) WHERE ticket_del = 1;

CREATE INDEX IF NOT EXISTS idx_queue_ticket_counter_date
  ON queue_ticket (hospital_id, counter_date) WHERE ticket_del = 1;

-- ค้นหาตามแท็ก (เช่น WHERE service_tags @> '["Laser"]'::jsonb) — ใช้เมื่อต้องกรองจากข้อความแท็ก
CREATE INDEX IF NOT EXISTS idx_queue_ticket_service_tags ON queue_ticket USING GIN (service_tags);

-- ----- ประวัติการกระทำ (เรียก / เรียกซ้ำ / ส่งต่อ / รีเซ็ต / ยกเลิก) -----
DO $queue_history_action_enum$
BEGIN
  CREATE TYPE queue_history_action AS ENUM (
    'create',
    'call',
    'recall',
    'forward',
    'reset',
    'complete',
    'cancel',
    'status_change'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$queue_history_action_enum$;

CREATE TABLE IF NOT EXISTS queue_ticket_history (
  history_id          BIGSERIAL PRIMARY KEY,
  queue_ticket_id     BIGINT NOT NULL REFERENCES queue_ticket (queue_ticket_id) ON DELETE CASCADE,
  action              queue_history_action NOT NULL,
  from_status         queue_ticket_status,
  to_status           queue_ticket_status,
  from_room_id        INTEGER REFERENCES room (room_id),
  to_room_id          INTEGER REFERENCES room (room_id),
  actor_user_id       BIGINT,
  -- อ้างอิง user ในระบบของคุณ (ถ้ามี) — ไม่สร้าง FK แข็งเพื่อยืดหยุ่น
  performed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta                JSONB
);

CREATE INDEX IF NOT EXISTS idx_queue_history_ticket ON queue_ticket_history (queue_ticket_id, performed_at DESC);

-- =============================================================================
-- แนวคิดการใช้งาน (อ้างอิง UI)
-- =============================================================================
-- 1) รับบัตรคิว: INSERT queue_ticket (waiting) + ใส่ service_tags เป็น JSON array ของ service_id + history(create)
--    เลข ticket_label = room_prefix || '-' || lpad(daily_sequence, 3, '0')
--    อัปเดต queue_daily_counter ใน transaction เดียวกัน
-- 2) เรียกคิว: status waiting -> called, called_at=now, history(call)
-- 3) เรียกซ้ำ: แตะ last_recalled_at + history(recall) — สถานะยัง called
-- 4) ส่งต่อจุดบริการ: called -> forwarded, forwarded_at=now, ตั้ง current_room_id ปลายทาง, history(forward)
-- 5) รีเซ็ตคิว: ตามนโยบาย — เช่น forwarded -> waiting และ clear forwarded_at หรือสร้าง ticket ใหม่ + history(reset)
-- 6) Sidebar badge: COUNT(*) WHERE status IN ('waiting','called') AND current_room_id IN (ห้องในหมวด queue_nav_category_room)
-- =============================================================================

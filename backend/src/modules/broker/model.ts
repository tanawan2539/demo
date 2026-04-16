import { t } from 'elysia'

// ── Response schemas ─────────────────────────────────────────────────────────
export const brokerItem = t.Object({
  id: t.Number({ description: 'Broker ID' }),
  name: t.String({ description: 'ชื่อ broker' }),
  slug: t.String({ description: 'Slug URL' }),
  description: t.String({ description: 'รายละเอียด' }),
  logo_url: t.String({ description: 'URL โลโก้' }),
  website: t.String({ description: 'URL เว็บไซต์' }),
  broker_type: t.String({ description: 'ประเภท broker', enum: ['cfd', 'bond', 'stock', 'crypto'] }),
  created_at: t.String({ description: 'วันที่สร้าง' }),
})

export const brokerSingleResponse = t.Object({
  success: t.Literal(true),
  data: brokerItem,
})

export const brokerListResponse = t.Object({
  success: t.Literal(true),
  data: t.Object({
    data: t.Array(brokerItem),
    meta: t.Object({
      page: t.Number(),
      limit: t.Number(),
      total: t.Number(),
      totalPages: t.Number(),
    }),
  }),
})

export const brokerDeleteResponse = t.Object({
  success: t.Literal(true),
  data: t.Number({ description: 'จำนวนแถวที่ถูกลบ' }),
})

export const list = t.Object({
  page: t.Numeric({ minimum: 1 }),
  limit: t.Numeric({ minimum: 1, maximum: 100 }),
  search: t.Optional(t.String()),
  broker_type: t.Optional(
    t.Enum({
      cfd: 'cfd',
      bond: 'bond',
      stock: 'stock',
      crypto: 'crypto',
    })
  ),
})

export const add = t.Object({
  name: t.String({ minLength: 1 }),
  slug: t.String({ minLength: 1 }),
  description: t.String({ minLength: 1 }),
  logo_url: t.String({
    format: 'uri',
    minLength: 1,
  }),
  website: t.String({
    format: 'uri',
    minLength: 1,
  }),
  broker_type: t.Enum({
    cfd: 'cfd',
    bond: 'bond',
    stock: 'stock',
    crypto: 'crypto',
  }),
})

export const update = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  slug: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String({ minLength: 1 })),
  logo_url: t.Optional(t.String({ format: 'uri' })),
  website: t.Optional(t.String({ format: 'uri' })),
  broker_type: t.Optional(
    t.Enum({
      cfd: 'cfd',
      bond: 'bond',
      stock: 'stock',
      crypto: 'crypto',
    })
  ),
})
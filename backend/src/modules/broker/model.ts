import { t } from 'elysia'

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
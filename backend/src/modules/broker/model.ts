import { t } from 'elysia'

export const list = t.Object({
  page: t.Numeric({ minimum: 1 }),
  limit: t.Numeric({ minimum: 1, maximum: 100 }),
  search: t.Optional(t.String()),
  type: t.Optional(t.String()),
})

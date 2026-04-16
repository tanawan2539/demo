import { t } from 'elysia'

export const list = t.Object({
  page: t.Number({ minimum: 1, default: 1 }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 20 }),
  search: t.Optional(t.String()),
})

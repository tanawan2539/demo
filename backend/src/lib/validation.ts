import { t } from 'elysia'

export const paginatedSearchQuery = t.Object({
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  limit: t.Optional(t.Numeric({ default: 20, minimum: 1, maximum: 100 })),
  search: t.Optional(t.String()),
})

export const idParam = t.Object({
  id: t.Numeric(),
})

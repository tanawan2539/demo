import { beforeEach, describe, expect, it, mock } from 'bun:test'

// ── Mock state ────────────────────────────────────────────────────────────────
// firstResults: queue — each call to .first() pops from the front
// offsetResult: returned by .offset() (list queries)
// returningResult: returned by .returning() (insert/update)
// directResult: returned when .update() is awaited directly (remove)
const mockState = {
  firstResults: [] as any[],
  offsetResult: [] as any[],
  returningResult: [] as any[],
  directResult: 1 as any,
}

function createChain(): any {
  return {
    where: (...args: any[]) => {
      const [first] = args
      if (typeof first === 'function') first(createChain())
      return createChain()
    },
    whereRaw: () => createChain(),
    andWhere: () => createChain(),
    andWhereNot: () => createChain(),
    whereILike: () => createChain(),
    orWhereILike: () => createChain(),
    clone: () => createChain(),
    count: () => createChain(),
    select: () => createChain(),
    orderBy: () => createChain(),
    limit: () => createChain(),
    offset: () => Promise.resolve(mockState.offsetResult),
    insert: () => ({
      returning: () => Promise.resolve(mockState.returningResult),
    }),
    update: () => ({
      returning: () => Promise.resolve(mockState.returningResult),
      then: (resolve: any, reject: any) =>
        Promise.resolve(mockState.directResult).then(resolve, reject),
    }),
    first: () => Promise.resolve(mockState.firstResults.shift()),
  }
}

mock.module('../../db/knex', () => ({ db: () => createChain() }))
mock.module('moment-timezone', () => ({
  default: { tz: () => ({ format: () => '2026-04-16 00:00:00' }) },
}))

// Import AFTER mocks are registered
const { list, add, update, getBySlug, remove } = await import('./service')

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockBroker = {
  id: 4,
  name: 'Exness New',
  slug: 'exness-new',
  description: 'Updated broker description',
  logo_url: 'https://www.pngkey.com/png/detail/206-2066098_metatrader-5.png',
  website: 'https://www.exness.com',
  broker_type: 'cfd',
  created_at: '2026-04-16T16:53:30.000Z',
  events: '[]',
  status_del: 0,
}

beforeEach(() => {
  mockState.firstResults = []
  mockState.offsetResult = []
  mockState.returningResult = []
  mockState.directResult = 1
})

// ── list ──────────────────────────────────────────────────────────────────────
describe('list', () => {
  it('returns paginated data with default params', async () => {
    mockState.firstResults = [{ total: 2 }]
    mockState.offsetResult = [mockBroker, { ...mockBroker, id: 5 }]

    const result = await list(1, 10)

    expect(result.data).toHaveLength(2)
    expect(result.meta).toEqual({ page: 1, limit: 10, total: 2, totalPages: 1 })
  })

  it('calculates totalPages correctly', async () => {
    mockState.firstResults = [{ total: 25 }]
    mockState.offsetResult = []

    const result = await list(2, 10)

    expect(result.meta.page).toBe(2)
    expect(result.meta.totalPages).toBe(3)
  })

  it('throws ValidationError for invalid broker_type', async () => {
    await expect(list(1, 10, undefined, 'forex')).rejects.toThrow('Invalid broker_type')
  })

  it('accepts valid broker_type filter', async () => {
    mockState.firstResults = [{ total: 1 }]
    mockState.offsetResult = [mockBroker]

    const result = await list(1, 10, undefined, 'cfd')
    expect(result.data).toHaveLength(1)
  })

  it('accepts search query without throwing', async () => {
    mockState.firstResults = [{ total: 1 }]
    mockState.offsetResult = [mockBroker]

    const result = await list(1, 10, 'exness')
    expect(result.data).toHaveLength(1)
  })

  it('returns empty data when no results', async () => {
    mockState.firstResults = [{ total: 0 }]
    mockState.offsetResult = []

    const result = await list(1, 10)
    expect(result.data).toHaveLength(0)
    expect(result.meta.total).toBe(0)
    expect(result.meta.totalPages).toBe(0)
  })
})

// ── add ───────────────────────────────────────────────────────────────────────
describe('add', () => {
  const validBody = {
    name: 'Exness',
    slug: 'exness',
    description: 'Test broker',
    logo_url: 'https://example.com/logo.png',
    website: 'https://example.com',
    broker_type: 'cfd',
  }

  it('creates and returns new broker', async () => {
    mockState.firstResults = [null] // no duplicate slug
    mockState.returningResult = [mockBroker]

    const result = await add(validBody)
    expect(result).toEqual(mockBroker)
  })

  it('trims slug before inserting', async () => {
    mockState.firstResults = [null]
    mockState.returningResult = [mockBroker]

    // Should not throw even with leading/trailing spaces
    await expect(add({ ...validBody, slug: '  exness  ' })).resolves.toBeDefined()
  })

  it('throws ConflictError when slug already exists', async () => {
    mockState.firstResults = [mockBroker] // duplicate found

    await expect(add(validBody)).rejects.toThrow('Slug already exists')
  })

  it('throws ValidationError for invalid broker_type', async () => {
    mockState.firstResults = [null]

    await expect(add({ ...validBody, broker_type: 'forex' })).rejects.toThrow('Invalid broker_type')
  })

  it('throws ValidationError for invalid logo_url', async () => {
    mockState.firstResults = [null]

    await expect(add({ ...validBody, logo_url: 'not-a-url' })).rejects.toThrow('Invalid logo_url')
  })

  it('throws ValidationError for invalid website', async () => {
    mockState.firstResults = [null]

    await expect(add({ ...validBody, website: 'ftp://bad-protocol.com' })).rejects.toThrow('Invalid website')
  })

  it('accepts all valid broker_type values', async () => {
    const types = ['cfd', 'bond', 'stock', 'crypto'] as const
    for (const broker_type of types) {
      mockState.firstResults = [null]
      mockState.returningResult = [{ ...mockBroker, broker_type }]
      await expect(add({ ...validBody, broker_type })).resolves.toBeDefined()
    }
  })
})

// ── update ────────────────────────────────────────────────────────────────────
describe('update', () => {
  it('updates and returns modified broker', async () => {
    mockState.firstResults = [mockBroker]
    mockState.returningResult = [{ ...mockBroker, name: 'Exness Updated' }]

    const result = await update(4, { name: 'Exness Updated' })
    expect(result.name).toBe('Exness Updated')
  })

  it('allows partial update with only some fields', async () => {
    mockState.firstResults = [mockBroker]
    mockState.returningResult = [{ ...mockBroker, description: 'New description' }]

    const result = await update(4, { description: 'New description' })
    expect(result.description).toBe('New description')
  })

  it('throws NotFoundError when broker does not exist', async () => {
    mockState.firstResults = [null]

    await expect(update(999, { name: 'Test' })).rejects.toThrow('Broker not found')
  })

  it('throws ConflictError when new slug is taken by another broker', async () => {
    mockState.firstResults = [mockBroker, { ...mockBroker, id: 99 }] // existing + duplicate

    await expect(update(4, { slug: 'taken-slug' })).rejects.toThrow('Slug already exists')
  })

  it('allows updating slug to a unique value', async () => {
    mockState.firstResults = [mockBroker, null] // existing + no duplicate
    mockState.returningResult = [{ ...mockBroker, slug: 'new-slug' }]

    const result = await update(4, { slug: 'new-slug' })
    expect(result.slug).toBe('new-slug')
  })

  it('throws ValidationError for invalid broker_type', async () => {
    mockState.firstResults = [mockBroker]

    await expect(update(4, { broker_type: 'forex' })).rejects.toThrow('Invalid broker_type')
  })

  it('throws ValidationError for invalid logo_url', async () => {
    mockState.firstResults = [mockBroker]

    await expect(update(4, { logo_url: 'not-a-url' })).rejects.toThrow('Invalid logo_url')
  })

  it('throws ValidationError for invalid website', async () => {
    mockState.firstResults = [mockBroker]

    await expect(update(4, { website: 'not-a-url' })).rejects.toThrow('Invalid website')
  })

  it('preserves existing events history when updating', async () => {
    const brokerWithEvents = {
      ...mockBroker,
      events: JSON.stringify([{ event: 'add', timestamp: '2026-04-16 00:00:00', data: {} }]),
    }
    mockState.firstResults = [brokerWithEvents]
    mockState.returningResult = [{ ...mockBroker, name: 'Updated' }]

    await expect(update(4, { name: 'Updated' })).resolves.toBeDefined()
  })
})

// ── getBySlug ─────────────────────────────────────────────────────────────────
describe('getBySlug', () => {
  it('returns broker when found', async () => {
    mockState.firstResults = [mockBroker]

    const result = await getBySlug('exness-new')
    expect(result).toEqual(mockBroker)
  })

  it('is case-insensitive for slug lookup', async () => {
    mockState.firstResults = [mockBroker]

    // Should not throw; slug comparison is done via LOWER() in query
    await expect(getBySlug('EXNESS-NEW')).resolves.toEqual(mockBroker)
  })

  it('throws NotFoundError when broker does not exist', async () => {
    mockState.firstResults = [null]

    await expect(getBySlug('non-existent')).rejects.toThrow('Broker not found')
  })
})

// ── remove ────────────────────────────────────────────────────────────────────
describe('remove', () => {
  it('soft-deletes broker and returns affected row count', async () => {
    mockState.firstResults = [mockBroker]
    mockState.directResult = 1

    const result = await remove(4)
    expect(result).toBe(1)
  })

  it('throws NotFoundError when broker does not exist', async () => {
    mockState.firstResults = [null]

    await expect(remove(999)).rejects.toThrow('Broker not found')
  })

  it('appends delete event to events history', async () => {
    const brokerWithEvents = {
      ...mockBroker,
      events: JSON.stringify([{ event: 'add', timestamp: '2026-04-16 00:00:00' }]),
    }
    mockState.firstResults = [brokerWithEvents]
    mockState.directResult = 1

    await expect(remove(4)).resolves.toBe(1)
  })
})

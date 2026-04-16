import { db } from '../../db/knex'
import { ValidationError, ConflictError, NotFoundError } from '../../lib/errors'
import timezone from 'moment-timezone'

function isValidHttpUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function normalizeEvents(raw: any): any[] {
  let events: any[] = []

  if (Array.isArray(raw)) {
    events = raw
  } else if (typeof raw === 'string') {
    try {
      events = JSON.parse(raw)
    } catch {
      events = []
    }
  }

  return events.map(e => {
    if (typeof e === 'string') {
      try {
        return JSON.parse(e)
      } catch {
        return {}
      }
    }
    return e
  })
}

export async function list(
  page?: number,
  limit?: number,
  search?: string,
  broker_type?: string
) {
  const currentPage = page ?? 1
  const perPage = limit ?? 10
  const offset = (currentPage - 1) * perPage

  const query = db('broker').where('status_del', 0);

  //ประเภท
  if (broker_type) {
    const allowedTypes = ['cfd', 'bond', 'stock', 'crypto']
    if (!allowedTypes.includes(broker_type)) {
      throw new ValidationError('Invalid broker_type')
    }
    query.where('broker_type', broker_type)
  }

  //คำค้นหา
  if (search) {
    console.log(search);
    
    query.where((qb) => {
      qb.whereILike('name', `%${search}%`)
        .orWhereILike('slug', `%${search}%`)
    })
  }

  const totalResult = await query.clone().count('* as total').first()
  const total = Number(totalResult?.total ?? 0)

  const data = await query
    .select(
      'id',
      'name',
      'slug',
      'description',
      'logo_url',
      'website',
      'broker_type',
      'created_at',
    )
    .orderBy('created_at', 'desc')
    .limit(perPage)
    .offset(offset)

  return {
    data,
    meta: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  }
}

export async function add(body: {
  name: string
  slug: string
  description: string
  logo_url: string
  website: string
  broker_type: string
}) {
  const {
    name,
    slug,
    description,
    logo_url,
    website,
    broker_type,
  } = body

  const trimmedSlug = slug.trim()
  const now = timezone.tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")

  const existing = await db('broker')
    .whereRaw('LOWER(slug) = ?', [trimmedSlug.toLowerCase()])
    .first()
  if (existing) {
    throw new ConflictError('Slug already exists')
  }

  const allowedTypes = ['cfd', 'bond', 'stock', 'crypto']
  if (!allowedTypes.includes(broker_type)) {
    throw new ValidationError('Invalid broker_type')
  }

  if (!isValidHttpUrl(logo_url)) {
    throw new ValidationError('Invalid logo_url')
  }
  
  if (!isValidHttpUrl(website)) {
    throw new ValidationError('Invalid website')
  }

  const [data] = await db('broker')
    .insert({
      name,
      slug: trimmedSlug,
      description,
      logo_url,
      website,
      broker_type,
      created_at: now,
      events: JSON.stringify([
        {
          data: body,
          timestamp: now,
          event: 'add',
        },
      ])
    })
    .returning('*')

  return data
}

export async function update(id: number, body: any) {
  const now = timezone.tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
  const existing = await db('broker')
    .where({ id, status_del: 0 })
    .first()

  if (!existing) {
    throw new NotFoundError('Broker not found')
  }

  const updateData: any = {}

  if (body.name !== undefined) {
    updateData.name = body.name
  }

  if (body.slug !== undefined) {
    const trimmedSlug = body.slug.trim()

    const duplicate = await db('broker')
      .whereRaw('LOWER(slug) = ?', [trimmedSlug.toLowerCase()])
      .andWhereNot('id', id)
      .first()

    if (duplicate) {
      throw new ConflictError('Slug already exists')
    }

    updateData.slug = trimmedSlug
  }

  if (body.description !== undefined) {
    updateData.description = body.description
  }

  if (body.logo_url !== undefined) {
    if (!isValidHttpUrl(body.logo_url)) {
      throw new ValidationError('Invalid logo_url')
    }

    updateData.logo_url = body.logo_url
  }

  if (body.website !== undefined) {
    if (!isValidHttpUrl(body.website)) {
      throw new ValidationError('Invalid website')
    }

    updateData.website = body.website
  }

  if (body.broker_type !== undefined) {
    const allowedTypes = ['cfd', 'bond', 'stock', 'crypto']
    if (!allowedTypes.includes(body.broker_type)) {
      throw new ValidationError('Invalid broker_type')
    }

    updateData.broker_type = body.broker_type
  }

  // ถ้าไม่มี field ใดเปลี่ยนเลย ส่งข้อมูลเดิมกลับไปโดยไม่บันทึก event
  if (Object.keys(updateData).length === 0) {
    return existing
  }

  const events = normalizeEvents(existing.events)
  events.push({
    data: body,
    timestamp: now,
    event: 'update',
  })
  updateData.events = JSON.stringify(events)

  const [data] = await db('broker')
    .where({ id })
    .update(updateData)
    .returning('*')

  return data
}

export async function getBySlug(slug: string) {
  const trimmedSlug = slug.trim()
  
  const data = await db('broker')
    .select(
      'id',
      'name',
      'slug',
      'description',
      'logo_url',
      'website',
      'broker_type',
      'created_at',
    )
    .whereRaw('LOWER(slug) = ?', [trimmedSlug.toLowerCase()])
    .andWhere('status_del', 0)
    .first()

  if (!data) {
    throw new NotFoundError('Broker not found')
  }

  return data
}

export async function remove(id: number) {
  const now = timezone.tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
  const existing = await db('broker')
    .where({ id, status_del: 0 })
    .first()

  if (!existing) {
    throw new NotFoundError('Broker not found')
  }

  const events = normalizeEvents(existing.events)
  events.push({
    timestamp: now,
    event: 'delete',
  })

  const data = await db('broker')
    .where({ id })
    .update({
      status_del: 1,
      events: JSON.stringify(events),
    })

  return data
}
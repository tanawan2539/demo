import Elysia, { t } from 'elysia'
import { successResponse } from '../../lib/response'
import { list, add, update} from './model'
import * as userService from './service'

export const userModule = new Elysia({ prefix: '/brokers', tags: ['Brokers'] })
  .get(
    '/',
    async ({ query }) => {
      const result = await userService.list(query.page, query.limit, query.search, query.broker_type)
      return successResponse(result)
    },
    {
      query: list,
      detail: { summary: 'ดึงข้อมูล brokers' },
    },
  )
  .post(
    '/add',
    async ({ body }) => {
      const result = await userService.add(body)
      return successResponse(result)
    },
    {
      body: add,
      detail: { summary: 'เพิ่ม broker' },
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const result = await userService.update(Number(params.id), body)
      return successResponse(result)
    },
    {
      body: update,
      detail: { summary: 'อัปเดต broker' },
    }
  )
  .get(
    '/:slug',
    async ({ params }) => {
      const result = await userService.getBySlug(params.slug)
      return successResponse(result)
    },
    {
      detail: { summary: 'รายละเอียด broker (by slug)' },
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const result = await userService.remove(Number(params.id))
      return successResponse(result)
    },
    {
      detail: { summary: 'ลบ broker (soft delete)' },
    }
  )
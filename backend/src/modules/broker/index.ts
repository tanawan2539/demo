import Elysia, { t } from 'elysia'
import { successResponse } from '../../lib/response'
import { list} from './model'
import * as userService from './service'

export const userModule = new Elysia({ prefix: '/brokers', tags: ['Brokers'] })
  .get(
    '/',
    async ({ query }) => {
      const result = await userService.list(query.page, query.limit, query.search)
      return successResponse(result)
    },
    {
      query: list,
      detail: { summary: 'ดึงข้อมูล brokers' },
    },
  )
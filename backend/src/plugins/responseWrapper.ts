import Elysia from 'elysia'
import { AppError } from '../lib/errors'
import { errorResponse } from '../lib/response'

/** จัดการ error response format ให้เป็นมาตรฐาน */
export const responseWrapperPlugin = new Elysia({ name: 'responseWrapper' })
  .onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode
      return errorResponse(error.code, error.message)
    }

    // Elysia validation error / not found
    if ('code' in error && typeof error.code === 'string') {
      const message = 'message' in error && typeof error.message === 'string' ? error.message : String(error)

      if (error.code === 'VALIDATION') {
        set.status = 422
        return errorResponse('VALIDATION_ERROR', message)
      }

      if (error.code === 'NOT_FOUND') {
        set.status = 404
        return errorResponse('NOT_FOUND', 'Route not found')
      }
    }

    // Unknown error
    console.error('Unhandled error:', error)
    set.status = 500
    return errorResponse('INTERNAL_ERROR', 'Internal server error')
  })
  .as('scoped')

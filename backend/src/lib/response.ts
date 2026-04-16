/** Success response format */
export interface SuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: PaginationMeta
}

/** Error response format */
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** สร้าง success response */
export function successResponse<T>(data: T, meta?: PaginationMeta): SuccessResponse<T> {
  return meta ? { success: true, data, meta } : { success: true, data }
}

/** สร้าง error response */
export function errorResponse(code: string, message: string): ErrorResponse {
  return {
    success: false,
    error: { code, message },
  }
}

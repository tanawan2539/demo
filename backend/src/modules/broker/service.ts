import { db } from '../../db'
import { ConflictError, NotFoundError, ValidationError } from '../../lib/errors'

export async function list(page?: number, limit?: number, search?: string, type?: string) {
    const currentPage = page ?? 1;
    const perPage = limit ?? 10;
  
    console.log(currentPage);
    console.log(perPage);
  
    return true;
  }
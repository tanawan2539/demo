import Elysia from 'elysia'

/** Request logging plugin — เก็บเวลาเริ่มต้นใน WeakMap ไม่ mutate request */
const requestStartTimes = new WeakMap<Request, number>()

export const loggerPlugin = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    requestStartTimes.set(request, Date.now())
  })
  .onAfterResponse(({ request, set }) => {
    const start = requestStartTimes.get(request) || Date.now()
    const duration = Date.now() - start
    const method = request.method
    const url = new URL(request.url).pathname
    const status = set.status || 200

    console.log(`${method} ${url} ${status} ${duration}ms`)
  })
  .as('scoped')

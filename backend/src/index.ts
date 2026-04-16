import { mkdirSync } from 'node:fs'

import { staticPlugin } from '@elysiajs/static'
import { Elysia } from 'elysia'

import { env } from './config/env'
import { uploadsDir } from './config/paths'
import { userModule } from './modules/broker'
import { onAfterHandleLog, onRequestLog } from './plugins/apiLog'
import { corsPlugin } from './plugins/cors'
import { loggerPlugin } from './plugins/logger'
import { responseWrapperPlugin } from './plugins/responseWrapper'
import { swaggerPlugin } from './plugins/swagger'

mkdirSync(uploadsDir, { recursive: true })

const app = new Elysia()
  .use(corsPlugin)
  .use(swaggerPlugin)
  .use(staticPlugin({ assets: uploadsDir, prefix: '/uploads' }))
  .use(loggerPlugin)
  .use(responseWrapperPlugin)
  .onRequest(onRequestLog)
  .onAfterHandle(onAfterHandleLog)
  .use(userModule)
  .listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`)
    console.log(`Swagger docs at http://localhost:${env.PORT}/swagger`)
  })

export type App = typeof app

import swagger from '@elysiajs/swagger'

export const swaggerPlugin = swagger({
  documentation: {
    info: {
      title: 'Starter Elysia API',
      version: '1.0.0',
      description: 'Elysia.js starter template API documentation',
    },
    tags: [
      { name: 'Brokers', description: 'Broker management' },
    ],
  },
  path: '/swagger',
})

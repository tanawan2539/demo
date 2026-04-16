import swagger from '@elysiajs/swagger'

export const swaggerPlugin = swagger({
  documentation: {
    info: {
      title: 'Starter Elysia API',
      version: '1.0.0',
      description: 'Elysia.js starter template API documentation',
    },
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Auth', description: 'Authentication' },
      { name: 'Users', description: 'User management' },
    ],
  },
  path: '/swagger',
})

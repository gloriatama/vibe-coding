import { Elysia } from 'elysia';
import { usersRoute } from './routes/users-route';
import { swagger } from '@elysiajs/swagger';

export const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Vibe Coding API Documentation',
        version: '1.0.0',
        description: 'Dokumentasi untuk sistem manajemen user'
      },
      tags: [
        { name: 'User', description: 'Endpoint untuk operasi terkait User' }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }))
  .get('/', () => 'Hello Elysia')
  .group('/api/users', (app) => app.use(usersRoute))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
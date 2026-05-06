// Main entry point for ElysiaJS server
import { Elysia } from 'elysia';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .group('/api/users', (app) => app.use(usersRoute))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
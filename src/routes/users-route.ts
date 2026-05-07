import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/users-service';

export const usersRoute = new Elysia()
  .post('', async ({ body, set }) => {
    try {
      return await registerUser(body);
    } catch (error: any) {
      if (error.message === 'Email sudah terdaftar') {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String({ maxLength: 255 }),
      email: t.String({ maxLength: 255 }),
      password: t.String(),
    })
  })
  .post('/login', async ({ body, set }) => {
    try {
      return await loginUser(body);
    } catch (error: any) {
      if (error.message === 'Email atau password salah') {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    })
  })
  .get('/current', async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const token = authHeader.split(' ')[1];
      return await getCurrentUser(token);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  })
  .delete('/logout', async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const token = authHeader.split(' ')[1];
      return await logoutUser(token);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  });


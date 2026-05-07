import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/users-service';

export const usersRoute = new Elysia()
  .post('', async ({ body, set }) => {
    try {
      return await registerUser(body);
    } catch (error: any) {
      set.status = error.message && error.message.includes('Email sudah terdaftar') ? 400 : 500;
      return { error: error.message && error.message.includes('Email sudah terdaftar') ? error.message : 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String({ maxLength: 255 }),
      email: t.String({ maxLength: 255 }),
      password: t.String(),
    }),
    detail: {
      tags: ['User'],
      summary: 'Registrasi user baru',
      description: 'Mendaftarkan user baru ke dalam database dengan password terenkripsi.'
    }
  })
  .post('/login', async ({ body, set }) => {
    try {
      return await loginUser(body);
    } catch (error: any) {
      set.status = error.message && error.message.includes('Email atau password salah') ? 401 : 500;
      return { error: error.message && error.message.includes('Email atau password salah') ? error.message : 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      tags: ['User'],
      summary: 'Login user',
      description: 'Melakukan autentikasi user dan mengembalikan session token.'
    }
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
      set.status = error.message && error.message.includes('Unauthorized') ? 401 : 500;
      return { error: error.message && (error.message.includes('Unauthorized') || error.message.includes('Email sudah terdaftar') || error.message.includes('Email atau password salah')) ? error.message : 'Internal Server Error' };
    }
  }, {
    detail: {
      tags: ['User'],
      summary: 'Ambil data profil user',
      description: 'Mendapatkan data user yang sedang aktif berdasarkan token.',
      security: [{ BearerAuth: [] }]
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
      set.status = error.message && error.message.includes('Unauthorized') ? 401 : 500;
      return { error: error.message && (error.message.includes('Unauthorized') || error.message.includes('Email sudah terdaftar') || error.message.includes('Email atau password salah')) ? error.message : 'Internal Server Error' };
    }
  }, {
    detail: {
      tags: ['User'],
      summary: 'Logout user',
      description: 'Menghapus session token yang sedang digunakan.',
      security: [{ BearerAuth: [] }]
    }
  });


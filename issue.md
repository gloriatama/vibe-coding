# Perencanaan: Implementasi Swagger API Documentation

Aplikasi ini memerlukan dokumentasi API yang interaktif agar pengguna atau pengembang lain dapat mencoba endpoint dengan mudah. Kita akan menggunakan plugin resmi dari ElysiaJS untuk menghasilkan Swagger UI secara otomatis.

---

## 📋 Tahapan Implementasi

### 1. Instalasi Dependency
Langkah pertama adalah menginstal library `@elysiajs/swagger`. Jalankan perintah berikut di terminal:

```bash
bun add @elysiajs/swagger
```

### 2. Registrasi Plugin di Server Utama
Buka file `src/index.ts` dan lakukan perubahan berikut:

1.  Import plugin swagger:
    ```typescript
    import { swagger } from '@elysiajs/swagger'
    ```
2.  Gunakan plugin tersebut di dalam instance `new Elysia()`. Pastikan diletakkan di awal atau sebelum definisi route agar dokumentasi dapat mencakup semua endpoint.

   **Contoh Implementasi:**
   ```typescript
   const app = new Elysia()
     .use(swagger({
       documentation: {
         info: {
           title: 'Vibe Coding API Documentation',
           version: '1.0.0',
           description: 'Dokumentasi untuk sistem manajemen user'
         },
         tags: [
           { name: 'User', description: 'Endpoint untuk operasi terkait User' }
         ]
       }
     }))
     // ... rest of the code
   ```

### 3. Penambahan Metadata pada Route
Agar Swagger menampilkan deskripsi yang informatif, tambahkan detail pada setiap route di `src/routes/users-route.ts`. Elysia secara otomatis mengambil schema dari `t.Object` yang sudah kita definisikan.

Tambahkan properti `detail` pada objek konfigurasi handler:

```typescript
.post('', async (...) => { ... }, {
    body: t.Object({ ... }),
    detail: {
        tags: ['User'],
        summary: 'Registrasi user baru',
        description: 'Mendaftarkan user baru ke dalam database dengan password terenkripsi.'
    }
})
```

### 4. Konfigurasi Keamanan (Bearer Token)
Karena ada endpoint yang membutuhkan autentikasi (seperti `/current` dan `/logout`), kita perlu memberi tahu Swagger tentang header `Authorization`.

Tambahkan konfigurasi `security` di dalam objek `documentation` pada `src/index.ts`:

```typescript
components: {
    securitySchemes: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
}
```

Dan pada route yang memerlukan auth, tambahkan:
```typescript
detail: {
    security: [{ BearerAuth: [] }]
}
```

---

## 🧪 Verifikasi
1. Jalankan aplikasi dengan `bun run dev`.
2. Buka browser dan akses alamat `http://localhost:3000/swagger`.
3. Pastikan semua endpoint (`POST /api/users`, `POST /api/users/login`, `GET /api/users/current`, `DELETE /api/users/logout`) muncul dan dapat dicoba langsung dari UI tersebut.

---

## 💡 Tips untuk Junior/AI Model
- Pastikan urutan `.use(swagger())` berada di atas agar tidak ada route yang terlewat.
- Jika ada perubahan pada schema `t.Object`, Swagger akan otomatis memperbarui tampilan model datanya.

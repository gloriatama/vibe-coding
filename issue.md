# Implementasi Fitur Get Current User

Dokumen ini berisi panduan perencanaan dan langkah demi langkah untuk mengimplementasikan API guna mendapatkan data user yang saat ini sedang login. Panduan ini ditujukan bagi programmer junior atau model AI untuk mengeksekusi fitur sesuai dengan standar proyek.

## 1. Spesifikasi API

### Endpoint
- **Method:** `GET`
- **Path:** `/api/users/current`

**Headers:**
- `Authorization`: `Bearer <token>` (token adalah token yang ada di table users)

**Response Body (Success):**
```json
{
	"data" : {
		"id": 1,
		"name": "gloria",
		"email": "gloria@localhost",
		"created_at": "timestamp"
	}
}
```

**Response Body (Error):**
```json
{
	"error" : "Unauthorized"
}
```

## 2. Struktur Folder dan File

Di dalam direktori `src`, kode diorganisasikan ke dalam struktur berikut:
- **`src/routes/`**: Folder ini berisi routing framework Elysia JS.
  - Aturan penamaan file menggunakan format: `[nama]-route.ts` (contoh: `users-route.ts`).
- **`src/services/`**: Folder ini berisi logic bisnis aplikasi.
  - Aturan penamaan file menggunakan format: `[nama]-service.ts` (contoh: `users-service.ts`).

---

## 3. Tahapan Implementasi (Langkah Demi Langkah)

Berikut adalah urutan pengerjaan yang harus dilakukan:

### Langkah 1: Buat Logika di Service Layer
1. Buka file `src/services/users-service.ts`.
2. Buat dan export fungsi baru (misal: `getCurrentUser`) yang menerima parameter `token`.
3. Alur logika di dalam fungsi tersebut:
   - Lakukan query ke database untuk mencari sesi atau user berdasarkan `token` yang diberikan. *(Catatan: Perhatikan apakah token disimpan di tabel `users` seperti instruksi awal, atau di tabel `sessions` berdasarkan implementasi login sebelumnya. Sesuaikan query dengan skema database yang aktif).*
   - Jika data tidak ditemukan (token tidak valid), lemparkan error dengan pesan "Unauthorized".
   - Jika data ditemukan, ambil data `id`, `name`, `email`, dan `created_at` milik user tersebut.
   - Kembalikan data user tersebut dalam format objek `{"data": { ... } }` sesuai spesifikasi response body success.

### Langkah 2: Buat Endpoint di Route Layer
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan route baru `GET /current` pada instance Elysia. (Catatan: karena biasanya di `index.ts` route ini di-group dengan prefix `/api/users`, kita cukup menulis `.get('/current', ...)`).
3. Di dalam handler route:
   - Ambil nilai dari header `Authorization` yang dikirimkan oleh client.
   - Ekstrak nilai token dari format `Bearer <token>`.
   - Jika header Authorization kosong atau token tidak ada, langsung kembalikan HTTP status 401 dan response JSON `{"error": "Unauthorized"}`.
   - Panggil fungsi `getCurrentUser(token)` yang sudah dibuat di service.
4. Tangkap error menggunakan blok `catch`. Jika menerima pesan error "Unauthorized" dari service, kembalikan HTTP status 401 dan JSON `{"error": "Unauthorized"}`.
5. Jika sukses, kembalikan response yang didapat dari service (yang berisi data user).

### Langkah 3: Pengujian (Testing)
1. Jalankan server lokal (`bun run dev`).
2. Gunakan HTTP client (seperti curl, Postman, atau bruno).
3. Lakukan request `GET /api/users/current` tanpa menyertakan header `Authorization`, pastikan mendapat error "Unauthorized" dengan status 401.
4. Sertakan header `Authorization: Bearer <token_yang_salah>`, pastikan juga mendapat error "Unauthorized".
5. Lakukan proses login (POST `/api/users/login`) untuk mendapatkan token yang valid.
6. Gunakan token tersebut pada header `Authorization: Bearer <token_valid>` untuk request `GET /api/users/current`, dan pastikan Anda mendapatkan data user yang login dengan format JSON yang benar.

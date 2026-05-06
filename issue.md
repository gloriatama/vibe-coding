# Implementasi Fitur Logout User

Dokumen ini berisi panduan perencanaan dan langkah demi langkah untuk mengimplementasikan API guna melakukan proses logout user. Panduan ini ditujukan bagi programmer junior atau model AI untuk mengeksekusi fitur sesuai dengan standar proyek.

## 1. Spesifikasi API

### Endpoint
- **Method:** `DELETE`
- **Path:** `/api/users/logout`

**Headers:**
- `Authorization`: `Bearer <token>` (token adalah token yang ada di table users / sessions)

**Response Body (Success):**
```json
{
	"data" : "OK"
}
```

**Response Body (Error):**
```json
{
	"error" : "Unauthorized"
}
```

**Catatan Khusus:**
Jika proses logout berhasil, maka data session yang memiliki token tersebut harus **dihapus** dari tabel `sessions` di database.

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
2. Buat dan export fungsi baru (misal: `logoutUser`) yang menerima parameter `token`.
3. Alur logika di dalam fungsi tersebut:
   - Lakukan pengecekan apakah token tersebut valid dan ada di dalam database (biasanya di tabel `sessions`).
   - Jika token tidak ditemukan atau tidak valid, lemparkan error dengan pesan "Unauthorized".
   - Jika token ditemukan, jalankan perintah `DELETE` ke tabel `sessions` berdasarkan token tersebut (menggunakan Drizzle ORM, misalnya `db.delete(sessions).where(eq(sessions.token, token))`).
   - Setelah berhasil dihapus, kembalikan response objek berupa `{"data": "OK"}`.

### Langkah 2: Buat Endpoint di Route Layer
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan route baru dengan method `DELETE /logout` pada instance Elysia. (Catatan: di `index.ts` route ini sudah di-group dengan prefix `/api/users`, jadi cukup tulis `.delete('/logout', ...)`).
3. Di dalam handler route:
   - Ambil nilai dari header `Authorization` yang dikirimkan oleh client.
   - Ekstrak nilai token dari format `Bearer <token>` (contoh: di-split berdasarkan spasi).
   - Jika header Authorization kosong, formatnya salah, atau token tidak ada, langsung kembalikan HTTP status 401 dan response JSON `{"error": "Unauthorized"}`.
   - Panggil fungsi `logoutUser(token)` yang sudah dibuat di service.
4. Tangkap error menggunakan blok `catch`. Jika menangkap error dengan pesan "Unauthorized" dari service, kembalikan HTTP status 401 dan JSON `{"error": "Unauthorized"}`.
5. Jika sukses, kembalikan response `{"data": "OK"}` dari service.

### Langkah 3: Pengujian (Testing)
1. Jalankan server lokal (`bun run dev`).
2. Gunakan HTTP client (seperti curl, Postman, atau bruno).
3. Skenario Gagal: Lakukan request `DELETE /api/users/logout` tanpa menyertakan header `Authorization`, atau gunakan token yang asal/salah. Pastikan mendapat error "Unauthorized" dengan status 401.
4. Skenario Sukses:
   - Lakukan proses login (POST `/api/users/login`) terlebih dahulu untuk mendapatkan token yang valid.
   - Gunakan token valid tersebut pada header `Authorization: Bearer <token_valid>` untuk request `DELETE /api/users/logout`.
   - Pastikan Anda mendapatkan response JSON `{"data": "OK"}` dengan HTTP status 200.
   - Coba lakukan request API `GET /api/users/current` menggunakan token yang sama yang baru saja dilogout. Pastikan sekarang hasilnya mengembalikan pesan error "Unauthorized", yang membuktikan bahwa token di database memang sudah benar-benar dihapus.

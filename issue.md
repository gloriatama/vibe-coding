# Bug Report & Perbaikan: Error 500 saat Registrasi dengan Nama Terlalu Panjang

Dokumen ini berisi laporan bug (Bug Report) beserta panduan langkah demi langkah untuk memperbaikinya. Panduan ini ditujukan bagi programmer junior atau model AI untuk mengeksekusi perbaikan sesuai dengan standar proyek.

## 1. Deskripsi Bug

- **Masalah:** Saat melakukan registrasi user baru (POST `/api/users`) dengan jumlah karakter pada field `name` yang sangat panjang (misal 300 karakter), server mengalami *crash* dan mengembalikan respons HTTP `500 Internal Server Error`.
- **Akar Penyebab (Root Cause):** Pada skema database (`src/db/schema.ts`), kolom `name` pada tabel `users` didefinisikan dengan batas panjang 255 karakter (`varchar('name', { length: 255 })`). Saat data yang melebihi batas ini dikirimkan, database PostgreSQL menolak *insert* tersebut dan melempar *exception*. Karena tidak ada validasi panjang string di level API, error ini lolos hingga ke database dan memicu respons 500.
- **Harapan (Expected Behavior):** API seharusnya menangkal input yang tidak valid sebelum menyentuh database dan mengembalikan respons HTTP `400 Bad Request` beserta pesan error yang jelas (contoh: "Nama maksimal 255 karakter").

## 2. Struktur File yang Terlibat

- **`src/routes/users-route.ts`**: Tempat validasi input API (request body) harus ditambahkan.

---

## 3. Tahapan Perbaikan (Langkah Demi Langkah)

Berikut adalah urutan pengerjaan yang harus dilakukan:

### Langkah 1: Tambahkan Validasi Panjang Karakter di Route Layer
1. Buka file `src/routes/users-route.ts`.
2. Cari bagian definisi skema validasi untuk endpoint registrasi (method `.post('', ...)`).
3. Saat ini, validasi untuk `name` hanya menggunakan `t.String()`.
4. Perbarui validasi tersebut dengan menambahkan batasan panjang (length constraint) bawaan ElysiaJS, yaitu:
   ```typescript
   name: t.String({ maxLength: 255 })
   ```
5. Lakukan hal yang sama untuk field `email` (jika belum) agar mencegah error serupa di masa mendatang:
   ```typescript
   email: t.String({ maxLength: 255 })
   ```

### Langkah 2: (Opsional) Penyesuaian Pesan Error
ElysiaJS secara otomatis akan menangkap (catch) validasi tipe dari `t.Object` dan mengembalikan respons `400 Bad Request` jika data tidak memenuhi syarat. Anda tidak perlu mengubah logika di dalam *handler function* (`async ({ body, set }) => { ... }`) untuk menangani ini, karena Elysia menanganinya sebelum kode di *handler* dieksekusi.

### Langkah 3: Pengujian (Testing) Perbaikan
1. Pastikan server berjalan (`bun run dev`).
2. Gunakan HTTP client (seperti curl, Postman, atau Bruno).
3. Buat payload JSON dengan field `name` berisi lebih dari 255 karakter.
4. Tembak endpoint `POST /api/users`.
5. Pastikan respons yang didapatkan sekarang adalah **HTTP 400 Bad Request** (bukan 500) dengan pesan dari Elysia yang menyatakan bahwa validasi `name` gagal karena melebihi batas karakter.
6. Lakukan pengujian tambahan dengan memasukkan nama yang normal (misal 10 karakter) untuk memastikan fungsionalitas registrasi normal tetap berjalan dengan baik.

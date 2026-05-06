# Implementasi Fitur Login User

Dokumen ini berisi panduan perencanaan dan langkah demi langkah untuk mengimplementasikan fitur login user. Panduan ini ditujukan bagi programmer junior atau model AI untuk mengeksekusi fitur sesuai dengan standar proyek.

## 1. Spesifikasi Database

Tabel `sessions` harus dibuat dengan struktur sebagai berikut:
- `id`: integer, auto increment, primary key
- `token`: varchar(255), not null (isinya UUID untuk token user yang login)
- `user_id`: integer, not null (Foreign Key ke tabel `users`)
- `created_at`: timestamp, default current_timestamp

## 2. Spesifikasi API

### Endpoint Login User
- **Method:** `POST`
- **Path:** `/api/users/login`

**Request Body:**
```json
{
	"email" : "gloria@localhost",
	"password" : "rahasia"
}
```

**Response Body (Success):**
```json
{
	"data" : "token"
}
```

**Response Body (Error):**
```json
{
	"error" : "Email atau password salah"
}
```

## 3. Struktur Folder dan File

Di dalam direktori `src`, kode diorganisasikan ke dalam struktur berikut:
- **`src/routes/`**: Folder ini berisi routing framework Elysia JS.
  - Aturan penamaan file menggunakan format: `[nama]-route.ts` (contoh: `users-route.ts`).
- **`src/services/`**: Folder ini berisi logic bisnis aplikasi.
  - Aturan penamaan file menggunakan format: `[nama]-service.ts` (contoh: `users-service.ts`).

---

## 4. Tahapan Implementasi (Langkah Demi Langkah)

Berikut adalah urutan pengerjaan yang harus dilakukan:

### Langkah 1: Buat Tabel Sessions
1. Buka file `src/db/schema.ts`.
2. Tambahkan definisi tabel `sessions` menggunakan Drizzle ORM sesuai dengan spesifikasi di atas. Pastikan untuk membuat relasi Foreign Key pada kolom `user_id` yang mengarah ke tabel `users`.
3. Buka terminal, jalankan perintah migrasi Drizzle untuk membuat file migrasi (misal: `bun run db:generate`).
4. Aplikasikan migrasi ke database (misal: `bun run db:push`).

### Langkah 2: Buat Logika Login di Service
1. Buka file `src/services/users-service.ts`.
2. Buat dan export fungsi baru (misal: `loginUser`) yang menerima parameter `email` dan `password`.
3. Alur logika di dalam fungsi tersebut:
   - Lakukan query ke database untuk mencari user berdasarkan `email`.
   - Jika user tidak ditemukan, lemparkan error "Email atau password salah".
   - Jika user ditemukan, verifikasi kecocokan `password` yang diinput dengan password hash yang tersimpan di database menggunakan Bun password API (`Bun.password.verify`).
   - Jika password tidak cocok, lemparkan error "Email atau password salah".
   - Jika validasi berhasil, generate token unik (gunakan UUID bawaan Node/Bun, misalnya `crypto.randomUUID()`).
   - Simpan data sesi baru ke tabel `sessions` (masukkan `token` dan `user_id`).
   - Kembalikan token dalam format objek `{"data": "token_string"}`.

### Langkah 3: Buat Endpoint Login di Route
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan route baru `POST /login` pada instance Elysia yang sudah ada. Karena route ini sudah digrup di file `index.ts` dengan awalan `/api/users`, Anda hanya perlu mendefinisikan `.post('/login', ...)` di dalam `users-route.ts`.
3. Tambahkan validasi tipe data pada request body (`email` dan `password`) menggunakan tipe skema Elysia (`t.Object`).
4. Di dalam handler route, panggil fungsi `loginUser` dari service.
5. Tangkap error menggunakan blok `catch`. Jika pesan error adalah "Email atau password salah", kembalikan response dengan status HTTP 401 (Unauthorized) dan isi body JSON `{"error": "Email atau password salah"}`.
6. Jika terjadi error lain, kembalikan status HTTP 500 (Internal Server Error).
7. Jika sukses, kembalikan HTTP response dari service (berisi data token).

### Langkah 4: Pengujian (Testing)
1. Pastikan server lokal berjalan (`bun run dev`).
2. Gunakan HTTP client (seperti curl, Postman, atau bruno).
3. Buat request POST ke `/api/users/login` dengan kredensial yang salah. Pastikan menerima respons error yang sesuai.
4. Buat request POST ke `/api/users/login` dengan kredensial yang benar. Pastikan menerima balasan JSON berisi properti `data` dengan nilai token.
5. Periksa database untuk memastikan token tersimpan dengan benar di tabel `sessions`.

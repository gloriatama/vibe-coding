# Implementasi Fitur Registrasi User

Dokumen ini berisi panduan perencanaan dan langkah demi langkah untuk mengimplementasikan fitur registrasi user baru. Panduan ini ditujukan bagi programmer atau model AI untuk mengeksekusi fitur sesuai dengan standar proyek.

## 1. Spesifikasi Database

Tabel `users` harus memiliki struktur sebagai berikut:
- `id`: integer, auto increment, primary key
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (password merupakan hasil hash dari bcrypt)
- `created_at`: timestamp, default current_timestamp

## 2. Spesifikasi API

### Endpoint Registrasi User
- **Method:** `POST`
- **Path:** `/api/users`

**Request Body:**
```json
{
	"name" : "Gloria",
	"email" : "gloria@localhost",
	"password" : "rahasia"
}
```

**Response Body (Success):**
```json
{
	"data" : "OK"
}
```

**Response Body (Error):**
```json
{
	"error" : "Email sudah terdaftar"
}
```

## 3. Struktur Folder dan File

Di dalam direktori `src`, kode harus diorganisasikan ke dalam struktur berikut:
- **`src/routes/`**: Folder ini berisi routing framework ElysiaJS.
  - Aturan penamaan file: `[nama]-route.ts` (contoh: `users-route.ts`).
- **`src/services/`**: Folder ini berisi business logic (logika aplikasi dan interaksi database).
  - Aturan penamaan file: `[nama]-service.ts` (contoh: `users-service.ts`).

---

## Tahapan Implementasi (Langkah Demi Langkah)

Berikut adalah urutan pengerjaan yang harus dilakukan:

### Langkah 1: Update Skema Database
1. Buka file `src/db/schema.ts`.
2. Perbarui tabel `users` yang sudah ada (atau buat jika belum sesuai) menggunakan Drizzle ORM agar persis dengan "Spesifikasi Database" di atas. Gunakan `varchar(255)` untuk name, email, dan password.
3. Buka terminal, jalankan perintah migrasi Drizzle untuk membuat file migrasi (misalnya `bun run db:generate`).
4. Aplikasikan migrasi ke database (misalnya `bun run db:push`).

### Langkah 2: Buat Service Layer (Business Logic)
1. Buat folder `src/services` (jika belum ada).
2. Buat file baru `src/services/users-service.ts`.
3. Di dalam file tersebut, buat dan export fungsi (misal: `registerUser`) yang menerima parameter `name`, `email`, dan `password`.
4. Alur logika di dalam fungsi tersebut:
   - Lakukan query ke database menggunakan Drizzle untuk mencari apakah `email` tersebut sudah ada.
   - Jika ada, kembalikan sebuah error atau flag yang menandakan "Email sudah terdaftar".
   - Jika belum ada, lakukan hashing pada `password`. Karena kita menggunakan Bun, sangat disarankan menggunakan API internal `Bun.password.hash(password, "bcrypt")` alih-alih menginstal library eksternal.
   - Simpan data user baru (name, email, password yang sudah di-hash) ke tabel `users`.

### Langkah 3: Buat Route Layer (HTTP Handler)
1. Buat folder `src/routes` (jika belum ada).
2. Buat file baru `src/routes/users-route.ts`.
3. Di dalam file ini, buat instance Elysia baru dan definisikan route `POST /`. (Prefix `/api/users` akan ditangani di file utama).
4. Ambil payload body (`name`, `email`, `password`) dari request. Tambahkan skema validasi tipe data menggunakan bawaan Elysia (`t.Object`) agar request body tervalidasi.
5. Panggil fungsi `registerUser` dari `users-service.ts`.
6. Jika fungsi mengembalikan error duplikasi email, kembalikan HTTP response dengan JSON `{"error" : "Email sudah terdaftar"}` beserta status code 400 Bad Request.
7. Jika sukses, kembalikan HTTP response dengan JSON `{"data" : "OK"}`.

### Langkah 4: Daftarkan Route ke Aplikasi Utama
1. Buka file `src/index.ts`.
2. Lakukan import module route dari `src/routes/users-route.ts`.
3. Daftarkan route tersebut ke instance aplikasi utama dengan menambahkan prefix, misalnya `.group('/api/users', app => app.use(usersRoute))` atau cara lain yang ekuivalen di Elysia.

### Langkah 5: Pengujian (Testing)
1. Jalankan server lokal aplikasi.
2. Gunakan HTTP client (seperti `curl`, Postman, atau Bruno) untuk menembak endpoint `POST /api/users` dengan JSON body sesuai spesifikasi.
3. Uji dua skenario:
   - Skenario Sukses: Pastikan data masuk ke database, password ter-hash, dan response `{"data" : "OK"}` muncul.
   - Skenario Gagal: Lakukan request lagi dengan email yang sama, pastikan response `{"error" : "Email sudah terdaftar"}` muncul dan aplikasi tidak crash.

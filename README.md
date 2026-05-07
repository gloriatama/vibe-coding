# Vibe Coding Backend

Aplikasi backend sederhana berbasis Bun untuk manajemen user (registrasi, login, profil, dan logout) menggunakan arsitektur service-route yang bersih dan modern.

## 🚀 Technology Stack & Libraries

- **Runtime:** [Bun](https://bun.sh/) (Fast all-in-one JavaScript runtime)
- **Framework:** [ElysiaJS](https://elysiajs.com/) (Ergonomic Framework for Bun)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (TypeScript ORM)
- **Database:** PostgreSQL
- **Driver:** [Postgres.js](https://github.com/porsager/postgres)
- **Validation:** TypeBox (via Elysia `t`)
- **Testing:** `bun test`

---

## 🏗️ Arsitektur Proyek

Proyek ini mengikuti pola pemisahan tanggung jawab antara routing dan logika bisnis.

### Struktur Folder
```text
.
├── drizzle/              # File migrasi database (auto-generated)
├── src/
│   ├── db/               # Konfigurasi database & schema
│   │   ├── index.ts      # Inisialisasi koneksi drizzle
│   │   └── schema.ts     # Definisi tabel & relasi
│   ├── routes/           # Layer Routing (Elysia JS)
│   │   └── users-route.ts
│   ├── services/         # Layer Logic Bisnis
│   │   └── users-service.ts
│   └── index.ts          # Entry point aplikasi
├── tests/                # Unit testing (bun test)
│   └── users.test.ts
├── .env                  # Environment variables
├── drizzle.config.ts     # Konfigurasi Drizzle Kit
└── package.json
```

### Penamaan File
- **Routes:** Menggunakan format `[resource]-route.ts`.
- **Services:** Menggunakan format `[resource]-service.ts`.

---

## 🗄️ Database Schema

### 1. Tabel `users`
Menyimpan informasi utama pengguna.
- `id`: Serial (Primary Key)
- `name`: Varchar(255)
- `email`: Varchar(255) (Unique)
- `password`: Varchar(255) (Hashed)
- `created_at`: Timestamp

### 2. Tabel `sessions`
Menyimpan token sesi aktif untuk autentikasi.
- `id`: Serial (Primary Key)
- `token`: Varchar(255) (UUID)
- `user_id`: Integer (Foreign Key ke `users.id`)
- `created_at`: Timestamp

---

## 📡 API Endpoints

Semua endpoint API diawali dengan prefix `/api`.

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Registrasi user baru | Tidak |
| `POST` | `/api/users/login` | Login user & dapatkan token | Tidak |
| `GET` | `/api/users/current` | Ambil data profil user saat ini | Ya (Bearer) |
| `DELETE` | `/api/users/logout` | Logout & hapus sesi | Ya (Bearer) |

---

## 🛠️ Setup & Instalasi

1. **Clone & Install Dependencies**
   ```bash
   bun install
   ```

2. **Konfigurasi Environment**
   Salin `.env.example` menjadi `.env` dan isi koneksi database Anda.
   ```text
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   ```

3. **Push Schema ke Database**
   Gunakan Drizzle Kit untuk menyelaraskan skema database.
   ```bash
   bun run db:push
   ```

---

## 🏃 Menjalankan Aplikasi

**Mode Development (dengan Hot Reload):**
```bash
bun run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🧪 Testing

Menjalankan seluruh unit test menggunakan runner bawaan Bun. Data di database akan dibersihkan secara otomatis sebelum setiap skenario tes dijalankan untuk memastikan konsistensi.

```bash
bun test
```

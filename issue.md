# Perencanaan Pembuatan Unit Test API

Dokumen ini berisi daftar perencanaan skenario untuk pembuatan unit test seluruh API yang tersedia pada proyek ini. Implementasi detail pengujian akan dilakukan oleh programmer junior atau model AI.

## 1. Spesifikasi Teknis Pengujian
- **Framework:** Menggunakan bawaan dari ekosistem Bun yaitu `bun test`.
- **Lokasi File:** Semua file pengujian harus diletakkan di dalam folder `tests/` di root proyek.
- **Konsistensi Data:** **SANGAT PENTING!** Sebelum menjalankan setiap skenario (misalnya menggunakan hook `beforeEach`), data terkait di dalam database harus dihapus/dibersihkan terlebih dahulu agar hasil test selalu konsisten dan tidak saling mengganggu antar skenario.

---

## 2. Daftar API dan Skenario Pengujian

Berikut adalah daftar endpoint API yang harus diuji beserta skenario-skenario yang wajib di-cover:

### A. Endpoint Registrasi (`POST /api/users`)
1. **[Sukses]** Registrasi berhasil dengan payload (nama, email, password) yang valid.
2. **[Gagal]** Registrasi menggunakan email yang sudah pernah terdaftar sebelumnya di database.
3. **[Gagal]** Registrasi dengan payload yang tidak lengkap (misalnya field `email` atau `password` dihilangkan).
4. **[Gagal]** Registrasi dengan panjang karakter `name` atau `email` melebihi batas maksimal (lebih dari 255 karakter).

### B. Endpoint Login (`POST /api/users/login`)
1. **[Sukses]** Login berhasil menggunakan email dan password yang benar (harus mengembalikan *session token*).
2. **[Gagal]** Login menggunakan email yang tidak terdaftar di database.
3. **[Gagal]** Login menggunakan email yang benar, namun dengan password yang salah.
4. **[Gagal]** Login dengan payload yang tidak lengkap atau kosong.

### C. Endpoint Get Current User (`GET /api/users/current`)
1. **[Sukses]** Mendapatkan profil user menggunakan header `Authorization: Bearer <token>` yang valid.
2. **[Gagal]** Mencoba mengakses endpoint tanpa mengirimkan header `Authorization` sama sekali.
3. **[Gagal]** Mengakses endpoint dengan token yang tidak valid, salah, atau acak (tidak ada di database).
4. **[Gagal]** Mengirimkan header `Authorization` namun dengan format yang salah (misalnya tanpa awalan `Bearer `).

### D. Endpoint Logout (`DELETE /api/users/logout`)
1. **[Sukses]** Logout berhasil menggunakan token yang valid (harus menghapus data sesi dari tabel `sessions` di database).
2. **[Gagal]** Mencoba logout tanpa mengirimkan header `Authorization`.
3. **[Gagal]** Mencoba logout menggunakan token yang tidak valid atau sudah tidak ada di database.
4. **[Integrasi]** Lakukan operasi `GET /api/users/current` menggunakan token yang baru saja di-logout; pastikan operasi ini gagal (Unauthorized) karena token seharusnya sudah dihapus.

---

## 3. Instruksi Tambahan untuk Implementator
- Tidak ada spesifikasi teknis kode yang mendetail, silakan kembangkan *assertion* (seperti pengecekan HTTP Status Code, validasi struktur JSON respons, dll) sesuai dengan *best practice* pengujian.
- Pastikan koneksi dan inisialisasi database di dalam folder `tests/` sudah dikonfigurasi dengan benar agar tidak mengenai data produksi jika memungkinkan.
- Fokus pada *coverage* dari skenario di atas agar mencakup berbagai *edge cases*.

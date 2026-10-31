# Panduan Setup & Konfigurasi Supabase CMS KRONABEL

Panduan ini berisi langkah-langkah praktis untuk mengaktifkan sistem Content Management System (CMS), media management, dan fitur masukan publik KRONABEL menggunakan Supabase.

---

## 1. Persiapan Akun & Proyek Supabase

1. Buka [https://supabase.com](https://supabase.com) dan masuk ke akun Anda.
2. Buat proyek baru (*New Project*):
   - **Name**: `kronabel-cms` (atau nama lain sesuai preferensi)
   - **Database Password**: Buat password yang kuat dan simpan di tempat aman.
   - **Region**: Pilih `Singapore (ap-southeast-1)` untuk latensi tercepat dari Indonesia.
   - **Pricing Plan**: Free Tier sudah sangat memadai.

---

## 2. Eksekusi SQL Migration

1. Di dashboard Supabase, buka menu **SQL Editor** pada navigasi sebelah kiri.
2. Klik **New query**.
3. Buka berkas `supabase/migrations/20261031_kronabel_cms_init.sql` di repository ini, lalu salin seluruh kodenya dan tempel ke SQL Editor Supabase.
4. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Periksa pesan eksekusi: pastikan muncul keterangan `Success. No rows returned`.

### Struktur Tabel yang Dibuat:
- `admin_users`: Tabel data akun pengelola/admin resmi.
- `site_settings`: Pengaturan konfigurasi global (metadata, versi rilis, URL Saweria).
- `site_content`: Konten dinamis setiap halaman website (Beranda, Panduan, Riwayat Versi, dll).
- `feedback`: Kotak masukan pengunjung (saran, kritik, bug report, fitur baru).
- `content_history`: Audit log riwayat pembaruan konten oleh admin.

---

## 3. Konfigurasi Storage Bucket (`website-media`)

Skrip SQL migration telah menginisialisasi bucket `website-media` dan aturan keamanannya (RLS). Anda dapat memverifikasinya:
1. Di dashboard Supabase, buka menu **Storage**.
2. Pastikan bucket bernama **`website-media`** telah ada dan berstatus **Public Bucket** (agar pengunjung dapat melihat gambar yang disematkan di website).
3. Jika bucket belum muncul:
   - Klik **New bucket**.
   - Masukkan nama: `website-media`.
   - Centang opsi **Public bucket**.
   - Simpan (*Save*).

---

## 4. Mendapatkan Kunci Kredensial API

1. Di dashboard Supabase, buka menu **Project Settings** (ikon gerigi di kiri bawah) > **API**.
2. Salin tiga nilai berikut:
   - **Project URL**: Nilai dari `URL` (misal: `https://xyzcompany.supabase.co`).
   - **anon / public key**: Kunci publik untuk browser (aman dilihat client).
   - **service_role key**: Kunci rahasia untuk backend server Next.js (*Jaga kerahasiaan kunci ini*).

---

## 5. Menetapkan Environment Variables di Vercel

1. Buka [https://vercel.com](https://vercel.com) dan pilih proyek **kronabel-website**.
2. Masuk ke tab **Settings** > **Environment Variables**.
3. Tambahkan 4 variabel berikut untuk seluruh environment (**Production**, **Preview**, **Development**):

| Nama Variabel | Nilai Contoh | Keterangan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Project URL dari Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Anon/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Service role secret key |
| `ADMIN_SETUP_SECRET` | `KRONABEL_SECURE_BOOTSTRAP_2026` | Token rahasia sekali pakai untuk membuat akun admin pertama |

4. Klik **Save** pada setiap variabel.
5. Lakukan **Redeploy** deployment terakhir di Vercel agar environment variables baru langsung aktif.

---

## 6. Bootstrap Akun Admin Pertama (Sekali Pakai)

Setelah environment variables aktif di Vercel:
1. Buka halaman bootstrap akun di browser:
   `https://kronabel.vercel.app/admin/setup`
2. Masukkan token setup rahasia yang Anda buat pada `ADMIN_SETUP_SECRET`.
3. Masukkan **Email Admin** resmi Anda (misal: `admin@kronabel.id`).
4. Buat **Password Admin** yang kuat (minimal 8 karakter).
5. Klik **Daftarkan Akun Admin Utama**.
6. Sistem akan otomatis mendaftarkan akun di Supabase Auth dan mencatatnya sebagai admin resmi di tabel `admin_users`.
7. Setelah akun pertama terdaftar, halaman `/admin/setup` akan terkunci secara permanen demi keamanan.

---

## 7. Masuk dan Mengelola CMS

1. Buka halaman login admin:
   `https://kronabel.vercel.app/admin/login`
2. Masukkan email dan password admin yang telah dibuat.
3. Anda akan diarahkan ke Dashboard `/admin` untuk:
   - **Kelola Konten (`/admin/konten`)**: Mengubah teks, judul, subjudul, dan deskripsi halaman tanpa mengedit kode.
   - **Pustaka Media (`/admin/media`)**: Mengunggah screenshot aplikasi, logo, atau ilustrasi ke Supabase Storage.
   - **Daftar Halaman (`/admin/halaman`)**: Memeriksa status publikasi seluruh halaman.
   - **Kotak Masukan (`/admin/masukan`)**: Membaca saran, kritik, dan laporan bug dari pengunjung website publik.
   - **Pengaturan Umum (`/admin/pengaturan`)**: Mengelola URL Saweria, parameter rilis, dan nomor versi terkini.

---

## 8. Arsitektur Graceful Fallback (Nol Downtime)

Sistem CMS KRONABEL dirancang dengan prinsip *high resilience*:
- Apabila koneksi Supabase belum dikonfigurasi atau mengalami kendala, website publik **tetap berjalan 100% normal** menggunakan konten default bawaan (`src/config/site.ts`).
- Pengunjung tidak akan pernah melihat layar error 500 atau halaman kosong.


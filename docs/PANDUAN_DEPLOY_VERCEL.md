# Panduan Deployment Website KRONABEL ke Vercel

Panduan ini memandu langkah-langkah mempublikasikan website resmi KRONABEL dari folder lokal `D:\Kronabel-Website` ke platform hosting global Vercel dengan subdomain resmi `*.vercel.app`.

---

## 🔒 Checklist Keamanan Sebelum Deployment

Sebelum mengunggah kode ke GitHub atau Vercel, pastikan hal-hal berikut:

- [x] **File Sensitif & Lingkungan**: Tidak ada file `.env`, `.env.local`, password, atau token API yang berada di folder proyek.
- [x] **Pengecualian Berkas (`.gitignore`)**: Folder `node_modules/`, `.next/`, `build/`, serta file binary installer (`*.exe`, `*.zip`) telah dikecualikan secara ketat oleh `.gitignore`.
- [x] **Bebas Ketergantungan Backend**: Website bersifat 100% statis (*Static Site Generation*) dan tidak membutuhkan koneksi database server eksternal saat di-hosting.
- [x] **Kompilasi Lokal Berhasil**: Perintah `npm run build` berhasil dijalankan secara lokal dengan exit code 0.

---

## Langkah 1: Menentukan Visibilitas & Membuat Repositori GitHub

Website KRONABEL membutuhkan repositori Git khusus (terpisah dari aplikasi desktop).

1. Buka [GitHub](https://github.com) dan masuk ke akun Anda.
2. Klik tombol **New** untuk membuat repositori baru.
3. Beri nama repositori, misalnya: `kronabel-website`.
4. **Tentukan Visibilitas**:
   - **Public (Direkomendasikan)**: Sangat mudah dihubungkan ke Vercel versi gratis (Hobby Plan) dan transparan untuk komunitas sekolah.
   - **Private**: Jika Anda memilih menjaga kode sumber situs tetap privat. Vercel tetap dapat mengimpor repositori privat setelah Anda memberi izin integrasi.
5. Biarkan opsi *Add a README file*, *.gitignore*, dan *license* tidak dicentang (karena file-file ini sudah ada di folder lokal).
6. Klik **Create repository**.

---

## Langkah 2: Mengunggah Kode Website ke GitHub

Jika Git CLI telah terpasang di komputer Anda:

```powershell
# 1. Pindah ke direktori website
cd D:\Kronabel-Website

# 2. Inisialisasi Git jika belum
git init

# 3. Periksa status berkas (pastikan tidak ada node_modules atau .next yang masuk)
git status

# 4. Tambahkan berkas dan buat komit pertama
git add .
git commit -m "feat: rilis website resmi KRONABEL v1.2.2 siap deploy"

# 5. Ubah branch utama menjadi main dan hubungkan remote
git branch -M main
git remote add origin https://github.com/<username-github-anda>/kronabel-website.git

# 6. Push kode ke GitHub
git push -u origin main
```

> **Alternatif Tanpa Git CLI:** Anda juga dapat menggunakan aplikasi visual **GitHub Desktop** (*File &rarr; Add Local Repository &rarr; Pilih D:\Kronabel-Website &rarr; Publish Repository*).

---

## Langkah 3: Menghubungkan Repositori ke Vercel

1. Buka dashboard [Vercel](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Di halaman dashboard, klik tombol **Add New...** &rarr; **Project**.
3. Pada bagian **Import Git Repository**, cari repositori `kronabel-website` yang baru Anda buat, lalu klik **Import**.
4. Di halaman **Configure Project**:
   - **Project Name**: `kronabel-website` (atau nama pilihan Anda).
   - **Framework Preset**: `Next.js` (terdeteksi secara otomatis).
   - **Root Directory**: `./` (biarkan default).
   - **Build and Output Settings**: Biarkan default (`next build`).
   - **Environment Variables**: Kosongkan (tidak dibutuhkan).
5. Klik tombol **Deploy**.

---

## Langkah 4: Verifikasi & Pencatatan URL Vercel

1. Tunggu proses build Vercel berjalan (biasanya memerlukan waktu 1–2 menit).
2. Setelah selesai, Vercel akan menampilkan layar ucapan selamat (*Congratulations!*) beserta tautan domain resmi.
3. **Catat URL Resmi yang Diberikan Vercel**:
   - Format domain resmi biasanya berbentuk: `https://kronabel-website.vercel.app` (atau nama unik sesuai ketersediaan di sistem Vercel).
   - *Penting: Jangan menebak atau menggunakan URL sebelum dashboard Vercel menyatakannya aktif.*
4. Uji website yang sudah tayang online:
   - Periksa halaman Beranda (`/`).
   - Periksa halaman Panduan (`/panduan`).
   - Periksa halaman Riwayat Versi (`/riwayat-versi`).
   - Periksa halaman Tentang (`/tentang`).
   - Periksa halaman Kebijakan Privasi (`/privasi`).
   - Periksa halaman Unduh (`/unduh`).
   - Periksa tampilan pada perangkat seluler (smartphone).


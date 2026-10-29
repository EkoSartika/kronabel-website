# Panduan Publikasi GitHub Releases & Distribusi Aplikasi KRONABEL

Dokumentasi ini menjelaskan langkah-langkah mempublikasikan berkas distribusi aplikasi desktop KRONABEL v1.2.2 ke GitHub Releases dan menghubungkannya ke website resmi.

---

## ⚠️ Prinsip Penting: Pemisahan Dua Repositori

Sebelum memulai, pahami bahwa proyek ini terbagi menjadi **dua entitas repositori yang terpisah secara tegas**:

| Entitas | Nama Repositori yang Disarankan | Lokasi Folder Lokal | Isi Repositori |
| :--- | :--- | :--- | :--- |
| **Aplikasi Desktop** | `bel-otomatis-sekolah` atau `kronabel-app` | `D:\BelOtomatisSekolah` | Kode sumber Python/PySide6 desktop dan rilis binary EXE/ZIP |
| **Website Resmi** | `kronabel-website` | `D:\Kronabel-Website` | Kode sumber Next.js, TypeScript, dan Tailwind CSS |

> **PERINGATAN KEAMANAN & ARSITEKTUR:**
> 1. **DILARANG** mengunggah berkas instalasi (`.exe`) atau arsip (`.zip`) ke dalam repositori kode website.
> 2. **DILARANG** membuat release tag `v1.2.2` pada repositori website untuk menyamarkan rilis aplikasi desktop.
> 3. Repositori website hanya bertugas menyediakan tombol unduhan yang mengarah (*direct link*) ke URL rilis resmi yang di-hosting pada GitHub Releases milik repositori aplikasi desktop.

---

## Langkah 1: Persiapan File Rilis dari Folder Desktop

Berkas biner rilis v1.2.2 telah selesai dibuat dan diverifikasi secara lokal di folder:
📂 `D:\BelOtomatisSekolah\release\`

Daftar berkas yang akan diunggah ke GitHub Releases:
1. **Setup Installer:** `BelOtomatisSekolah_Setup_v1.2.2.exe`
   - Ukuran: `47,842,113 bytes` (~45.63 MB)
   - SHA-256: `c1a6275c94533f54b8fca069de453a34b2c10a3aedb8f63450acbeda4dc72ae0`
2. **Portable ZIP:** `BelOtomatisSekolah_Portable_v1.2.2.zip`
   - Ukuran: `83,673,779 bytes` (~79.80 MB)
   - SHA-256: `a8f693c6ab2dd5c28a55c05231758be749050b2aae9c8ccd221761868d0f8004`

---

## Langkah 2: Verifikasi Integritas File Sebelum Diunggah

Buka PowerShell di komputer Anda dan jalankan perintah verifikasi hash berikut untuk memastikan file tidak rusak atau berubah:

```powershell
# Verifikasi Setup Installer
Get-FileHash "D:\BelOtomatisSekolah\release\BelOtomatisSekolah_Setup_v1.2.2.exe" -Algorithm SHA256

# Verifikasi Portable ZIP
Get-FileHash "D:\BelOtomatisSekolah\release\BelOtomatisSekolah_Portable_v1.2.2.zip" -Algorithm SHA256
```

Pastikan output nilai hash identik dengan nilai hash resmi yang tercantum di Langkah 1.

---

## Langkah 3: Membuat Rilis v1.2.2 di Repositori Aplikasi GitHub

1. Buka peramban dan masuk ke akun GitHub Anda.
2. Buka halaman repositori **Aplikasi Desktop** Anda (misalnya: `https://github.com/<username>/<nama-repo-aplikasi>`).
   > *Catatan: Jika repositori aplikasi di GitHub belum dibuat, buat repositori baru (bisa Public atau Private) khusus untuk aplikasi desktop terlebih dahulu.*
3. Pada menu sebelah kanan, klik **Releases** &rarr; **Draft a new release** (atau buat rilis baru).
4. Isi data rilis sebagai berikut:
   - **Choose a tag**: Ketik `v1.2.2` lalu pilih *Create new tag: v1.2.2 on publish*.
   - **Target**: Pilih cabang utama Anda (biasanya `main` atau `master`).
   - **Release title**: `KRONABEL v1.2.2 — Rilis Stabil Windows 10 & 11 (64-bit)`
   - **Description**: Tempelkan catatan perubahan singkat, contoh:
     ```markdown
     ## Pembaruan KRONABEL v1.2.2 (29 Oktober 2026)
     
     - Penyempurnaan sistem interupsi audio dan Single Active Audio Controller.
     - Pencatatan log dan status jadwal otomatis yang terlewat (missed) saat bel manual aktif.
     - Pembersihan proporsi antarmuka panel ringkas 740×380 px.
     - Kompatibilitas penuh untuk Windows 10 dan Windows 11 (64-bit).
     
     ### Verifikasi Integritas Berkas (SHA-256)
     - BelOtomatisSekolah_Setup_v1.2.2.exe: c1a6275c94533f54b8fca069de453a34b2c10a3aedb8f63450acbeda4dc72ae0
     - BelOtomatisSekolah_Portable_v1.2.2.zip: a8f693c6ab2dd5c28a55c05231758be749050b2aae9c8ccd221761868d0f8004
     ```
5. **Attach binaries by dropping them here or selecting them**:
   - Tarik atau pilih file:
     - `D:\BelOtomatisSekolah\release\BelOtomatisSekolah_Setup_v1.2.2.exe`
     - `D:\BelOtomatisSekolah\release\BelOtomatisSekolah_Portable_v1.2.2.zip`
   - Tunggu hingga proses unggah kedua file mencapai 100%.
6. Klik **Publish release**.

---

## Langkah 4: Menyalin Tautan Unduhan Resmi ke Konfigurasi Website

Setelah rilis dipublikasikan di GitHub:

1. Pada halaman rilis yang baru dibuat, klik kanan pada nama berkas `BelOtomatisSekolah_Setup_v1.2.2.exe` di bagian **Assets** &rarr; pilih **Copy link address**.
   *Format tautan resmi biasanya berbentuk:*
   `https://github.com/<username>/<repo-aplikasi>/releases/download/v1.2.2/BelOtomatisSekolah_Setup_v1.2.2.exe`
2. Lakukan hal yang sama untuk `BelOtomatisSekolah_Portable_v1.2.2.zip`.
3. Buka file konfigurasi website di komputer Anda:
   📄 `D:\Kronabel-Website\src\config\site.ts`
4. Masukkan tautan unduhan tersebut pada bagian `release`:
   ```typescript
   export const SITE_CONFIG = {
     // ...
     release: {
       latestVersion: "1.2.2",
       // ...
       installer: {
         filename: "BelOtomatisSekolah_Setup_v1.2.2.exe",
         size: "45.63 MB",
         sha256: "c1a6275c94533f54b8fca069de453a34b2c10a3aedb8f63450acbeda4dc72ae0",
         // Tempelkan URL installer GitHub Release di sini:
         downloadUrl: "https://github.com/<username>/<repo-aplikasi>/releases/download/v1.2.2/BelOtomatisSekolah_Setup_v1.2.2.exe",
       },
       portable: {
         filename: "BelOtomatisSekolah_Portable_v1.2.2.zip",
         size: "79.80 MB",
         sha256: "a8f693c6ab2dd5c28a55c05231758be749050b2aae9c8ccd221761868d0f8004",
         // Tempelkan URL portable ZIP GitHub Release di sini:
         downloadUrl: "https://github.com/<username>/<repo-aplikasi>/releases/download/v1.2.2/BelOtomatisSekolah_Portable_v1.2.2.zip",
       },
     },
   };
   ```
5. Simpan file `site.ts`.
6. Jalankan `npm run build` di folder website untuk memvalidasi pembaruan. Halaman `/unduh` kini otomatis mengaktifkan tombol unduhan langsung menuju GitHub Releases!


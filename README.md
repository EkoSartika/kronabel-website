# Website Resmi KRONABEL (Aplikasi Bel Sekolah Otomatis)

Website statis resmi untuk **KRONABEL** — Aplikasi Bel Sekolah Otomatis untuk Windows 10 & 11 (64-bit).

---

## 🚀 Teknologi yang Digunakan

- **Framework**: Next.js 15 (App Router, Static Export)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Ikon**: Lucide React
- **Hosting Target**: Vercel / GitHub Pages / Static Hosting

---

## 📁 Struktur Direktori

```text
D:\Kronabel-Website\
├── public\
│   └── images\              # Aset visual, logo, icon, dan screenshot asli aplikasi
├── src\
│   ├── app\
│   │   ├── dukungan\        # Halaman donasi sukarela (Saweria)
│   │   ├── panduan\         # Dokumentasi & panduan penggunaan lengkap
│   │   ├── riwayat-versi\   # Catatan perubahan rilis (v1.2.0, v1.2.1, v1.2.2)
│   │   ├── unduh\           # Paket installer .exe & portable .zip + SHA-256
│   │   ├── globals.css      # Gaya dasar Tailwind & palet warna kustom
│   │   ├── layout.tsx       # Root layout, metadata SEO, Navbar & Footer
│   │   └── page.tsx         # Beranda utama (Hero, Fitur, Review, FAQ, CTA)
│   ├── components\
│   │   ├── BrandLogo.tsx    # Komponen logo geometris lonceng KRONABEL
│   │   ├── DownloadHelper.tsx # Tombol interaktif salin hash & panduan PowerShell
│   │   ├── Footer.tsx       # Footer resmi terpadu
│   │   └── Navbar.tsx       # Navigasi responsif (Desktop & Mobile)
│   └── config\
│       └── site.ts          # Konfigurasi terpusat (Nama merek, versi rilis, hash SHA-256, URL download)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Menjalankan di Komputer Lokal

1. Buka terminal PowerShell pada direktori `D:\Kronabel-Website`:
   ```powershell
   cd D:\Kronabel-Website
   ```

2. Jalankan development server:
   ```powershell
   npm run dev
   ```

3. Buka peramban (browser) di alamat:
   ```text
   http://localhost:3000
   ```

---

## 📦 Menguji Kompilasi Produksi (Production Build)

Jalankan perintah:
```powershell
npm run build
```
Seluruh rute (`/`, `/unduh`, `/panduan`, `/riwayat-versi`, `/dukungan`) akan dikompilasi secara statis (`Static HTML/JS`) dengan performa maksimal.

---

## ⚙️ Mengubah Konfigurasi & Link Download

Seluruh data versi, nama merek sementara, URL Saweria, dan link berkas download dikelola dalam satu file konfigurasi:
👉 [`src/config/site.ts`](src/config/site.ts)

Contoh mengubah link unduhan rilis:
```typescript
export const SITE_CONFIG = {
  // ...
  release: {
    latestVersion: "1.2.2",
    installer: {
      filename: "BelOtomatisSekolah_Setup_v1.2.2.exe",
      size: "45.63 MB",
      sha256: "c1a6275c94533f54b8fca069de453a34b2c10a3aedb8f63450acbeda4dc72ae0",
      downloadUrl: "https://url-penyimpanan-cloud-anda/BelOtomatisSekolah_Setup_v1.2.2.exe",
    },
    // ...
  }
};
```
Jika `downloadUrl` dibiarkan kosong (`""`), halaman Unduh secara otomatis menampilkan status badge *"Unduhan Cloud Segera Tersedia"* dan mengarahkan operator untuk mengambil berkas lokal langsung dari direktori rilis.

---

## ☁️ Panduan Deploy ke Vercel

1. Buat repositori baru di GitHub (misalnya: `kronabel-official-web`).
2. Masukkan seluruh file `D:\Kronabel-Website` ke dalam repositori GitHub tersebut.
3. Buka [Vercel Dashboard](https://vercel.com) &rarr; **Add New Project**.
4. Import repositori GitHub Anda.
5. Vercel akan otomatis mendeteksi pengaturan Next.js. Klik **Deploy**.
6. Website resmi KRONABEL langsung online dengan HTTPS gratis dan CDN global.


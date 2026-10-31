/**
 * Konfigurasi Terpusat Website Resmi KRONABEL
 * Memudahkan perubahan nama merek, versi rilis, URL unduhan, dan tautan dukungan.
 */

export const SITE_CONFIG = {
  brandName: "KRONABEL",
  brandSubtitle: "Aplikasi Bel Sekolah Otomatis",
  siteUrl: "https://kronabel.vercel.app",
  tagline: "Bel Otomatis, Waktu Lebih Teratur.",
  description:
    "Kelola jadwal bel sekolah secara praktis melalui aplikasi Windows yang mudah digunakan. Gratis, tanpa biaya langganan, dan bekerja 100% offline.",
  targetOS: "Windows 10 & Windows 11 (64-bit)",
  author: "Pengembang KRONABEL",
  brandDisclaimer:
    "KRONABEL merupakan kandidat nama merek sementara untuk aplikasi Bel Sekolah Otomatis yang sedang dalam tahap verifikasi ketersediaan. Tidak ada klaim hak cipta terdaftar sebelum pemeriksaan selesai.",

  // Dukungan Pengembang (Saweria)
  donation: {
    platform: "Saweria",
    url: "https://saweria.co/sartikamuhammadeko",
    status: "active" as const,
    description:
      "KRONABEL 100% gratis digunakan untuk seluruh sekolah di Indonesia tanpa biaya lisensi maupun langganan. Jika Anda merasa aplikasi ini bermanfaat, Anda dapat memberikan dukungan untuk keberlanjutan pengembangan.",
  },

  // Konfigurasi Rilis Resmi (Distribusi via GitHub Releases)
  release: {
    latestVersion: "1.2.2",
    releaseDate: "29 Oktober 2026",
    framework: "Python 3.11.9 + PySide6 (Qt 6.12 Native)",
    architecture: "Windows x64 (64-bit)",
    githubReleaseUrl: "https://github.com/EkoSartika/kronabel/releases/tag/v1.2.2",
    repositoryUrl: "https://github.com/EkoSartika/kronabel",

    // Paket Installer Windows (Pilihan Utama)
    installer: {
      filename: "BelOtomatisSekolah_Setup_v1.2.2.exe",
      size: "45.63 MB",
      sha256: "c1a6275c94533f54b8fca069de453a34b2c10a3aedb8f63450acbeda4dc72ae0",
      downloadUrl:
        "https://github.com/EkoSartika/kronabel/releases/download/v1.2.2/BelOtomatisSekolah_Setup_v1.2.2.exe",
    },

    // Paket Portable ZIP (Tanpa Instalasi)
    portable: {
      filename: "BelOtomatisSekolah_Portable_v1.2.2.zip",
      size: "79.80 MB",
      sha256: "a8f693c6ab2dd5c28a55c05231758be749050b2aae9c8ccd221761868d0f8004",
      downloadUrl:
        "https://github.com/EkoSartika/kronabel/releases/download/v1.2.2/BelOtomatisSekolah_Portable_v1.2.2.zip",
    },
  },

  // Navigasi Utama Header
  navLinks: [
    { name: "Beranda", href: "/" },
    { name: "Panduan", href: "/panduan" },
    { name: "Riwayat Versi", href: "/riwayat-versi" },
    { name: "Tentang", href: "/tentang" },
    { name: "Unduh", href: "/unduh" },
  ],

  // Navigasi Footer
  footerNavLinks: [
    { name: "Beranda", href: "/" },
    { name: "Panduan Penggunaan", href: "/panduan" },
    { name: "Riwayat Versi (Changelog)", href: "/riwayat-versi" },
    { name: "Tentang KRONABEL", href: "/tentang" },
    { name: "Saran & Masukan", href: "/masukan" },
    { name: "Kebijakan Privasi", href: "/privasi" },
    { name: "Pusat Unduhan", href: "/unduh" },
  ],
};

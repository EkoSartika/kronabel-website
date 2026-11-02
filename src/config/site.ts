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
    latestVersion: "1.2.4",
    releaseDate: "2 November 2026",
    framework: "Python 3.11.9 + PySide6 (Qt 6.12 Native)",
    architecture: "Windows x64 (64-bit)",
    githubReleaseUrl: "https://github.com/EkoSartika/kronabel/releases/tag/v1.2.4",
    repositoryUrl: "https://github.com/EkoSartika/kronabel",

    // Paket Installer Windows (Pilihan Utama)
    installer: {
      filename: "KRONABEL_Setup_v1.2.4.exe",
      size: "45.63 MB",
      sha256: "38e91e93aef130fcff2bcf589379b92ab15e600d5694b2a14eebdac322b9abdf",
      downloadUrl:
        "https://github.com/EkoSartika/kronabel/releases/download/v1.2.4/KRONABEL_Setup_v1.2.4.exe",
    },

    // Paket Portable ZIP (Tanpa Instalasi)
    portable: {
      filename: "KRONABEL_Portable_v1.2.4.zip",
      size: "79.80 MB",
      sha256: "7772a0c022dc0b4bd7626aef87e047739502450ea05e8c5ba6ae477fbb041a7c",
      downloadUrl:
        "https://github.com/EkoSartika/kronabel/releases/download/v1.2.4/KRONABEL_Portable_v1.2.4.zip",
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

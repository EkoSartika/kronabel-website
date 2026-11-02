/**
 * Konfigurasi Terpusat Website Resmi KRONABEL
 * Memudahkan perubahan nama merek, versi rilis, URL unduhan, dan tautan dukungan.
 */

export const SITE_CONFIG = {
  appName: "Kronabel",
  brandName: "KRONABEL",
  brandSubtitle: "Aplikasi Bel Sekolah Otomatis",
  siteUrl: "https://kronabel.vercel.app",
  tagline: "Bel Otomatis, Waktu Lebih Teratur.",
  description:
    "Kelola jadwal bel sekolah secara praktis melalui aplikasi Windows yang mudah digunakan. Gratis, tanpa biaya langganan, dan bekerja 100% offline.",
  targetOS: "Windows 10 & Windows 11 (64-bit)",
  author: "Pengembang Kronabel",

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
      size: "45.64 MB",
      sha256: "d0357d41e21ba1d8b862bce1e539962d051274ecde6b5535fd5e436021f163ab",
      downloadUrl:
        "https://github.com/EkoSartika/kronabel/releases/download/v1.2.4/KRONABEL_Setup_v1.2.4.exe",
    },

    // Paket Portable ZIP (Tanpa Instalasi)
    portable: {
      filename: "KRONABEL_Portable_v1.2.4.zip",
      size: "79.80 MB",
      sha256: "82a82b4c6dbd282d382319e973de5c9bd0461a6d8ab7c4aba1eaea7fba6b7761",
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

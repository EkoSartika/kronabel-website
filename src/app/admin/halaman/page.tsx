import Link from "next/link";

interface PageMeta {
  title: string;
  slug: string;
  tabKey: string;
  route: string;
  description: string;
  type: "Utama" | "Dokumentasi" | "Interaksi" | "Informasi";
  status: "Aktif (CMS Terintegrasi)";
}

const PAGES: PageMeta[] = [
  {
    title: "Beranda (Hero, Fitur, Keunggulan)",
    slug: "home",
    tabKey: "home",
    route: "/",
    description: "Halaman muka KRONABEL: hero headline, banner rilis, kartu keunggulan, panel ringkas aplikasi, dan CTA.",
    type: "Utama",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Panduan Penggunaan",
    slug: "panduan",
    tabKey: "panduan",
    route: "/panduan",
    description: "Dokumentasi interaktif 8 modul teknis: instalasi, jadwal, audio, multi-profil, stop/interupsi, backup, dan solusi masalah.",
    type: "Dokumentasi",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Riwayat Versi (Changelog)",
    slug: "riwayat-versi",
    tabKey: "riwayat",
    route: "/riwayat-versi",
    description: "Catatan rilis dari v1.0.0 hingga v1.2.2, mencatat fitur baru, peningkatan performa, dan perbaikan bug.",
    type: "Dokumentasi",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Tentang KRONABEL",
    slug: "tentang",
    tabKey: "tentang",
    route: "/tentang",
    description: "Profil perangkat lunak bel sekolah, filosofi open value, arsitektur offline, dan visi kemandirian sekolah.",
    type: "Informasi",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Pusat Unduhan (Download)",
    slug: "unduh",
    tabKey: "unduh",
    route: "/unduh",
    description: "Paket Installer Windows, Portable zip, checksum integritas SHA-256, panduan SmartScreen, dan spesifikasi.",
    type: "Utama",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Dukungan Pengembang",
    slug: "dukungan",
    tabKey: "dukungan",
    route: "/dukungan",
    description: "Kanal apresiasi sukarela pengembangan KRONABEL melalui Saweria, tanpa iklan dan tanpa batasan fitur.",
    type: "Interaksi",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Saran & Masukan Publik",
    slug: "masukan",
    tabKey: "footer",
    route: "/masukan",
    description: "Formulir publik interaktif untuk kritik, saran, laporan bug teknis, dan permintaan fitur dari sekolah.",
    type: "Interaksi",
    status: "Aktif (CMS Terintegrasi)",
  },
  {
    title: "Kebijakan Privasi",
    slug: "privasi",
    tabKey: "footer",
    route: "/privasi",
    description: "Pernyataan privasi nol-telemetri, jaminan keamanan data database SQLite lokal, dan offline-first policy.",
    type: "Informasi",
    status: "Aktif (CMS Terintegrasi)",
  },
];

export default function AdminPagesOverview() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengelolaan Halaman Website</h1>
            <p className="text-sm text-slate-500 mt-1">
              Daftar seluruh halaman publik KRONABEL dengan status integrasi CMS dan akses cepat editor konten.
            </p>
          </div>
          <Link
            href="/admin/konten"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Buka Editor Konten
          </Link>
        </div>

        {/* Info banner */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-950 text-xs sm:text-sm flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-semibold">Sistem Multi-Layer CMS:</span> Konten setiap halaman tersinkronisasi otomatis dengan Supabase saat database terhubung. Bila koneksi Supabase belum aktif atau sedang offline, seluruh halaman tetap berfungsi optimal menggunakan konfigurasi bawaan (graceful fallback).
          </div>
        </div>

        {/* Table / Cards List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Halaman & Rute</div>
            <div className="col-span-4">Deskripsi Fungsional</div>
            <div className="col-span-2">Tipe & Status</div>
            <div className="col-span-2 text-right">Aksi Cepat</div>
          </div>

          <div className="divide-y divide-slate-100">
            {PAGES.map((page) => (
              <div key={page.slug} className="p-5 lg:px-6 lg:py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition">
                {/* Title & Route */}
                <div className="lg:col-span-4 space-y-1">
                  <div className="font-semibold text-slate-900 text-sm">{page.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {page.route}
                    </span>
                    <a
                      href={page.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                    >
                      Buka Tab Baru
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-4 text-xs text-slate-600 line-clamp-2">
                  {page.description}
                </div>

                {/* Type & Status */}
                <div className="lg:col-span-2 flex flex-wrap lg:flex-col gap-2 items-start">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                    {page.type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    {page.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex items-center justify-start lg:justify-end gap-2 pt-2 lg:pt-0">
                  <Link
                    href={`/admin/konten?tab=${page.tabKey}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition border border-emerald-200/60"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit CMS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}


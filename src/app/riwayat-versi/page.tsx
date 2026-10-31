import type { Metadata } from "next";
import Link from "next/link";
import { History, Tag, CheckCircle2, ShieldCheck, Download, Sparkles, AlertCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `Riwayat Versi & Catatan Rilis - ${SITE_CONFIG.brandName}`,
  description: `Catatan rilis lengkap dan riwayat pembaruan aplikasi ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}) mulai dari v1.2.0 hingga rilis terbaru v1.2.2.`,
  alternates: {
    canonical: "/riwayat-versi",
  },
  openGraph: {
    title: `Riwayat Versi & Catatan Rilis - ${SITE_CONFIG.brandName}`,
    description: `Catatan rilis lengkap dan riwayat pembaruan aplikasi ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}).`,
    url: "/riwayat-versi",
  },
};

export default function ChangelogPage() {
  const versions = [
    {
      version: "1.2.2",
      date: "29 Oktober 2026",
      badge: "Rilis Terbaru (Stabil)",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      isLatest: true,
      title: "Penyempurnaan Operasional & Notifikasi Jadwal Terlewat",
      summary:
        "Rilis pemeliharaan dan stabilitas yang memperkuat mekanisme notifikasi jadwal otomatis yang terlewat (missed), sinkronisasi status pemutaran audio, serta pembersihan tata letak visual antarmuka.",
      changes: [
        {
          category: "Penyempurnaan Audio & Scheduler",
          items: [
            "Pencatatan status 'missed' yang konsisten saat jadwal otomatis tiba bersamaan dengan bel manual yang sedang dibunyikan operator.",
            "Sinkronisasi status pemutar audio terpusat (single active audio controller) guna memastikan tidak ada audio hantu yang tertinggal di memori.",
            "Proteksi timer scheduler agar tetap aktif dan menghitung mundur tepat waktu setelah interupsi manual, pemencetan tombol Stop, maupun saat selesai pemutaran audio.",
          ],
        },
        {
          category: "Pembaruan Antarmuka & Visual",
          items: [
            "Penghapusan aset gambar latar transparan di sebelah kiri judul aplikasi yang menimpa jam digital pada resolusi tertentu.",
            "Penataan ulang proporsi judul header utama agar selaras dengan kotak jam digital dan tabel jadwal.",
            "Peningkatan kontras teks pada tombol bel manual (BEL A – BEL N dan TES 1 – TES 5).",
          ],
        },
        {
          category: "Integritas & Distribusi",
          items: [
            "Paket Setup Installer v1.2.2 (45.63 MB, SHA-256 terverifikasi).",
            "Paket Portable ZIP v1.2.2 (79.80 MB, SHA-256 terverifikasi).",
            "Verifikasi kompatibilitas penuh pada Windows 10 dan Windows 11 edisi 64-bit.",
          ],
        },
      ],
    },
    {
      version: "1.2.1",
      date: "29 Oktober 2026",
      badge: "Rilis Fitur",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      isLatest: false,
      title: "Sistem Interupsi dan Prioritas Audio Bel Terpusat",
      summary:
        "Implementasi arsitektur Single Active Audio Controller yang memungkinkan tombol bel manual saling menginterupsi audio sebelumnya secara instan dan tanpa jeda.",
      changes: [
        {
          category: "Fitur Baru",
          items: [
            "Sistem interupsi audio cerdas: memencet tombol bel manual lain seketika menghentikan audio yang sedang diputar dan langsung membunyikan audio yang baru dipilih.",
            "Aturan prioritas: maksimal satu audio bel aktif pada satu waktu, menghilangkan gangguan suara bertumpuk (overlapping audio).",
            "Integrasi tombol Stop darurat yang menghentikan audio tanpa mengganggu siklus penjadwal otomatis di latar belakang.",
            "Scheduler OFF tetap mengizinkan operator menekan tombol bel manual secara bebas.",
          ],
        },
        {
          category: "Stabilitas",
          items: [
            "Pencegahan kondisi race condition saat dua tombol ditekan secara cepat berturut-turut.",
            "Penguncian status UI yang responsif saat media player sedang menginisialisasi berkas audio.",
          ],
        },
      ],
    },
    {
      version: "1.2.0",
      date: "29 Oktober 2026",
      badge: "Fondasi Modern",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      isLatest: false,
      title: "Penyelarasan Modern Windows 10 / Windows 11 (64-bit)",
      summary:
        "Penyegaran arsitektur inti aplikasi untuk berfokus penuh pada Windows 10 dan Windows 11 64-bit menggunakan Python 3.11 dan PySide6 modern.",
      changes: [
        {
          category: "Pembaruan Arsitektur",
          items: [
            "Peralihan menyeluruh ke stack modern Python 3.11.9 dan PySide6 (Qt 6.12 native).",
            "Pembersihan modul compatibility legacy yang berpotensi menimbulkan inkonsistensi loader DLL.",
            "Peningkatan efisiensi memori RAM standby menjadi ~60 MB.",
          ],
        },
        {
          category: "Sistem Distribusi",
          items: [
            "Pembangunan skrip otomatisasi build_release.py untuk menghasilkan Setup Inno Installer dan Portable ZIP secara serentak.",
            "Pencatatan checksum hash SHA-256 otomatis pada setiap proses rilis untuk menjamin transparansi integritas berkas.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Versi {SITE_CONFIG.brandName}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Transparansi setiap pembaruan kode, fitur baru, dan perbaikan kestabilan aplikasi Bel Sekolah Otomatis.
          </p>
        </div>

        {/* Timeline List */}
        <div className="space-y-10">
          {versions.map((ver, idx) => (
            <div
              key={ver.version}
              className={`relative bg-white rounded-3xl p-7 sm:p-9 shadow-sm border ${
                ver.isLatest ? "border-emerald-700 shadow-md ring-1 ring-emerald-700/20" : "border-slate-200"
              }`}
            >
              {/* Header Card */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 min-w-[4.75rem] px-3.5 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold font-mono text-sm tracking-wide whitespace-nowrap shadow-inner shrink-0">
                    v{ver.version}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{ver.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Dirilis pada {ver.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${ver.badgeColor}`}
                  >
                    {ver.isLatest && <Sparkles className="w-3.5 h-3.5 text-emerald-700" />}
                    {ver.badge}
                  </span>
                  {ver.isLatest && (
                    <Link
                      href="/unduh"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh v{ver.version}
                    </Link>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                &ldquo;{ver.summary}&rdquo;
              </p>

              {/* Changes Sections */}
              <div className="space-y-6">
                {ver.changes.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {group.category}
                    </h3>
                    <ul className="space-y-2">
                      {group.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto">
          <p>
            Seluruh berkas biner dan hash SHA-256 diverifikasi menggunakan skrip build release otomatis internal. Memastikan keamanan integritas 100% bebas dari berkas asing.
          </p>
        </div>
      </div>
    </div>
  );
}


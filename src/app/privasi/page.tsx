import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, HardDrive, Globe, Download, Heart, Lock, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `Kebijakan Privasi — ${SITE_CONFIG.brandName} Bel Sekolah Offline`,
  description: `Kebijakan privasi resmi ${SITE_CONFIG.brandName}. Jaminan 100% offline, bebas telemetri, tanpa pelacakan data, dan keamanan database jadwal sekolah lokal.`,
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/privasi`,
  },
  openGraph: {
    title: `Kebijakan Privasi — ${SITE_CONFIG.brandName} Bel Sekolah Offline`,
    description: `Kebijakan privasi resmi ${SITE_CONFIG.brandName}. Jaminan 100% offline tanpa telemetri untuk seluruh sekolah.`,
    url: `${SITE_CONFIG.siteUrl}/privasi`,
    images: [
      {
        url: "/images/screenshot_real_compact.png",
        width: 1280,
        height: 720,
        alt: `Kebijakan Privasi ${SITE_CONFIG.brandName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Kebijakan Privasi — ${SITE_CONFIG.brandName}`,
    description: `Prinsip privasi 100% offline-first aplikasi bel sekolah otomatis Windows KRONABEL.`,
    images: ["/images/screenshot_real_compact.png"],
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <Lock className="w-4 h-4 text-emerald-700" />
            Transparansi Privasi
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Komitmen transparansi kami dalam melindungi keamanan dan privasi data pengguna aplikasi dan pengunjung situs web.
          </p>
          <p className="mt-2 text-xs text-slate-400">Pembaruan Terakhir: 29 Oktober 2026</p>
        </div>

        {/* Overview Box */}
        <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 mb-10">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-emerald-950">Prinsip Privasi Utama KRONABEL</h2>
              <p className="text-xs sm:text-sm text-emerald-900/90 mt-1 leading-relaxed">
                Aplikasi desktop KRONABEL dirancang dengan filosofi <strong>100% Offline-First</strong>. Kami tidak mengumpulkan, tidak menjual, dan tidak mentransmisikan data kegiatan belajar mengajar atau jadwal sekolah Anda ke internet.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Bagian 1: Data Aplikasi Desktop */}
          <section className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Data Aplikasi Desktop (Komputer Lokal)</h3>
            </div>
            <p>
              Seluruh data operasional aplikasi desktop dikelola sepenuhnya di dalam komputer lokal tempat aplikasi dipasang:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-1 text-xs sm:text-sm">
              <li>
                <strong>Basis Data Jadwal & Profil:</strong> Seluruh konfigurasi waktu bel, nama profil, keterangan jadwal, dan log pemutaran disimpan secara lokal dalam berkas SQLite (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">bel_sekolah.db</code>).
              </li>
              <li>
                <strong>Berkas Audio Bel:</strong> Rekaman suara dan berkas MP3/WAV tersimpan di folder pustaka audio komputer pengguna.
              </li>
              <li>
                <strong>Tanpa Telemetri & Pelacak:</strong> Aplikasi desktop tidak dilengkapi kode analitik, pelacak perilaku, maupun modul telemetri rahasia.
              </li>
              <li>
                <strong>Tanpa Akses Internet:</strong> Aplikasi desktop tidak memerlukan koneksi internet untuk memicu bel terjadwal maupun memutar audio manual.
              </li>
            </ul>
          </section>

          {/* Bagian 2: Data Pengunjung Website */}
          <section className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Data Pengunjung Website Resmi</h3>
            </div>
            <p>
              Ketika Anda mengakses situs web dokumentasi resmi KRONABEL:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-1 text-xs sm:text-sm">
              <li>
                <strong>Hosting Vercel:</strong> Situs web ini di-hosting pada platform cloud Vercel Inc. Server dan jaringan distribusi konten (CDN) Vercel dapat mencatat log teknis standar peramban (seperti alamat IP publik, jenis peramban, sistem operasi, stempel waktu, dan URL halaman yang diakses) semata-mata untuk keperluan keamanan infrastruktur, pencegahan serangan siber (DDoS), dan keandalan sistem.
              </li>
              <li>
                <strong>Tanpa Cookie Pelacak Iklan:</strong> Website ini tidak menyematkan cookie pelacak periklanan pihak ketiga (*third-party advertising cookies*) atau skrip pelacakan profil komersial.
              </li>
            </ul>
          </section>

          {/* Bagian 3: Unduhan & Distribusi Berkas */}
          <section className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Distribusi Unduhan Berkas (GitHub Releases)</h3>
            </div>
            <p>
              Paket instalasi (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">.exe</code>) dan berkas portable (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">.zip</code>) didistribusikan melalui infrastruktur <strong>GitHub Releases</strong> milik GitHub Inc. (Microsoft). Proses unduhan berkas tunduk pada ketentuan layanan dan kebijakan privasi GitHub. Kami menyediakan nilai checksum SHA-256 yang transparan agar pengguna dapat memverifikasi keaslian berkas secara mandiri sebelum dijalankan.
            </p>
          </section>

          {/* Bagian 4: Donasi Sukarela */}
          <section className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. Transaksi Donasi Sukarela (Saweria)</h3>
            </div>
            <p>
              Apabila pengguna secara sukarela memberikan donasi melalui saluran Saweria:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-1 text-xs sm:text-sm">
              <li>
                Transaksi pembayaran diproses sepenuhnya oleh platform <strong>Saweria</strong> dan gerbang pembayaran mitra terkait (seperti QRIS, GoPay, OVO, DANA, dan bank nasional).
              </li>
              <li>
                Pengembang KRONABEL <strong>tidak pernah</strong> memiliki akses, menyimpan, maupun memproses nomor rekening bank, kartu kredit/debit, atau data otentikasi rahasia milik donatur.
              </li>
            </ul>
          </section>

          {/* Bagian 5: Pertanyaan & Kontak */}
          <section className="bg-slate-50 rounded-3xl p-7 sm:p-9 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-slate-900">Pertanyaan Terkait Kebijakan Privasi</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jika Anda memiliki pertanyaan teknis seputar privasi atau arsitektur penyimpanan lokal aplikasi KRONABEL, Anda dapat membaca dokumentasi lengkap pada halaman <Link href="/panduan" className="text-emerald-800 font-semibold underline">Panduan Penggunaan</Link> atau mengunjungi halaman repositori resmi proyek.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


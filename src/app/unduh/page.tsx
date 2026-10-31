import type { Metadata } from "next";
import Link from "next/link";
import { Download, ShieldCheck, CheckCircle2, AlertTriangle, FileArchive, Laptop, HelpCircle, HardDrive, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { CopyHashButton, PowerShellVerifyBox } from "@/components/DownloadHelper";

export const metadata: Metadata = {
  title: `Unduh Aplikasi Resmi - ${SITE_CONFIG.brandName}`,
  description: `Unduh ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}) versi ${SITE_CONFIG.release.latestVersion} untuk Windows 10 & Windows 11 64-bit. Tersedia paket Installer Setup dan Portable ZIP.`,
  alternates: {
    canonical: "/unduh",
  },
  openGraph: {
    title: `Unduh Aplikasi Resmi - ${SITE_CONFIG.brandName}`,
    description: `Unduh ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}) versi ${SITE_CONFIG.release.latestVersion} untuk Windows 10 & Windows 11 64-bit.`,
    url: "/unduh",
  },
};

export default function DownloadPage() {
  const { release } = SITE_CONFIG;

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Unduh {SITE_CONFIG.brandName} <span className="text-emerald-800">v{release.latestVersion}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Gratis tanpa batasan durasi, tanpa iklan terselubung, dan berjalan langsung secara lokal (offline) di komputer Windows sekolah Anda.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-500 font-medium">
            <span>Rilis: {release.releaseDate}</span>
            <span>•</span>
            <span>{release.architecture}</span>
            <span>•</span>
            <span>{release.framework}</span>
          </div>
        </div>

        {/* Tautan Menuju GitHub Release Resmi */}
        <div className="mb-10 max-w-4xl mx-auto rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Distribusi Resmi via GitHub Releases
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                KRONABEL v{release.latestVersion} ({SITE_CONFIG.targetOS}) dengan verifikasi hash SHA-256 mandiri.
              </p>
            </div>
          </div>
          <a
            href={release.githubReleaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-100/60 transition-colors shadow-sm"
          >
            <span>Buka Halaman GitHub Release</span>
            <ExternalLink className="w-4 h-4 text-emerald-700" />
          </a>
        </div>

        {/* 2 Opsi Unduhan: Installer & Portable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Installer Setup */}
          <div className="relative bg-white rounded-3xl p-7 sm:p-9 shadow-xl border-2 border-emerald-800/80 flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="absolute -top-3.5 left-8 bg-emerald-800 text-amber-300 px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
              Direkomendasikan untuk Sekolah
            </div>

            <div>
              <div className="flex items-start justify-between mb-4 mt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Laptop className="w-6 h-6 text-emerald-800" />
                    <h2 className="text-2xl font-bold text-slate-900">Windows Installer</h2>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Paket instalasi lengkap berformat .exe</p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {release.installer.size}
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Pilihan tepat untuk instalasi permanen di komputer piket atau kantor. Dilengkapi wizard instalasi Inno Setup, pintasan Desktop, menu Start, dan uninstaller otomatis.
              </p>

              <div className="space-y-3 mb-6 text-sm text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ikon desktop dan menu Start otomatis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mendukung mode Autostart saat Windows menyala</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Database jadwal & audio tersimpan rapi di direktori aplikasi</span>
                </div>
              </div>

              {/* Hash Info */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">Nama Berkas:</span>
                  <span className="text-xs font-mono text-slate-800 font-medium truncate max-w-[200px]">
                    {release.installer.filename}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">SHA-256 (Laporan Rilis):</span>
                  <CopyHashButton hash={release.installer.sha256} />
                </div>
                <p className="text-[11px] font-mono text-slate-500 break-all mt-1 bg-white p-1.5 rounded border border-slate-200 select-all">
                  {release.installer.sha256}
                </p>
                <p className="mt-1.5 text-[10px] text-slate-500 italic">
                  * Ukuran dan nilai hash bersumber dari Laporan Rilis Resmi v1.2.2 (terverifikasi 100% cocok dengan berkas rilis fisik).
                </p>
              </div>
            </div>

            <div>
              {release.installer.downloadUrl ? (
                <>
                  <a
                    href={release.installer.downloadUrl}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.01]"
                  >
                    <Download className="w-5 h-5" />
                    Unduh Setup Installer ({release.installer.size})
                  </a>
                  <p className="mt-2.5 text-center text-xs text-slate-500 font-medium">
                    Pilihan Utama &bull; Versi v{release.latestVersion} ({release.installer.size}) &bull; Windows 10 & 11 (64-bit)
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 border border-slate-300 cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    Unduhan Online Belum Tersedia
                  </button>
                  <p className="text-xs text-center text-slate-500 leading-relaxed">
                    Tautan cloud publik belum dikonfigurasi. Untuk pengujian lokal, gunakan berkas biner yang telah dibuild: <br />
                    <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">
                      release\{release.installer.filename}
                    </code>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Portable ZIP */}
          <div className="relative bg-white rounded-3xl p-7 sm:p-9 shadow-lg border border-slate-200 flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="absolute -top-3.5 left-8 bg-slate-700 text-slate-200 px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
              Tanpa Perlu Instalasi
            </div>

            <div>
              <div className="flex items-start justify-between mb-4 mt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <FileArchive className="w-6 h-6 text-slate-700" />
                    <h2 className="text-2xl font-bold text-slate-900">Windows Portable</h2>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Paket mandiri berformat .zip</p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {release.portable.size}
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Cocok untuk penggunaan dari USB flashdisk atau komputer sekolah yang memiliki batasan hak akses administrator (UAC). Cukup ekstrak berkas ZIP dan langsung jalankan aplikasinya.
              </p>

              <div className="space-y-3 mb-6 text-sm text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tidak memodifikasi Windows Registry sistem</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dapat dibawa & dipindahkan bebas dalam flashdisk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Database dan audio selalu terbawa bersama folder aplikasi</span>
                </div>
              </div>

              {/* Hash Info */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">Nama Berkas:</span>
                  <span className="text-xs font-mono text-slate-800 font-medium truncate max-w-[200px]">
                    {release.portable.filename}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">SHA-256 (Laporan Rilis):</span>
                  <CopyHashButton hash={release.portable.sha256} />
                </div>
                <p className="text-[11px] font-mono text-slate-500 break-all mt-1 bg-white p-1.5 rounded border border-slate-200 select-all">
                  {release.portable.sha256}
                </p>
                <p className="mt-1.5 text-[10px] text-slate-500 italic">
                  * Ukuran dan nilai hash bersumber dari Laporan Rilis Resmi v1.2.2 (terverifikasi 100% cocok dengan berkas rilis fisik).
                </p>
              </div>
            </div>

            <div>
              {release.portable.downloadUrl ? (
                <>
                  <a
                    href={release.portable.downloadUrl}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all hover:scale-[1.01]"
                  >
                    <Download className="w-5 h-5" />
                    Unduh Portable ZIP ({release.portable.size})
                  </a>
                  <p className="mt-2.5 text-center text-xs text-slate-500 font-medium">
                    Pilihan Alternatif &bull; Versi v{release.latestVersion} ({release.portable.size}) &bull; Windows 10 & 11 (64-bit)
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 border border-slate-300 cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                    Unduhan Online Belum Tersedia
                  </button>
                  <p className="text-xs text-center text-slate-500 leading-relaxed">
                    Tautan cloud publik belum dikonfigurasi. Untuk pengujian lokal, gunakan berkas biner yang telah dibuild: <br />
                    <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">
                      release\{release.portable.filename}
                    </code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verifikasi SHA-256 & SmartScreen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Card: Verifikasi Hash */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verifikasi Integritas SHA-256</h3>
                <p className="text-xs text-slate-500">Memastikan berkas yang diunduh 100% otentik dan bebas modifikasi</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Anda dapat memeriksa keaslian file hasil unduhan melalui Windows PowerShell bawaan. Buka PowerShell di folder unduhan Anda dan jalankan perintah berikut:
            </p>
            <PowerShellVerifyBox
              filename={release.installer.filename}
              hash={release.installer.sha256}
            />
          </div>

          {/* Card: Informasi Windows SmartScreen */}
          <div className="bg-amber-50/70 rounded-3xl p-7 sm:p-8 border border-amber-200/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center text-amber-900">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-950">Pemberitahuan Windows SmartScreen</h3>
                <p className="text-xs text-amber-800/80">Panduan jika muncul layar biru pelindung Windows</p>
              </div>
            </div>
            <p className="text-sm text-amber-900/90 leading-relaxed mb-4">
              Ketika Anda pertama kali menjalankan file installer pada komputer Windows 10/11, sistem pelindung <strong>Windows Defender SmartScreen</strong> mungkin menampilkan jendela biru bertuliskan <em>&ldquo;Windows protected your PC&rdquo;</em>.
            </p>
            <div className="bg-white/80 rounded-2xl p-4 border border-amber-300/60 text-xs sm:text-sm text-slate-700 space-y-2 mb-4">
              <p className="font-semibold text-slate-900">Langkah untuk melanjutkan instalasi:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Klik teks tautan bertuliskan <strong>&ldquo;More info&rdquo;</strong> (Informasi selengkapnya).</li>
                <li>Klik tombol <strong>&ldquo;Run anyway&rdquo;</strong> (Tetap jalankan).</li>
                <li>Aplikasi akan langsung terpasang dan berjalan secara normal.</li>
              </ol>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Mengapa ini terjadi?</strong> KRONABEL adalah proyek independen dan gratis. Sertifikat digital komersial EV (Extended Validation) dari otoritas sertifikasi berbayar puluhan juta rupiah per tahun, sehingga kami memilih mendistribusikannya secara mandiri dengan hash checksum SHA-256 yang transparan untuk membuktikan keaslian dan keamanan berkas.
            </p>
          </div>
        </div>

        {/* Persyaratan Sistem Lengkap */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 mb-16">
          <div className="max-w-2xl mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Spesifikasi Komputer yang Dibutuhkan</h3>
            <p className="text-sm text-slate-500 mt-1">
              Dirancang sangat ringan agar dapat berjalan lancar di komputer sekolah dengan spesifikasi standar sekalipun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Sistem Operasi</span>
              <p className="text-base font-bold text-slate-900">Windows 10 / 11</p>
              <p className="text-xs text-slate-600 mt-1">Edisi 64-bit (x64 Architecture). Pembaruan resmi Microsoft.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Memori RAM</span>
              <p className="text-base font-bold text-slate-900">2 GB (Min) / 4 GB+</p>
              <p className="text-xs text-slate-600 mt-1">Penggunaan RAM aplikasi hanya berkisar ~60 MB saat standby.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Penyimpanan Hard Disk</span>
              <p className="text-base font-bold text-slate-900">150 MB Ruang Bebas</p>
              <p className="text-xs text-slate-600 mt-1">Termasuk seluruh pustaka audio default bel dan database SQLite.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Keluaran Suara</span>
              <p className="text-base font-bold text-slate-900">Sound Card & Speaker</p>
              <p className="text-xs text-slate-600 mt-1">Terhubung ke sistem audio/amplifier/pengeras suara sekolah.</p>
            </div>
          </div>
        </div>

        {/* Butuh bantuan lebih lanjut? */}
        <div className="bg-emerald-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Butuh panduan langkah demi langkah?</h3>
            <p className="text-emerald-200/90 text-sm mt-2 leading-relaxed">
              Pelajari cara mengatur jam pelajaran, menambahkan jadwal kustom, memasukkan audio bel baru, serta mengelola backup database di halaman panduan lengkap kami.
            </p>
          </div>
          <Link
            href="/panduan"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
          >
            <HelpCircle className="w-5 h-5 text-slate-900" />
            Buka Panduan Penggunaan
          </Link>
        </div>
      </div>
    </div>
  );
}


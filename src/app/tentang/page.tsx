import Link from "next/link";
import { Info, ShieldCheck, Heart, Laptop, Compass, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata = {
  title: `Tentang Kami - ${SITE_CONFIG.brandName}`,
  description: `Mengenal ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}), latar belakang pengembangan, filosofi gratis mandiri, dan transparansi merek.`,
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <Info className="w-4 h-4 text-emerald-700" />
            Tentang Proyek
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Mengenal <span className="text-emerald-800">{SITE_CONFIG.brandName}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Inisiatif perangkat lunak bel sekolah otomatis yang handal, elegan, dan didedikasikan sepenuhnya untuk pendidikan di Indonesia.
          </p>
        </div>

        {/* Card 1: Latar Belakang & Visi */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Latar Belakang & Tujuan</h2>
              <p className="text-xs text-slate-500">Menghadirkan ketertiban waktu belajar tanpa biaya tinggi</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Ketepatan pergantian jam pelajaran merupakan salah satu fondasi disiplin di lingkungan sekolah. Namun, banyak sekolah masih bergantung pada pemukulan bel manual oleh petugas piket yang rentan terlambat, atau terbebani oleh perangkat bel digital impor berbiaya jutaan rupiah yang sulit diatur jadwalnya.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            <strong>{SITE_CONFIG.brandName}</strong> hadir sebagai solusi perangkat lunak Windows yang dapat dipasang langsung pada komputer ruang guru atau ruang piket. Dengan menghubungkan output audio komputer ke amplifier pengeras suara sekolah, seluruh jadwal bel berbunyi secara presisi, teratur, dan otomatis setiap hari.
          </p>
        </div>

        {/* Card 2: Tiga Pilar Pengembangan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% Offline Lokal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tidak membutuhkan koneksi internet saat bertugas. Basis data dan berkas suara tersimpan aman di hard disk komputer sekolah.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Gratis Tanpa Lisensi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bebas digunakan tanpa biaya registrasi, tanpa kunci serial (product key), dan tanpa batas waktu kedaluwarsa.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Dukungan Sukarela</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Keberlanjutan proyek didukung melalui donasi sukarela komunitas pendidikan yang merasa terbantu oleh aplikasi ini.
            </p>
          </div>
        </div>

        {/* Card 3: Status Identitas Merek */}
        <div className="bg-amber-50/70 rounded-3xl p-7 sm:p-9 border border-amber-200/80 mb-8 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Pemberitahuan Status Merek Dagang</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
            Nama <strong>{SITE_CONFIG.brandName}</strong> saat ini merupakan <em>kandidat nama merek sementara</em> yang digunakan dalam tahap publikasi awal aplikasi Bel Sekolah Otomatis. Kami tidak mengklaim hak cipta terdaftar atau perlindungan merek komersial sebelum seluruh verifikasi ketersediaan dan ketentuan hukum selesai.
          </p>
          <p className="text-xs text-amber-900/80 leading-relaxed italic">
            * Struktur kode dan konfigurasi website dirancang fleksibel sehingga identitas nama dapat diselaraskan apabila terjadi penyesuaian merek di masa mendatang.
          </p>
        </div>

        {/* CTA Bawah */}
        <div className="bg-emerald-950 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Siap Mencoba KRONABEL di Sekolah Anda?</h3>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl mx-auto leading-relaxed">
            Unduh aplikasinya secara cuma-cuma dan ikuti petunjuk konfigurasi jadwal langkah demi langkah.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/unduh"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-colors shadow"
            >
              <span>Halaman Unduhan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/panduan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-900 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors border border-emerald-800"
            >
              Pelajari Panduan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


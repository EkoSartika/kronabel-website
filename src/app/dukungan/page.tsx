import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Coffee, CheckCircle2, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { getPageContent } from "@/lib/supabase/content";

export const metadata: Metadata = {
  title: `Dukungan Pengembang - ${SITE_CONFIG.brandName}`,
  description: `Dukung pengembangan mandiri ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}). Aplikasi bel sekolah 100% gratis tanpa biaya lisensi maupun langganan.`,
  alternates: {
    canonical: "/dukungan",
  },
  openGraph: {
    title: `Dukungan Pengembang - ${SITE_CONFIG.brandName}`,
    description: `Dukung pengembangan mandiri ${SITE_CONFIG.brandName} (${SITE_CONFIG.brandSubtitle}).`,
    url: "/dukungan",
  },
};

export default async function DonationPage() {
  const { donation } = SITE_CONFIG;

  const support = await getPageContent("support.intro", {
    badge: "Dukungan Pengembang",
    title: `Dukung Pengembangan ${SITE_CONFIG.brandName}`,
    subtitle: "KRONABEL didedikasikan 100% gratis untuk seluruh satuan pendidikan di Indonesia tanpa batasan waktu dan tanpa biaya tersembunyi.",
    cardTitle: "Traktir Kopi untuk Pengembang",
    cardDescription: `Jika ${SITE_CONFIG.brandName} terbukti membantu ketertiban waktu belajar di sekolah Anda, meringankan tugas bapak/ibu guru piket, dan menghemat anggaran sekolah, Anda dapat menyisihkan donasi sukarela melalui platform Saweria.`,
    buttonText: "Dukung KRONABEL",
    disclaimer: "Dukungan ini bersifat sukarela untuk mendukung keberlanjutan pengembangan. Aplikasi KRONABEL tetap 100% gratis digunakan untuk seluruh sekolah di Indonesia.",
  });

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200">
            <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
            {support.badge || "Dukungan Pengembang"}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {support.title || `Dukung Pengembangan ${SITE_CONFIG.brandName}`}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {support.subtitle || "KRONABEL didedikasikan 100% gratis untuk seluruh satuan pendidikan di Indonesia tanpa batasan waktu dan tanpa biaya tersembunyi."}
          </p>
        </div>

        {/* Main Donation Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto text-amber-700 shadow-sm">
              <Coffee className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {support.cardTitle || "Traktir Kopi untuk Pengembang"}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {support.cardDescription || `Jika ${SITE_CONFIG.brandName} terbukti membantu ketertiban waktu belajar di sekolah Anda, meringankan tugas bapak/ibu guru piket, dan menghemat anggaran sekolah, Anda dapat menyisihkan donasi sukarela melalui platform Saweria.`}
            </p>

            {/* Saweria Action Button */}
            <div className="pt-2 max-w-md mx-auto space-y-3">
              <a
                href={donation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.02]"
              >
                <Heart className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>{support.buttonText || "Dukung KRONABEL"}</span>
                <ArrowUpRight className="w-5 h-5 text-slate-950" />
              </a>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {support.disclaimer || "Dukungan ini bersifat sukarela untuk mendukung keberlanjutan pengembangan. Aplikasi KRONABEL tetap 100% gratis digunakan untuk seluruh sekolah di Indonesia."}
              </p>
              <p className="text-[11px] text-slate-400">
                Mendukung QRIS, GoPay, OVO, DANA, ShopeePay, LinkAja, dan transfer bank via Saweria.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-emerald-700 font-bold block text-sm mb-1">100% Sukarela</span>
              <p className="text-xs text-slate-500">Tidak ada paksaan nominal. Dukungan apa pun sangat berharga.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-emerald-700 font-bold block text-sm mb-1">Fitur Tetap Lengkap</span>
              <p className="text-xs text-slate-500">Semua pengguna tetap menikmati seluruh fitur tanpa diskriminasi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-emerald-700 font-bold block text-sm mb-1">Bebas Iklan Selamanya</span>
              <p className="text-xs text-slate-500">Aplikasi desktop tetap bersih tanpa banner iklan yang mengganggu.</p>
            </div>
          </div>
        </div>

        {/* Transparansi: Untuk Apa Dana Sukarela? */}
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 mb-12 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">
            Transparansi Alokasi Dukungan
          </h3>
          <p className="text-sm text-emerald-200/90 leading-relaxed mb-6">
            Dukungan dari para sahabat sekolah digunakan langsung untuk menopang kebutuhan teknis pengembangan:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Infrastruktur & Domain Website</span>
                <span className="text-emerald-200/80">Biaya sewa domain, bandwidth download, dan hosting server dokumentasi.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Produksi Audio & Voice Over</span>
                <span className="text-emerald-200/80">Pengembangan pustaka nada bel baru dan narasi pengumuman sekolah standar.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Perangkat Uji & Lab Kompatibilitas</span>
                <span className="text-emerald-200/80">Pengujian rilis di berbagai varian hardware dan pembaruan Windows 10/11.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Waktu & Energi Pengembang</span>
                <span className="text-emerald-200/80">Menjaga kode tetap bersih, bebas bug, dan terus diperbarui secara berkala.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pertanyaan Seputar Dukungan Pengembang */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Pertanyaan Seputar Dukungan Pengembang</h3>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Apakah sekolah kami wajib membayar jika menggunakan KRONABEL setiap hari?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Sama sekali tidak.</strong> Aplikasi KRONABEL bebas digunakan oleh sekolah negeri, swasta, madrasah, pesantren, maupun instansi pendidikan lainnya secara cuma-cuma tanpa masa kedaluwarsa.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Bagaimana jika sekolah kami memiliki anggaran BOS atau komite yang ingin dialokasikan?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Anda dapat menggunakan tombol tautan resmi Saweria kami di atas, atau menghubungi pengembang jika memerlukan administrasi kwitansi dukungan institusi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

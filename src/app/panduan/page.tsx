import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `Panduan Penggunaan Software Bel Sekolah Otomatis - ${SITE_CONFIG.brandName}`,
  description: `Dokumentasi dan petunjuk lengkap penggunaan aplikasi bel sekolah otomatis Windows ${SITE_CONFIG.brandName}. Panduan instalasi, jadwal harian/Ramadan/ujian, pustaka audio MP3/WAV, dan solusi masalah.`,
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/panduan`,
  },
  openGraph: {
    title: `Panduan Penggunaan Software Bel Sekolah Otomatis - ${SITE_CONFIG.brandName}`,
    description: `Dokumentasi lengkap penggunaan aplikasi bel sekolah otomatis ${SITE_CONFIG.brandName}. Panduan instalasi, multi-profil jadwal, dan audio bel sekolah.`,
    url: `${SITE_CONFIG.siteUrl}/panduan`,
    images: [
      {
        url: "/images/screenshot_real_compact.png",
        width: 1280,
        height: 720,
        alt: `Panduan Penggunaan ${SITE_CONFIG.brandName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Panduan Penggunaan Software Bel Sekolah Otomatis - ${SITE_CONFIG.brandName}`,
    description: `Dokumentasi panduan instalasi dan operasional bel sekolah otomatis Windows KRONABEL.`,
    images: ["/images/screenshot_real_compact.png"],
  },
};

export default function GuidePage() {
  const sections = [
    { id: "instalasi", title: "1. Instalasi & Setup Pertama" },
    { id: "jadwal", title: "2. Pengaturan Jam & Jadwal Bel" },
    { id: "profil", title: "3. Penggunaan Multi-Profil" },
    { id: "audio", title: "4. Pustaka Audio Berkode" },
    { id: "manual", title: "5. Bel Manual & Sistem Interupsi" },
    { id: "kontrol", title: "6. Tombol Stop & Scheduler ON/OFF" },
    { id: "backup", title: "7. Backup & Restore Database" },
    { id: "troubleshoot", title: "8. Solusi Masalah (Troubleshooting)" },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Panduan Penggunaan {SITE_CONFIG.brandName}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Petunjuk operasional lengkap dan terperinci untuk operator sekolah, staf kurikulum, dan teknisi komputer.
          </p>
        </div>

        {/* Layout: Sidebar Nav + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Index Sidebar (Sticky on Desktop) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Daftar Isi Panduan
              </h3>
              <nav className="space-y-1">
                {sections.map((s) => {
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="truncate">{s.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-700 transition-colors shrink-0 ml-2" />
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-950">
                  <p className="font-semibold mb-1">Butuh installer aplikasi?</p>
                  <p className="text-slate-600 mb-3">Unduh versi terbaru v{SITE_CONFIG.release.latestVersion} langsung dari halaman unduh.</p>
                  <Link
                    href="/unduh"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                  >
                    Buka Halaman Unduh &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content Columns */}
          <div className="lg:col-span-8 space-y-12">
            {/* Bagian 1: Instalasi */}
            <section id="instalasi" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. Instalasi & Setup Pertama</h2>
                <p className="text-xs text-slate-500 mt-1">Pemasangan di Windows 10 atau Windows 11 (64-bit)</p>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Pilihan A: Menggunakan Setup Installer (.exe)</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
                    <li>Unduh file <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">BelOtomatisSekolah_Setup_v1.2.2.exe</code>.</li>
                    <li>Klik dua kali pada file tersebut. Jika muncul layar biru Windows Defender SmartScreen, klik <strong>More info</strong> lalu klik <strong>Run anyway</strong>.</li>
                    <li>Ikuti wizard instalasi Inno Setup. Anda dapat memilih opsi untuk membuat ikon di Desktop.</li>
                    <li>Klik <strong>Finish</strong> dan aplikasi akan langsung berjalan.</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Pilihan B: Menggunakan Portable ZIP (.zip)</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
                    <li>Unduh file <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">BelOtomatisSekolah_Portable_v1.2.2.zip</code>.</li>
                    <li>Klik kanan file ZIP &rarr; <strong>Extract All...</strong> ke direktori yang Anda inginkan (misalnya <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">D:\BelSekolah</code> atau di USB Flashdisk).</li>
                    <li>Buka folder hasil ekstrak dan jalankan <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">BelOtomatisSekolah.exe</code>.</li>
                  </ol>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Pengaturan Daya Komputer (Penting!)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Agar bel dapat berbunyi sepanjang hari sekolah tanpa gangguan, pastikan pengaturan Sleep pada Windows diatur ke <strong>&ldquo;Never&rdquo;</strong> (Tidak Pernah Tidur). Buka <em>Windows Settings &rarr; System &rarr; Power & sleep &rarr; Saat dicolokkan ke listrik, ubah Sleep menjadi &ldquo;Never&rdquo;</em>. Layar monitor boleh mati, namun CPU harus tetap aktif.
                  </p>
                </div>
              </div>
            </section>

            {/* Bagian 2: Pengaturan Jam & Jadwal */}
            <section id="jadwal" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">2. Pengaturan Jam & Jadwal Bel</h2>
                <p className="text-xs text-slate-500 mt-1">Menyusun jadwal harian masuk, pergantian jam, dan pulang</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Aplikasi dilengkapi jam digital besar presisi tinggi yang sinkron dengan jam internal Windows. Di sebelah kanan jam digital terdapat tabel jadwal aktif untuk hari berjalan.
                </p>

                <h3 className="text-base font-bold text-slate-900 pt-2">Langkah Mengatur Jadwal Bel:</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
                  <li>Klik tombol <strong>Setting</strong> di layar utama untuk masuk ke Panel Administrasi.</li>
                  <li>Masukkan PIN administrator jika proteksi keamanan aktif (secara default dapat langsung diakses atau diatur di tab Pengaturan).</li>
                  <li>Pilih tab <strong>Kelola Jadwal</strong>.</li>
                  <li>Pilih <strong>Hari</strong> (misal: Senin s/d Jumat) dan <strong>Profil</strong> yang ingin diedit.</li>
                  <li>Tentukan <strong>Waktu</strong> (Jam:Menit, format 24 jam misalnya <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">07:00</code>).</li>
                  <li>Pilih <strong>Audio Bel</strong> dari menu dropdown (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">[BEL A] Masuk Kelas</code>).</li>
                  <li>Tulis keterangan aktivitas (misal: <em>Jam Masuk Pelajaran Pertama</em>) dan klik <strong>Tambah / Simpan Jadwal</strong>.</li>
                </ol>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950">
                  <strong>Indikator Jadwal Berikutnya:</strong> Di bagian bawah panel jadwal beranda, aplikasi secara otomatis menampilkan jadwal bel berikutnya dan menghitung mundur waktu yang tersisa sehingga operator piket dapat memantau dengan tepat.
                </div>
              </div>
            </section>

            {/* Bagian 3: Multi Profil */}
            <section id="profil" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">3. Penggunaan Multi-Profil</h2>
                <p className="text-xs text-slate-500 mt-1">Beralih jadwal dengan 1 klik tanpa harus menghapus jadwal reguler</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Salah satu fitur unggulan KRONABEL adalah sistem <strong>Multi-Profil Terisolasi</strong>. Setiap profil menyimpan rangkaian jadwalnya masing-masing secara independen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-1">Profil Reguler</span>
                    <p className="text-xs text-slate-600">Jadwal standar kegiatan belajar mengajar sehari-hari (45 menit per jam pelajaran).</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-1">Profil Khusus Ramadan</span>
                    <p className="text-xs text-slate-600">Jadwal yang telah disesuaikan dengan pengurangan durasi jam belajar selama bulan puasa.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-1">Profil Ujian / Asesmen</span>
                    <p className="text-xs text-slate-600">Jadwal khusus saat PAS, PAT, US, atau Asesmen Nasional dengan jeda antar sesi pengawasan.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-1">Profil Kustom Bebas</span>
                    <p className="text-xs text-slate-600">Buat profil baru dengan nama apa pun (misal: <em>Classmeeting</em> atau <em>Peringatan Hari Besar</em>).</p>
                  </div>
                </div>

                <p>
                  <strong>Cara Mengganti Profil Aktif:</strong> Klik tombol pill bertuliskan <em>&ldquo;Profil: [Nama Profil]&rdquo;</em> di pojok kanan atas jendela utama, atau pilih profil melalui menu Setting. Seluruh tabel jadwal akan langsung berganti seketika.
                </p>
              </div>
            </section>

            {/* Bagian 4: Pustaka Audio Berkode */}
            <section id="audio" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">4. Pustaka Audio Berkode & Uji Suara</h2>
                <p className="text-xs text-slate-500 mt-1">Mengenal kode nada bel dan memasukkan rekaman audio kustom</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Aplikasi telah dilengkapi nada bel narasi bahasa Indonesia yang jelas dan sopan dengan kode huruf:
                </p>

                <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-400">
                    <div>BEL A : Masuk Kelas Jam Ke-1</div>
                    <div>BEL B : Masuk Jam Ke-2</div>
                    <div>BEL C : Masuk Jam Ke-3</div>
                    <div>BEL D : Masuk Jam Ke-4</div>
                    <div>BEL E : Masuk Jam Ke-5</div>
                    <div>BEL F : Masuk Jam Ke-6</div>
                    <div>BEL G : Masuk Jam Ke-7</div>
                    <div>BEL H : Masuk Jam Ke-8</div>
                    <div>BEL I : Masuk Jam Ke-9 / Ke-10</div>
                    <div>BEL J : Waktu Istirahat Pertama</div>
                    <div>BEL K : Waktu Istirahat Kedua</div>
                    <div>BEL L : Persiapan Upacara Bendera</div>
                    <div>BEL M : Waktu Pulang Sekolah</div>
                    <div>BEL N : Doa Bersama / Penutup</div>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 pt-2">Menambahkan Nada Bel Sendiri:</h3>
                <p className="text-slate-600">
                  Anda dapat menambahkan rekaman suara guru, sirine darurat, lagu kebangsaan, atau mars sekolah ke dalam format MP3/WAV melalui tab <strong>Kelola Audio</strong> di menu Setting. File audio akan otomatis terdaftar dan dapat dipetakan ke jadwal atau tombol uji coba.
                </p>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <p className="font-semibold text-emerald-950 text-xs mb-1">Tombol TES Suara (TES 1 s/d TES 5):</p>
                  <p className="text-xs text-slate-600">
                    Di baris bawah panel bel manual terdapat tombol khusus TES 1 sampai TES 5. Gunakan tombol ini untuk menguji volume amplifier sekolah sebelum jam masuk tiba, tanpa harus mengubah jadwal yang sudah ada.
                  </p>
                </div>
              </div>
            </section>

            {/* Bagian 5: Bel Manual & Sistem Interupsi */}
            <section id="manual" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Bel Manual & Sistem Interupsi Suara</h2>
                <p className="text-xs text-slate-500 mt-1">Mekanisme pemutaran audio real-time dan proteksi jadwal terlewat</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Di bawah jam digital, tersedia panel Bel Manual berisi tombol cepat <strong>BEL A sampai BEL N</strong> serta tombol <strong>TES 1 sampai TES 5</strong>.
                </p>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Aturan Sistem Audio Terpusat (v1.2.1 / v1.2.2):</h3>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span><strong>Single Active Audio:</strong> Hanya satu nada bel yang berbunyi pada satu waktu. Tidak ada risiko dua audio bertabrakan secara bersamaan.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span><strong>Interupsi Manual Instan:</strong> Jika operator memencet tombol bel manual lain saat sebuah audio sedang berbunyi, audio lama langsung terhenti seketika dan audio baru langsung dimainkan.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span><strong>Proteksi Jadwal Terlewat (Missed):</strong> Jika jadwal otomatis bertepatan dengan operator yang sedang membunyikan bel manual, jadwal otomatis tersebut akan dilewati (tidak diputar bertumpuk) dan dicatat sebagai jadwal terlewat di log sistem demi ketertiban pengumuman.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bagian 6: Kontrol Stop & Scheduler ON/OFF */}
            <section id="kontrol" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">6. Tombol Stop & Kontrol Scheduler ON/OFF</h2>
                <p className="text-xs text-slate-500 mt-1">Kontrol penuh atas audio dan penjadwal bel otomatis</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <span className="font-bold text-amber-950 block mb-1">Tombol Stop Darurat</span>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      Tombol berwarna cokelat kemerahan di sebelah tombol Setting. Berfungsi menghentikan audio yang sedang berbunyi seketika tanpa mematikan penjadwal otomatis. Berguna saat audio salah dipilih atau kepala sekolah sedang memberikan arahan mendadak.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <span className="font-bold text-emerald-950 block mb-1">Toggle Scheduler ON / OFF</span>
                    <p className="text-xs text-emerald-900/90 leading-relaxed">
                      Tombol hijau <strong>ON</strong> dan tombol merah <strong>OFF</strong>. Tombol OFF menonaktifkan trigger bel otomatis (misal saat hari libur semester atau rapat guru). Meskipun scheduler OFF, operator tetap dapat membunyikan bel manual kapan pun.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bagian 7: Backup & Restore */}
            <section id="backup" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">7. Backup & Restore Database</h2>
                <p className="text-xs text-slate-500 mt-1">Mengamankan konfigurasi jadwal sekolah dan memindahkan ke komputer baru</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  Seluruh jadwal, daftar profil, dan konfigurasi aplikasi disimpan dalam satu berkas database SQLite yang aman: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs text-slate-900">bel_sekolah.db</code>.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-slate-900 text-xs mb-1">Mencadangkan Data (Backup):</p>
                    <p className="text-xs text-slate-600">
                      Masuk ke menu <strong>Setting &rarr; Tab Database &rarr; Klik tombol &ldquo;Backup Database&rdquo;</strong>. Pilih lokasi penyimpanan yang aman (misalnya flashdisk atau Google Drive sekolah). Berkas akan disimpan dengan cap waktu tanggal pencadangan.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-slate-900 text-xs mb-1">Memulihkan Data (Restore):</p>
                    <p className="text-xs text-slate-600">
                      Jika komputer sekolah diganti atau diinstall ulang, cukup instal kembali aplikasi KRONABEL, buka menu <strong>Setting &rarr; Tab Database &rarr; Klik tombol &ldquo;Restore Database&rdquo;</strong>, lalu pilih berkas backup Anda. Seluruh jadwal dan profil akan kembali seketika tanpa perlu disetting ulang dari awal.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bagian 8: Troubleshooting */}
            <section id="troubleshoot" className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-200 scroll-mt-24">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">8. Solusi Masalah (Troubleshooting)</h2>
                <p className="text-xs text-slate-500 mt-1">Penyelesaian cepat kendala teknis yang umum dihadapi di sekolah</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Audio bel tidak terdengar sama sekali
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
                    <li>Periksa kabel jack audio 3.5mm dari port audio komputer menuju amplifier pengeras suara sekolah.</li>
                    <li>Pastikan amplifier dalam keadaan menyala dan volume input tidak berada pada posisi nol atau mute.</li>
                    <li>Periksa ikon speaker di pojok kanan bawah Windows taskbar: pastikan volume master Windows minimal 80%.</li>
                    <li>Uji dengan memencet salah satu tombol <strong>TES 1</strong> pada panel aplikasi.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Jam di aplikasi tidak cocok dengan jam dinding sekolah
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
                    <li>Aplikasi KRONABEL menggunakan waktu sistem komputer Windows. Buka <em>Windows Settings &rarr; Time & Language &rarr; Date & time</em>.</li>
                    <li>Aktifkan <strong>&ldquo;Set time automatically&rdquo;</strong> dan pastikan zona waktu sesuai (WIB: UTC+07:00, WITA: UTC+08:00, WIT: UTC+09:00).</li>
                    <li>Klik <strong>&ldquo;Sync now&rdquo;</strong> agar jam komputer terkalibrasi dengan server waktu nasional.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Jadwal bel tiba-tiba terlewat saat komputer ditinggal lama
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
                    <li>Penyebab paling umum: Windows masuk ke mode Sleep / Hibernasi otomatis karena tidak ada aktivitas keyboard atau mouse.</li>
                    <li>Solusi: Masuk ke pengaturan Windows Power & Sleep, ubah opsi <em>&ldquo;When plugged in, PC goes to sleep after&rdquo;</em> menjadi <strong>Never</strong>.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}


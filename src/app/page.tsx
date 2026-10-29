"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import {
  Download,
  Heart,
  Clock,
  Calendar,
  Volume2,
  Sliders,
  ShieldCheck,
  History,
  Archive,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Laptop,
  Sparkles,
  BellRing,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Apakah KRONABEL benar-benar gratis digunakan?",
      a: "Ya, 100% gratis. KRONABEL didesain untuk membantu sekolah, madrasah, pesantren, dan institusi pendidikan di Indonesia tanpa kewajiban membeli lisensi, biaya langganan bulanan, maupun fitur berbayar tersembunyi.",
    },
    {
      q: "Apakah aplikasi ini memerlukan koneksi internet untuk membunyikan bel?",
      a: "Sama sekali tidak. KRONABEL bekerja 100% secara offline di komputer Windows sekolah. Seluruh database jadwal dan pemutar audio tersimpan secara lokal di komputer Anda.",
    },
    {
      q: "Sistem operasi apa saja yang didukung oleh KRONABEL?",
      a: "KRONABEL mendukung Windows 10 dan Windows 11 (arsitektur 64-bit). Komputer sekolah hanya membutuhkan sistem operasi Windows yang standar tanpa perlu menginstal Python atau pustaka tambahan.",
    },
    {
      q: "Apa perbedaan antara versi Setup Installer dan Portable ZIP?",
      a: "Versi Setup Installer (.exe) adalah pilihan utama yang direkomendasikan karena otomatis membuat pintasan di desktop dan menu Start Windows. Versi Portable ZIP (.zip) dapat langsung diekstrak dan dijalankan tanpa instalasi, sangat praktis untuk dicoba langsung dari flashdisk.",
    },
    {
      q: "Bagaimana cara menghubungkan aplikasi dengan speaker lorong sekolah?",
      a: "Cukup hubungkan lubang output audio (jack 3.5mm atau USB soundcard) komputer ke input audio amplifier / sound system lorong sekolah. Pastikan volume Windows dan amplifier berada pada tingkat yang diinginkan.",
    },
    {
      q: "Bagaimana cara memberikan dukungan sukarela kepada pengembang?",
      a: "Dukungan dapat disalurkan secara sukarela melalui platform Saweria. Setiap dukungan sangat berharga untuk pemeliharaan website, pembaruan fitur, dan keberlanjutan pengembangan aplikasi.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden border-b border-forest-900/10 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-50 pb-20 pt-16 lg:pb-28 lg:pt-20">
        {/* Decorative background subtle glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 transform">
          <div className="h-[480px] w-[800px] rounded-full bg-gradient-to-tr from-gold-300/15 via-forest-300/10 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              {/* Release Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-600/30 bg-gold-100/90 px-3.5 py-1.5 text-xs font-bold text-gold-900 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-forest-600 animate-pulse" />
                <span>Rilis Resmi Terkini v{SITE_CONFIG.release.latestVersion}</span>
                <span className="text-gold-700">|</span>
                <span className="font-medium text-slate-600">Windows 10/11 64-bit</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight text-forest-950 sm:text-5xl lg:text-6xl">
                  {SITE_CONFIG.brandName}
                </h1>
                <p className="text-2xl font-bold tracking-tight text-forest-800 sm:text-3xl">
                  &ldquo;{SITE_CONFIG.tagline}&rdquo;
                </p>
              </div>

              {/* Description */}
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                {SITE_CONFIG.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row lg:justify-start">
                <Link
                  href="/unduh"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-forest-900 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-forest-900/20 transition-all hover:bg-forest-800 hover:shadow-xl sm:w-auto"
                >
                  <Download className="h-5 w-5" />
                  <span>Unduh Gratis (v{SITE_CONFIG.release.latestVersion})</span>
                </Link>

                <Link
                  href="/dukungan"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-1.5 border-gold-600/50 bg-gold-100 px-6 py-3.5 text-base font-bold text-gold-950 transition-all hover:bg-gold-200 sm:w-auto"
                >
                  <Heart className="h-5 w-5 fill-gold-600 text-gold-600" />
                  <span>Dukung Pengembangan</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-600 lg:justify-start">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-forest-600" />
                  <span>100% Gratis & Mandiri</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-forest-600" />
                  <span>Bekerja 100% Offline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-forest-600" />
                  <span>Tanpa Biaya Langganan</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Interface Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Card Frame */}
                <div className="relative rounded-2xl border-2 border-gold-accent/40 bg-forest-dark p-3 shadow-2xl ring-1 ring-black/10">
                  <div className="relative overflow-hidden rounded-xl border border-gold-accent/30 bg-forest-950">
                    {/* Actual Screenshot from Desktop App */}
                    <Image
                      src="/images/screenshot_real_compact.png"
                      alt="Tampilan Antarmuka Panel Kompak KRONABEL"
                      width={740}
                      height={420}
                      className="h-auto w-full object-cover shadow-inner"
                      priority
                    />
                  </div>

                  {/* Floating Highlight Badge */}
                  <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-gold-accent/40 bg-ivory-50/95 p-3.5 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-3">
                    <div className="rounded-lg bg-forest-900 p-2 text-gold-400">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-forest-950">Interupsi Cepat</div>
                      <div className="text-[11px] text-slate-500">Manual langsung membunyikan bel baru</div>
                    </div>
                  </div>

                  {/* Floating Clock Badge */}
                  <div className="absolute -right-3 -top-3 rounded-xl border border-forest-800 bg-forest-900 px-3 py-1.5 text-xs font-bold text-gold-300 shadow-md">
                    Panel Ringkas 740×380 px
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NILAI UNGGULAN & MANFAAT                                               */}
      {/* ========================================================================= */}
      <section className="bg-ivory-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-700">
              Keunggulan Utama
            </h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-forest-950 sm:text-4xl">
              Didesain Khusus untuk Efisiensi Sekolah Indonesia
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Tidak ada kerumitan server atau koneksi internet. KRONABEL langsung bekerja seketika setelah dipasang di komputer sekolah.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft transition-all hover:border-gold-accent/50 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 text-forest-800">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-forest-950">
                Tepat Waktu & Akurat
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Tersinkronisasi langsung dengan jam internal sistem Windows. Bel berbunyi presisi hingga hitungan detik.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft transition-all hover:border-gold-accent/50 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 text-forest-800">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-forest-950">
                100% Offline Standalone
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Tidak memerlukan internet saat membunyikan bel. Database jadwal tersimpan aman di komputer sekolah.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft transition-all hover:border-gold-accent/50 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100 text-gold-800">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-forest-950">
                Tanpa Biaya Langganan
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Gratis digunakan untuk seluruh sekolah di Indonesia. Tidak ada masa uji coba (trial) yang mengunci.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-soft transition-all hover:border-gold-accent/50 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 text-forest-800">
                <Sliders className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-forest-950">
                Panel Ringkas Kompak
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Antarmuka utama berukuran ringkas (740×380 px), tidak menghalangi pekerjaan operator lainnya di komputer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FITUR-FITUR UTAMA YANG BENAR-BENAR TERSEDIA                           */}
      {/* ========================================================================= */}
      <section className="border-t border-forest-900/10 bg-ivory-muted/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-forest-800">
              Fitur Terverifikasi v1.2.2
            </h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-forest-950 sm:text-4xl">
              Fungsionalitas Lengkap Tanpa Rekayasa
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
              Setiap fitur di bawah ini telah diuji dan tersedia secara nyata pada rilis KRONABEL desktop terbaru.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-forest-950">Jadwal Bel Otomatis</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Atur jadwal jam masuk, pergantian pelajaran, istirahat, hingga pulang sekolah per hari (Senin s/d Sabtu) dengan presisi tinggi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
                  <Sliders className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-forest-950">Multi-Profil Jadwal</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Ganti jadwal dengan 1 klik antara Profil Reguler, Ramadan (jam lebih pendek), Pekan Ujian, atau buat profil khusus baru.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-600 text-white">
                  <BellRing className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-forest-950">Sistem Interupsi Audio</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Bel manual baru dapat langsung menginterupsi audio otomatis atau manual lain. Hanya tepat 1 audio aktif tanpa suara tumpang tindih.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
                  <Volume2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-forest-950">Pustaka Lagu Berkode</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Dukung audio MP3 dan WAV. Setiap lagu memiliki kode unik alfabet (BEL A, BEL B, APL) yang muncul di tombol manual dan tabel jadwal.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
                  <History className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-forest-950">Log & Notifikasi Terlewat</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Catat riwayat lengkap pelaksanaan bel. Jika jadwal otomatis dilewati karena bel manual aktif, notifikasi informatif muncul seketika.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-900 text-gold-400">
                  <Archive className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-forest-950">Backup & Restore Mandiri</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Ekspor seluruh data jadwal dan berkas audio ke dalam paket arsip ZIP terverifikasi SHA-256 untuk pemindahan ke komputer lain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CARA KERJA APLIKASI (3 LANGKAH)                                        */}
      {/* ========================================================================= */}
      <section className="bg-ivory-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-700">
              Alur Pengoperasian
            </h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-forest-950 sm:text-4xl">
              Tiga Langkah Mudah Menggunakan KRONABEL
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-forest-900/10 bg-white p-6 text-center shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-900 text-xl font-black text-gold-400 shadow">
                1
              </div>
              <h3 className="mt-5 text-lg font-bold text-forest-950">Pasang di Komputer</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Unduh file installer (.exe) atau paket portable (.zip). Jalankan aplikasi tanpa perlu pengaturan teknis rumit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-forest-900/10 bg-white p-6 text-center shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-900 text-xl font-black text-gold-400 shadow">
                2
              </div>
              <h3 className="mt-5 text-lg font-bold text-forest-950">Atur Jam & Lagu Bel</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Buka menu Setting, tentukan jam pelajaran per hari, lalu pilih file suara audio (MP3 atau WAV) sesuai kebutuhan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-forest-900/10 bg-white p-6 text-center shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-900 text-xl font-black text-gold-400 shadow">
                3
              </div>
              <h3 className="mt-5 text-lg font-bold text-forest-950">Aktifkan Mesin (ON)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Klik tombol ON. Mesin otomatis akan menghitung mundur dan membunyikan bel tepat waktu di lorong sekolah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PERSYARATAN SISTEM                                                     */}
      {/* ========================================================================= */}
      <section className="border-t border-forest-900/10 bg-forest-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="rounded-full bg-forest-800 px-3 py-1 text-xs font-bold text-gold-400">
                Spesifikasi
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Persyaratan Sistem Komputer
              </h2>
              <p className="mt-2 text-xs text-slate-300">
                KRONABEL sangat ringan dan dapat berjalan lancar di komputer sekolah standar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-8">
              <div className="rounded-xl border border-forest-800 bg-forest-900/60 p-4">
                <div className="text-[11px] font-bold text-gold-400">Sistem Operasi</div>
                <div className="mt-1 text-sm font-black">Windows 10 / 11</div>
                <div className="text-[10px] text-slate-400">Arsitektur 64-bit</div>
              </div>

              <div className="rounded-xl border border-forest-800 bg-forest-900/60 p-4">
                <div className="text-[11px] font-bold text-gold-400">Memori (RAM)</div>
                <div className="mt-1 text-sm font-black">Min. 2 GB</div>
                <div className="text-[10px] text-slate-400">Rekomendasi 4 GB</div>
              </div>

              <div className="rounded-xl border border-forest-800 bg-forest-900/60 p-4">
                <div className="text-[11px] font-bold text-gold-400">Penyimpanan</div>
                <div className="mt-1 text-sm font-black">~150 MB</div>
                <div className="text-[10px] text-slate-400">Untuk app & audio</div>
              </div>

              <div className="rounded-xl border border-forest-800 bg-forest-900/60 p-4">
                <div className="text-[11px] font-bold text-gold-400">Perangkat Suara</div>
                <div className="mt-1 text-sm font-black">Audio Out</div>
                <div className="text-[10px] text-slate-400">Jack 3.5mm / USB sound</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PERTANYAAN UMUM (FAQ)                                                  */}
      {/* ========================================================================= */}
      <section className="bg-ivory-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-gold-700">
              Tanya Jawab
            </h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-forest-950 sm:text-4xl">
              Pertanyaan yang Sering Diajukan
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-forest-950 hover:bg-ivory-50"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gold-600 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 transform" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-slate-100 bg-ivory-muted/40 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. AJAKAN MENGUNDUH (BOTTOM CTA)                                          */}
      {/* ========================================================================= */}
      <section className="border-t border-forest-900/10 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-dark py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-bold text-gold-300">
            Gratis & Bekerja 100% Offline
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Mulai Gunakan {SITE_CONFIG.brandName} Hari Ini
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Tingkatkan ketepatan jam pelajaran di sekolah Anda dengan aplikasi bel otomatis yang handal, elegan, dan mudah dikelola.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/unduh"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-8 py-4 text-base font-black text-forest-950 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-400 sm:w-auto"
            >
              <Download className="h-5 w-5" />
              <span>Buka Halaman Unduh</span>
            </Link>

            <Link
              href="/panduan"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/20 sm:w-auto"
            >
              <span>Pelajari Panduan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


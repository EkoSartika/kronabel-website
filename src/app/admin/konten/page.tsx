"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Home,
  Info,
  BookOpen,
  Download,
  History,
  Heart,
  Settings,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface SectionContent {
  key: string;
  page: string;
  section: string;
  title: string;
  content: Record<string, any>;
  status: "published" | "draft";
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<
    "beranda" | "tentang" | "panduan" | "unduh" | "riwayat" | "dukungan" | "footer"
  >("beranda");

  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Default content states initialized with current production data
  const [homeHero, setHomeHero] = useState({
    heading: SITE_CONFIG.brandName,
    tagline: `“${SITE_CONFIG.tagline}”`,
    description: SITE_CONFIG.description,
    ctaDownloadText: "Unduh Gratis (v1.2.2)",
    ctaSupportText: "Dukung Pengembang",
    previewImage: "/images/screenshot_real_compact.png",
    status: "published" as "published" | "draft",
  });

  const [homeCta, setHomeCta] = useState({
    title: `Mulai Gunakan ${SITE_CONFIG.brandName} Hari Ini`,
    description: "Tingkatkan ketepatan jam pelajaran di sekolah Anda dengan aplikasi bel otomatis yang handal, elegan, dan mudah dikelola.",
    primaryButtonText: "Buka Halaman Unduh",
    secondaryButtonText: "Pelajari Panduan",
    status: "published" as "published" | "draft",
  });

  const [aboutIntro, setAboutIntro] = useState({
    title: "Mengenal KRONABEL",
    subtitle: "Inisiatif perangkat lunak bel sekolah otomatis yang handal, elegan, dan didedikasikan sepenuhnya untuk pendidikan di Indonesia.",
    purposeTitle: "Latar Belakang & Tujuan",
    purposeSubtitle: "Menghadirkan ketertiban waktu belajar tanpa biaya tinggi",
    paragraph1: "Ketepatan pergantian jam pelajaran merupakan salah satu fondasi disiplin di lingkungan sekolah. Namun, banyak sekolah masih bergantung pada pemukulan bel manual oleh petugas piket yang rentan terlambat, atau terbebani oleh perangkat bel digital impor berbiaya jutaan rupiah yang sulit diatur jadwalnya.",
    paragraph2: "KRONABEL hadir sebagai solusi perangkat lunak Windows yang dapat dipasang langsung pada komputer ruang guru atau ruang piket. Dengan menghubungkan output audio komputer ke amplifier pengeras suara sekolah, seluruh jadwal bel berbunyi secara presisi, teratur, dan otomatis setiap hari.",
    status: "published" as "published" | "draft",
  });

  const [guideContent, setGuideContent] = useState({
    title: "Panduan Penggunaan Lengkap - KRONABEL",
    subtitle: "Dokumentasi dan petunjuk praktis penggunaan aplikasi Bel Sekolah Otomatis. Panduan instalasi, konfigurasi jadwal, multi-profil, pustaka audio, dan pemecahan masalah.",
    status: "published" as "published" | "draft",
  });

  const [downloadContent, setDownloadContent] = useState({
    title: `Unduh KRONABEL v${SITE_CONFIG.release.latestVersion}`,
    subtitle: "Gratis tanpa batasan durasi, tanpa iklan terselubung, dan berjalan langsung secara lokal (offline) di komputer Windows sekolah Anda.",
    installerDownloadUrl: SITE_CONFIG.release.installer.downloadUrl,
    installerSize: SITE_CONFIG.release.installer.size,
    portableDownloadUrl: SITE_CONFIG.release.portable.downloadUrl,
    portableSize: SITE_CONFIG.release.portable.size,
    status: "published" as "published" | "draft",
  });

  const [changelogContent, setChangelogContent] = useState({
    title: `Riwayat Versi ${SITE_CONFIG.brandName}`,
    subtitle: "Transparansi setiap pembaruan kode, fitur baru, dan perbaikan kestabilan aplikasi Bel Sekolah Otomatis.",
    latestVersion: SITE_CONFIG.release.latestVersion,
    latestDate: SITE_CONFIG.release.releaseDate,
    status: "published" as "published" | "draft",
  });

  const [supportContent, setSupportContent] = useState({
    badge: "Dukungan Pengembang",
    title: `Dukung Pengembangan ${SITE_CONFIG.brandName}`,
    subtitle: "KRONABEL didedikasikan 100% gratis untuk seluruh satuan pendidikan di Indonesia tanpa batasan waktu dan tanpa biaya tersembunyi.",
    saweriaUrl: SITE_CONFIG.donation.url,
    buttonText: "Dukung KRONABEL",
    disclaimer: "Dukungan ini bersifat sukarela untuk mendukung keberlanjutan pengembangan. Aplikasi KRONABEL tetap 100% gratis digunakan untuk seluruh sekolah di Indonesia.",
    status: "published" as "published" | "draft",
  });

  const [footerContent, setFooterContent] = useState({
    brandName: SITE_CONFIG.brandName,
    brandSubtitle: SITE_CONFIG.brandSubtitle,
    copyrightText: `© 2026 ${SITE_CONFIG.brandName}. Semua hak dilindungi.`,
    status: "published" as "published" | "draft",
  });

  // Muat konten tersimpan dari Supabase jika tersedia
  useEffect(() => {
    async function loadSavedContents() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const data = await res.json();
          const contents: SectionContent[] = data.contents || [];

          contents.forEach((item) => {
            if (item.key === "home.hero") {
              setHomeHero((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "home.cta_bottom") {
              setHomeCta((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "about.intro") {
              setAboutIntro((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "guide.header") {
              setGuideContent((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "download.header") {
              setDownloadContent((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "changelog.header") {
              setChangelogContent((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "support.intro") {
              setSupportContent((prev) => ({ ...prev, ...item.content, status: item.status }));
            } else if (item.key === "footer.general") {
              setFooterContent((prev) => ({ ...prev, ...item.content, status: item.status }));
            }
          });
        }
      } catch {
        // Fallback ke default
      } finally {
        setLoading(false);
      }
    }

    loadSavedContents();
  }, []);

  const saveContent = async (
    key: string,
    page: string,
    section: string,
    title: string,
    content: Record<string, any>,
    status: "published" | "draft"
  ) => {
    setSavingKey(key);
    setAlert(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          page,
          section,
          title,
          content,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: "error", message: data.error || "Gagal menyimpan konten." });
      } else {
        setAlert({
          type: "success",
          message: `Konten "${title}" berhasil disimpan (${status.toUpperCase()}). Perubahan akan langsung tampil di website.`,
        });
      }
    } catch {
      setAlert({ type: "error", message: "Gagal terhubung ke server untuk menyimpan konten." });
    } finally {
      setSavingKey(null);
    }
  };

  const tabs = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "tentang", label: "Tentang", icon: Info },
    { id: "panduan", label: "Panduan", icon: BookOpen },
    { id: "unduh", label: "Unduh", icon: Download },
    { id: "riwayat", label: "Riwayat Versi", icon: History },
    { id: "dukungan", label: "Dukungan", icon: Heart },
    { id: "footer", label: "Footer & Merek", icon: Settings },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Editor Konten Website (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola teks, subjudul, tombol, dan media seluruh halaman publik KRONABEL.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Eye className="w-4 h-4 text-emerald-700" />
          <span>Pratinjau Website</span>
        </a>
      </div>

      {/* Alert Notifications */}
      {alert && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 shadow-sm ${
            alert.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <p className="leading-relaxed font-medium">{alert.message}</p>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-forest-900 text-gold-400 shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* ===================================================================== */}
        {/* TAB 1: BERANDA                                                        */}
        {/* ===================================================================== */}
        {activeTab === "beranda" && (
          <div className="space-y-6">
            {/* Bagian Hero */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">1. Hero Section (Header Utama)</h2>
                  <p className="text-xs text-slate-500">Teks pembuka dan gambar pratinjau antarmuka beranda</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={homeHero.status}
                    onChange={(e) =>
                      setHomeHero({ ...homeHero, status: e.target.value as any })
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <button
                    onClick={() =>
                      saveContent(
                        "home.hero",
                        "beranda",
                        "hero",
                        "Hero Section Beranda",
                        homeHero,
                        homeHero.status
                      )
                    }
                    disabled={savingKey === "home.hero"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingKey === "home.hero" ? "Menyimpan..." : "Simpan Hero"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Judul Aplikasi</label>
                  <input
                    type="text"
                    value={homeHero.heading}
                    onChange={(e) => setHomeHero({ ...homeHero, heading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tagline</label>
                  <input
                    type="text"
                    value={homeHero.tagline}
                    onChange={(e) => setHomeHero({ ...homeHero, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Deskripsi Pembuka</label>
                <textarea
                  rows={3}
                  value={homeHero.description}
                  onChange={(e) => setHomeHero({ ...homeHero, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Teks Tombol Unduh</label>
                  <input
                    type="text"
                    value={homeHero.ctaDownloadText}
                    onChange={(e) => setHomeHero({ ...homeHero, ctaDownloadText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Teks Tombol Dukungan</label>
                  <input
                    type="text"
                    value={homeHero.ctaSupportText}
                    onChange={(e) => setHomeHero({ ...homeHero, ctaSupportText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">URL Gambar Screenshot Hero</label>
                <input
                  type="text"
                  value={homeHero.previewImage}
                  onChange={(e) => setHomeHero({ ...homeHero, previewImage: e.target.value })}
                  placeholder="/images/screenshot_real_compact.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Gunakan gambar lokal atau salin URL dari tab <strong>Pustaka Media</strong>.
                </p>
              </div>
            </div>

            {/* Bagian Bottom CTA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">2. Bagian Ajakan Mengunduh (Bottom CTA)</h2>
                  <p className="text-xs text-slate-500">Banner penutup di bagian paling bawah beranda</p>
                </div>
                <button
                  onClick={() =>
                    saveContent(
                      "home.cta_bottom",
                      "beranda",
                      "cta_bottom",
                      "CTA Bawah Beranda",
                      homeCta,
                      homeCta.status
                    )
                  }
                  disabled={savingKey === "home.cta_bottom"}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === "home.cta_bottom" ? "Menyimpan..." : "Simpan CTA"}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Judul CTA</label>
                <input
                  type="text"
                  value={homeCta.title}
                  onChange={(e) => setHomeCta({ ...homeCta, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Deskripsi CTA</label>
                <textarea
                  rows={2}
                  value={homeCta.description}
                  onChange={(e) => setHomeCta({ ...homeCta, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: TENTANG                                                        */}
        {/* ===================================================================== */}
        {activeTab === "tentang" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Konten Halaman Tentang Kami</h2>
                <p className="text-xs text-slate-500">Sejarah, visi, dan filosofi pengembangan aplikasi</p>
              </div>
              <button
                onClick={() =>
                  saveContent(
                    "about.intro",
                    "tentang",
                    "intro",
                    "Halaman Tentang KRONABEL",
                    aboutIntro,
                    aboutIntro.status
                  )
                }
                disabled={savingKey === "about.intro"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === "about.intro" ? "Menyimpan..." : "Simpan Halaman Tentang"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Judul Halaman</label>
                <input
                  type="text"
                  value={aboutIntro.title}
                  onChange={(e) => setAboutIntro({ ...aboutIntro, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Subjudul Tagline</label>
                <input
                  type="text"
                  value={aboutIntro.subtitle}
                  onChange={(e) => setAboutIntro({ ...aboutIntro, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Paragraf Latar Belakang</label>
              <textarea
                rows={3}
                value={aboutIntro.paragraph1}
                onChange={(e) => setAboutIntro({ ...aboutIntro, paragraph1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Paragraf Solusi KRONABEL</label>
              <textarea
                rows={3}
                value={aboutIntro.paragraph2}
                onChange={(e) => setAboutIntro({ ...aboutIntro, paragraph2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: PANDUAN                                                        */}
        {/* ===================================================================== */}
        {activeTab === "panduan" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Header Panduan & Dokumentasi</h2>
                <p className="text-xs text-slate-500">Judul dan pengantar panduan operasional</p>
              </div>
              <button
                onClick={() =>
                  saveContent(
                    "guide.header",
                    "panduan",
                    "header",
                    "Header Panduan",
                    guideContent,
                    guideContent.status
                  )
                }
                disabled={savingKey === "guide.header"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === "guide.header" ? "Menyimpan..." : "Simpan Panduan"}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Judul Halaman Panduan</label>
              <input
                type="text"
                value={guideContent.title}
                onChange={(e) => setGuideContent({ ...guideContent, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Deskripsi Pengantar</label>
              <textarea
                rows={3}
                value={guideContent.subtitle}
                onChange={(e) => setGuideContent({ ...guideContent, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: UNDUH                                                          */}
        {/* ===================================================================== */}
        {activeTab === "unduh" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pengaturan Pusat Unduhan</h2>
                <p className="text-xs text-slate-500">Tautan download berkas Setup Installer dan Portable ZIP</p>
              </div>
              <button
                onClick={() =>
                  saveContent(
                    "download.header",
                    "unduh",
                    "header",
                    "Pusat Unduhan",
                    downloadContent,
                    downloadContent.status
                  )
                }
                disabled={savingKey === "download.header"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === "download.header" ? "Menyimpan..." : "Simpan Unduhan"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Judul Halaman Unduh</label>
                <input
                  type="text"
                  value={downloadContent.title}
                  onChange={(e) => setDownloadContent({ ...downloadContent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Deskripsi Pengantar</label>
                <input
                  type="text"
                  value={downloadContent.subtitle}
                  onChange={(e) => setDownloadContent({ ...downloadContent, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Tautan Berkas Rilis Resmi (GitHub Releases)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">URL Setup Installer (.exe)</label>
                  <input
                    type="url"
                    value={downloadContent.installerDownloadUrl}
                    onChange={(e) =>
                      setDownloadContent({ ...downloadContent, installerDownloadUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Ukuran File Installer</label>
                  <input
                    type="text"
                    value={downloadContent.installerSize}
                    onChange={(e) =>
                      setDownloadContent({ ...downloadContent, installerSize: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">URL Portable ZIP (.zip)</label>
                  <input
                    type="url"
                    value={downloadContent.portableDownloadUrl}
                    onChange={(e) =>
                      setDownloadContent({ ...downloadContent, portableDownloadUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Ukuran File Portable</label>
                  <input
                    type="text"
                    value={downloadContent.portableSize}
                    onChange={(e) =>
                      setDownloadContent({ ...downloadContent, portableSize: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: RIWAYAT VERSI                                                  */}
        {/* ===================================================================== */}
        {activeTab === "riwayat" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Riwayat Versi & Catatan Rilis</h2>
                <p className="text-xs text-slate-500">Informasi rilis stabil dan changelog</p>
              </div>
              <button
                onClick={() =>
                  saveContent(
                    "changelog.header",
                    "riwayat-versi",
                    "header",
                    "Header Riwayat Versi",
                    changelogContent,
                    changelogContent.status
                  )
                }
                disabled={savingKey === "changelog.header"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === "changelog.header" ? "Menyimpan..." : "Simpan Riwayat"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Nomor Versi Terbaru</label>
                <input
                  type="text"
                  value={changelogContent.latestVersion}
                  onChange={(e) =>
                    setChangelogContent({ ...changelogContent, latestVersion: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Tanggal Rilis</label>
                <input
                  type="text"
                  value={changelogContent.latestDate}
                  onChange={(e) =>
                    setChangelogContent({ ...changelogContent, latestDate: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Judul Halaman Changelog</label>
              <input
                type="text"
                value={changelogContent.title}
                onChange={(e) =>
                  setChangelogContent({ ...changelogContent, title: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: DUKUNGAN                                                       */}
        {/* ===================================================================== */}
        {activeTab === "dukungan" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Dukungan Pengembang (Saweria)</h2>
                <p className="text-xs text-slate-500">Tautan resmi donasi sukarela komunitas pendidikan</p>
              </div>
              <button
                onClick={() =>
                  saveContent(
                    "support.intro",
                    "dukungan",
                    "intro",
                    "Halaman Dukungan Pengembang",
                    supportContent,
                    supportContent.status
                  )
                }
                disabled={savingKey === "support.intro"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === "support.intro" ? "Menyimpan..." : "Simpan Dukungan"}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">URL Akun Saweria</label>
              <input
                type="url"
                value={supportContent.saweriaUrl}
                onChange={(e) =>
                  setSupportContent({ ...supportContent, saweriaUrl: e.target.value })
                }
                placeholder="https://saweria.co/sartikamuhammadeko"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Judul Halaman</label>
                <input
                  type="text"
                  value={supportContent.title}
                  onChange={(e) =>
                    setSupportContent({ ...supportContent, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Label Tombol Aksi</label>
                <input
                  type="text"
                  value={supportContent.buttonText}
                  onChange={(e) =>
                    setSupportContent({ ...supportContent, buttonText: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Keterangan Kesukarelaan</label>
              <textarea
                rows={2}
                value={supportContent.disclaimer}
                onChange={(e) =>
                  setSupportContent({ ...supportContent, disclaimer: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 7: FOOTER & MEREK                                                 */}
        {/* ===================================================================== */}
        {activeTab === "footer" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Footer & Identitas Merek</h2>
                <p className="text-xs text-slate-500">Nama merek, tagline, dan copyright bawah situs</p>
              </div>
              <button
                onClick={() =>
                  saveContent(
                    "footer.general",
                    "footer",
                    "general",
                    "Footer & Identitas Merek",
                    footerContent,
                    footerContent.status
                  )
                }
                disabled={savingKey === "footer.general"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === "footer.general" ? "Menyimpan..." : "Simpan Footer"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Nama Merek Website</label>
                <input
                  type="text"
                  value={footerContent.brandName}
                  onChange={(e) =>
                    setFooterContent({ ...footerContent, brandName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Sub-tagline Merek</label>
                <input
                  type="text"
                  value={footerContent.brandSubtitle}
                  onChange={(e) =>
                    setFooterContent({ ...footerContent, brandSubtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Teks Hak Cipta (Copyright)</label>
              <input
                type="text"
                value={footerContent.copyrightText}
                onChange={(e) =>
                  setFooterContent({ ...footerContent, copyrightText: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


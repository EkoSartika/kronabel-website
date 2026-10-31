"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  productionUrl: string;
  saweriaUrl: string;
  latestVersion: string;
  releaseDate: string;
  installerDownloadUrl: string;
  portableDownloadUrl: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "KRONABEL",
  tagline: "Aplikasi Bel Sekolah Otomatis",
  description: "Aplikasi Bel Sekolah Otomatis Windows untuk manajemen jadwal pelajaran sekolah yang handal, presisi, dan bekerja 100% offline.",
  productionUrl: "https://kronabel.vercel.app",
  saweriaUrl: "https://saweria.co/sartikamuhammadeko",
  latestVersion: "v1.2.2",
  releaseDate: "29 Oktober 2026",
  installerDownloadUrl: "https://github.com/EkoSartika/kronabel-website/releases/download/v1.2.2/BelOtomatisSekolah_Setup_v1.2.2.exe",
  portableDownloadUrl: "https://github.com/EkoSartika/kronabel-website/releases/download/v1.2.2/BelOtomatisSekolah_Portable_v1.2.2.zip",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
        });
      }
    } catch {
      showToast("Gagal memuat pengaturan tersimpan dari database.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Save all keys in parallel or sequence
      const keys = Object.keys(settings) as (keyof SiteSettings)[];
      for (const k of keys) {
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: k,
            value: settings[k],
          }),
        });
      }
      showToast("Pengaturan umum berhasil disimpan ke Supabase!");
    } catch {
      showToast("Terjadi kesalahan saat menyimpan pengaturan.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell currentPath="/admin/pengaturan">
      <div className="space-y-6 max-w-4xl">
        {/* Toast */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
              toastMessage.type === "success"
                ? "bg-emerald-900 text-emerald-100 border border-emerald-700"
                : "bg-rose-900 text-rose-100 border border-rose-700"
            }`}
          >
            {toastMessage.text}
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Umum Website</h1>
          <p className="text-sm text-slate-500 mt-1">
            Konfigurasi identitas situs, integrasi dukungan Saweria, parameter unduhan resmi, dan tautan rilis global.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-slate-500">Memuat konfigurasi situs...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Identitas Website */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Identitas Website & Metadata
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Merek / Produk</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Resmi</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Global (SEO)</label>
                <textarea
                  rows={2}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Produksi Resmi</label>
                <input
                  type="url"
                  value={settings.productionUrl}
                  onChange={(e) => setSettings({ ...settings, productionUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-slate-800"
                  required
                />
              </div>
            </div>

            {/* 2. Integrasi Saweria & Dukungan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Integrasi Kanal Dukungan Pengembang
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Profil Saweria</label>
                <input
                  type="url"
                  value={settings.saweriaUrl}
                  onChange={(e) => setSettings({ ...settings, saweriaUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-slate-800"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Digunakan untuk tombol &quot;Dukung KRONABEL&quot; di halaman dukungan dan &quot;Dukung Pengembang&quot; pada footer publik.
                </p>
              </div>
            </div>

            {/* 3. Parameter Unduhan & Versi Aplikasi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Versi Rilis & Tautan Berkas Unduhan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Versi Terkini</label>
                  <input
                    type="text"
                    value={settings.latestVersion}
                    onChange={(e) => setSettings({ ...settings, latestVersion: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Rilis Publik</label>
                  <input
                    type="text"
                    value={settings.releaseDate}
                    onChange={(e) => setSettings({ ...settings, releaseDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Unduhan Berkas Installer (.exe)</label>
                <input
                  type="url"
                  value={settings.installerDownloadUrl}
                  onChange={(e) => setSettings({ ...settings, installerDownloadUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-slate-800 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Unduhan Berkas Portable (.zip)</label>
                <input
                  type="url"
                  value={settings.portableDownloadUrl}
                  onChange={(e) => setSettings({ ...settings, portableDownloadUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-slate-800 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* 4. Supabase Status Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Informasi Keamanan & Kredensial Environment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kunci kredensial <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">SUPABASE_SERVICE_ROLE_KEY</code>, <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, dan <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">ADMIN_SETUP_SECRET</code> dikelola langsung melalui dashboard Vercel Project Settings demi mematuhi standar zero-trust security.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Semua Pengaturan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}


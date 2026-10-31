"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface MediaItem {
  name: string;
  id?: string;
  created_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
  publicUrl: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok) {
        setMediaList(data.media || []);
      } else {
        showToast(data.error || "Gagal memuat daftar media.", "error");
      }
    } catch {
      showToast("Koneksi gagal saat memuat daftar media.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validasi ukuran: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran berkas melebihi batas maksimal 5 MB.", "error");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/x-icon"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Format berkas harus gambar (PNG, JPG, WEBP, SVG, ICO).", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Berkas media berhasil diunggah ke website-media.");
        fetchMedia();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        showToast(data.error || "Gagal mengunggah media.", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan saat mengunggah.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media?name=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Berkas media berhasil dihapus.");
        setMediaList((prev) => prev.filter((item) => item.name !== filename));
        setDeleteTarget(null);
      } else {
        showToast(data.error || "Gagal menghapus media.", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan saat menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL media berhasil disalin ke clipboard!");
    } catch {
      showToast("Gagal menyalin URL secara otomatis.", "error");
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const filteredMedia = mediaList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell currentPath="/admin/media">
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-bounce-short ${
              toastMessage.type === "success"
                ? "bg-emerald-900 text-emerald-100 border border-emerald-700"
                : "bg-rose-900 text-rose-100 border border-rose-700"
            }`}
          >
            {toastMessage.type === "success" ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toastMessage.text}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pustaka Media & Aset</h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola gambar, logo, screenshot, dan aset visual KRONABEL di Supabase Storage (bucket <code className="text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">website-media</code>).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/x-icon"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Mengunggah...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Unggah Media Baru
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Dropzone Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 sm:p-8 bg-slate-50/50 hover:bg-emerald-50/30 transition text-center cursor-pointer group"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Klik atau seret gambar ke area ini untuk mengunggah
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Format yang didukung: PNG, JPG, WEBP, SVG, ICO (Maksimal 5 MB per berkas).
          </p>
        </div>

        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <div className="relative flex-1 max-w-md">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama berkas media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
          <div className="text-xs text-slate-500">
            Total Media: <span className="font-semibold text-slate-800">{filteredMedia.length} berkas</span>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-slate-500">Memuat berkas media dari Supabase...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <svg className="mx-auto w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-3 text-base font-semibold text-slate-800">
              {searchQuery ? "Tidak ada media yang cocok dengan pencarian" : "Belum ada berkas media"}
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? "Coba kata kunci pencarian yang lain."
                : "Unggah screenshot aplikasi, logo, atau ilustrasi panduan untuk digunakan di CMS website."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.name}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.publicUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => copyToClipboard(item.publicUrl)}
                      title="Salin URL Publik"
                      className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white hover:text-emerald-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka Gambar Asli"
                      className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white hover:text-emerald-700 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      onClick={() => setDeleteTarget(item.name)}
                      title="Hapus Berkas"
                      className="p-2 rounded-lg bg-white/90 text-rose-600 hover:bg-rose-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="font-medium text-slate-800 text-xs truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{formatFileSize(item.metadata?.size)}</span>
                    <button
                      onClick={() => copyToClipboard(item.publicUrl)}
                      className="text-emerald-700 hover:underline hover:text-emerald-800"
                    >
                      Salin URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">Hapus Berkas Media?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Berkas <span className="font-mono font-semibold text-slate-700">{deleteTarget}</span> akan dihapus permanen dari Supabase Storage. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteTarget)}
                  disabled={isDeleting}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 transition"
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}


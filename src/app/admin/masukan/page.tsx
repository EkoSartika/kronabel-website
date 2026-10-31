"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface FeedbackItem {
  id: string;
  name: string | null;
  email: string | null;
  category: "saran" | "kritik" | "bug" | "fitur" | "lainnya";
  message: string;
  status: "baru" | "dibaca" | "diproses" | "selesai";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("limit", pageSize.toString());
      params.set("offset", ((page - 1) * pageSize).toString());

      const res = await fetch(`/api/admin/feedback?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setFeedbacks(data.feedbacks || []);
        setTotalCount(data.total || 0);
      } else {
        showToast(data.error || "Gagal memuat daftar masukan.", "error");
      }
    } catch {
      showToast("Koneksi gagal saat memuat daftar masukan.", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchQuery, page]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(`Status masukan diubah menjadi ${newStatus}.`);
        setFeedbacks((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as FeedbackItem["status"] } : item))
        );
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem((prev) => prev ? { ...prev, status: newStatus as FeedbackItem["status"] } : null);
        }
      } else {
        showToast(data.error || "Gagal memperbarui status.", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/feedback?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Masukan berhasil dihapus.");
        setFeedbacks((prev) => prev.filter((item) => item.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        setDeleteTargetId(null);
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null);
        }
      } else {
        showToast(data.error || "Gagal menghapus masukan.", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan saat menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "bug":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">Laporan Bug</span>;
      case "fitur":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Permintaan Fitur</span>;
      case "saran":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Saran</span>;
      case "kritik":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Kritik</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">Lainnya</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "baru":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>Baru</span>;
      case "dibaca":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Dibaca</span>;
      case "diproses":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Diproses</span>;
      case "selesai":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Selesai</span>;
      default:
        return null;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <AdminShell currentPath="/admin/masukan">
      <div className="space-y-6">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kotak Masukan & Feedback</h1>
            <p className="text-sm text-slate-500 mt-1">
              Pantau saran, kritik, laporan kendala teknis, dan permintaan fitur yang dikirim pengguna melalui halaman publik <code className="text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">/masukan</code>.
            </p>
          </div>
          <button
            onClick={() => fetchFeedbacks()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs"
          >
            <svg className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Segarkan Data
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari pengirim, email, atau isi masukan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-700 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="baru">Baru</option>
                <option value="dibaca">Dibaca</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-700 font-medium"
              >
                <option value="all">Semua Kategori</option>
                <option value="saran">Saran</option>
                <option value="kritik">Kritik</option>
                <option value="bug">Laporan Bug</option>
                <option value="fitur">Permintaan Fitur</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Pengirim & Kontak</div>
            <div className="col-span-2">Kategori</div>
            <div className="col-span-4">Isi Pesan</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Aksi</div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-500">Memuat data masukan...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-3 text-base font-semibold text-slate-800">Tidak ada masukan yang ditemukan</h3>
              <p className="mt-1 text-xs text-slate-500">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Coba ubah kriteria filter atau pencarian Anda."
                  : "Belum ada kiriman formulir dari pengunjung website."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-slate-50/60 transition cursor-pointer ${
                    item.status === "baru" ? "bg-emerald-50/20" : ""
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Sender & Contact */}
                  <div className="md:col-span-3 space-y-0.5">
                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                      {item.name || <span className="text-slate-400 italic font-normal">Anonim (Tanpa Nama)</span>}
                      {item.status === "baru" && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Pesan Baru"></span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {item.email || <span className="text-slate-400 italic">Tanpa Email</span>}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(item.created_at)}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="md:col-span-2">
                    {getCategoryBadge(item.category)}
                  </div>

                  {/* Message snippet */}
                  <div className="md:col-span-4 text-xs text-slate-700 line-clamp-2">
                    {item.message}
                  </div>

                  {/* Status Badge */}
                  <div className="md:col-span-1">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Quick Actions */}
                  <div
                    className="md:col-span-2 flex items-center justify-start md:justify-end gap-2 pt-2 md:pt-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={item.status}
                      disabled={updatingId === item.id}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="baru">Baru</option>
                      <option value="dibaca">Dibaca</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                    </select>

                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      title="Hapus Masukan"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Menampilkan halaman {page} dari {totalPages} ({totalCount} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Detail Masukan */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(selectedItem.category)}
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {selectedItem.name || "Anonim (Tanpa Nama)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedItem.email || "Pengirim tidak menyertakan email kontak"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedItem.message}
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Waktu Pengiriman:</span>
                  <span className="font-medium text-slate-700">{formatDate(selectedItem.created_at)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Alamat IP:</span>
                  <span className="font-mono text-slate-700">{selectedItem.ip_address || "Tidak tercatat"}</span>
                </div>
              </div>

              {/* Status Update & Actions in Detail */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Ubah Status:</span>
                  <select
                    value={selectedItem.status}
                    onChange={(e) => handleStatusChange(selectedItem.id, e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium"
                  >
                    <option value="baru">Baru</option>
                    <option value="dibaca">Dibaca</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteTargetId(selectedItem.id);
                    }}
                    className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">Hapus Masukan Ini?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pesan masukan ini akan dihapus secara permanen dari database Supabase.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteTargetId)}
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


import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Layers,
  Image as ImageIcon,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/config/site";

export default async function AdminDashboardPage() {
  let totalFeedback = 0;
  let unreadFeedback = 0;
  let totalContent = 0;
  let recentFeedbacks: Array<{
    id: string;
    name: string | null;
    category: string;
    message: string;
    status: string;
    created_at: string;
  }> = [];
  let isSupabaseConnected = false;

  try {
    const supabase = await createClient();
    if (supabase) {
      isSupabaseConnected = true;

      // Hitung total feedback
      const { count: feedbackCount } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true });
      totalFeedback = feedbackCount || 0;

      // Hitung feedback baru
      const { count: unreadCount } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true })
        .eq("status", "baru");
      unreadFeedback = unreadCount || 0;

      // Hitung content blocks
      const { count: contentCount } = await supabase
        .from("site_content")
        .select("*", { count: "exact", head: true });
      totalContent = contentCount || 0;

      // Ambil 5 feedback terbaru
      const { data: latestFeedbacks } = await supabase
        .from("feedback")
        .select("id, name, category, message, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (latestFeedbacks) {
        recentFeedbacks = latestFeedbacks;
      }
    }
  } catch {
    isSupabaseConnected = false;
  }

  const statCards = [
    {
      title: "Total Saran & Masukan",
      value: totalFeedback,
      sublabel: `${unreadFeedback} masukan baru belum dibaca`,
      icon: MessageSquare,
      color: "from-blue-600 to-indigo-700",
      href: "/admin/masukan",
    },
    {
      title: "Masukan Belum Dibaca",
      value: unreadFeedback,
      sublabel: "Memerlukan perhatian admin",
      icon: AlertCircle,
      color: "from-amber-500 to-amber-700",
      href: "/admin/masukan?status=baru",
    },
    {
      title: "Blok Konten Dikelola",
      value: totalContent || 4,
      sublabel: "Tersinkronisasi ke database",
      icon: FileText,
      color: "from-emerald-600 to-forest-900",
      href: "/admin/konten",
    },
    {
      title: "Versi Rilis Terkini",
      value: `v${SITE_CONFIG.release.latestVersion}`,
      sublabel: "Windows 10/11 64-bit",
      icon: Layers,
      color: "from-slate-700 to-slate-900",
      href: "/admin/pengaturan",
    },
  ];

  const quickNav = [
    {
      title: "Kelola Konten Halaman",
      description: "Sunting teks judul, subjudul, deskripsi, dan tombol aksi seluruh halaman publik.",
      icon: FileText,
      href: "/admin/konten",
      badge: "CMS Utama",
    },
    {
      title: "Pustaka Media & Gambar",
      description: "Unggah tangkapan layar antarmuka, logo, dan ikon ke bucket storage Supabase.",
      icon: ImageIcon,
      href: "/admin/media",
      badge: "Storage",
    },
    {
      title: "Tinjau Saran & Masukan",
      description: "Baca aspirasi, laporan bug, kritik, dan permintaan fitur dari pengunjung sekolah.",
      icon: MessageSquare,
      href: "/admin/masukan",
      badge: unreadFeedback > 0 ? `${unreadFeedback} Baru` : "Feedback",
    },
    {
      title: "Pengaturan & Tautan Saweria",
      description: "Atur konfigurasi umum, akun Saweria, profil pengembang, dan tautan rilis biner.",
      icon: Settings,
      href: "/admin/pengaturan",
      badge: "Konfigurasi",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Administrator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Selamat datang di pusat pengelolaan konten dan komunikasi website resmi KRONABEL.
          </p>
        </div>

        {/* Database Connection Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm self-start sm:self-auto">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isSupabaseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="text-slate-700">
            {isSupabaseConnected ? "Supabase Terhubung" : "Mode Standalone (Fallback Aktif)"}
          </span>
        </div>
      </div>

      {/* Connection Notice if Not Connected */}
      {!isSupabaseConnected && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Kredensial Supabase Belum Lengkap di Server
            </h3>
            <p className="text-xs text-amber-900/90 leading-relaxed max-w-3xl">
              Website publik tetap berjalan 100% normal menggunakan data fallback. Untuk mengaktifkan CMS dinamis dan penyimpanan feedback permanen, tambahkan <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>SUPABASE_SERVICE_ROLE_KEY</code> pada konfigurasi environment server/Vercel.
            </p>
          </div>
          <Link
            href="/admin/pengaturan"
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Petunjuk Setup
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{card.sublabel}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Navigation Sections */}
      <div>
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
          Akses Cepat Pengelolaan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-700/50 transition-all group flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Aktivitas Saran & Masukan Terbaru</h2>
            <p className="text-xs text-slate-500">Pesan dari pengunjung yang baru masuk ke sistem</p>
          </div>
          <Link
            href="/admin/masukan"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentFeedbacks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentFeedbacks.map((fb) => (
              <div key={fb.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {fb.name || "Anonim"}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {fb.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(fb.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {fb.message}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${
                    fb.status === "baru"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {fb.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">Belum ada saran atau masukan pengunjung yang masuk.</p>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Database, RefreshCw, Server } from "lucide-react";

interface SetupStatus {
  configured: boolean;
  connected?: boolean;
  projectHost?: string;
  hasSetupSecret?: boolean;
  adminCount?: number;
  isSetupLocked?: boolean;
  userGuidance?: string;
  errorCategory?: string;
  code?: string | null;
  message?: string | null;
  error?: string;
}

export default function AdminSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupSecret, setSetupSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const checkStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/admin/setup");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({
        configured: false,
        error: "Gagal menghubungi server aplikasi.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Kata sandi minimal 8 karakter demi keamanan.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, setupSecret }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal melakukan inisialisasi akun administrator.");
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || "Akun administrator berhasil dibuat!");
      setTimeout(() => {
        router.push("/admin/login");
      }, 2500);
    } catch {
      setErrorMessage("Terjadi kesalahan koneksi. Pastikan server Supabase aktif.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-ivory-100 via-ivory-50 to-emerald-50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inisialisasi Akun Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftarkan akun administrator utama pertama untuk KRONABEL CMS.
          </p>
        </div>

        {/* Diagnostic Status Box */}
        {statusLoading ? (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Memeriksa status koneksi database Supabase...</span>
          </div>
        ) : status && status.connected ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Database Terhubung</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Target Project: <code className="font-mono bg-emerald-100/70 px-1 py-0.5 rounded">{status.projectHost}</code>
            </p>
          </div>
        ) : status && !status.connected ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Koneksi Database Terkendala</span>
              </div>
              <button
                type="button"
                onClick={checkStatus}
                className="inline-flex items-center gap-1 text-[11px] text-red-700 hover:text-red-900 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Cek Ulang</span>
              </button>
            </div>
            {status.projectHost && (
              <p className="text-[11px] text-slate-600">
                Project terpasang di Vercel: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-200 text-slate-800 font-semibold">{status.projectHost}</code>
              </p>
            )}
            {status.userGuidance && (
              <p className="leading-relaxed text-[11px] text-red-800 font-medium bg-white/70 p-2 rounded-xl border border-red-100">
                {status.userGuidance}
              </p>
            )}
            {status.code && (
              <p className="text-[10px] text-slate-500 font-mono">
                Error Code: {status.code}
              </p>
            )}
          </div>
        ) : null}

        {/* Notice Info Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>Perhatian Keamanan:</span>
          </p>
          <p className="leading-relaxed text-amber-900">
            Halaman ini hanya dapat digunakan <strong>satu kali</strong> saat sistem belum memiliki administrator. Setelah akun pertama dibuat, formulir ini akan dinonaktifkan secara permanen.
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMessage} Mengalihkan ke halaman login...</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSetup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Username Tampilan
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.anda@sekolah.sch.id"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Ulangi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              Setup Secret Token (Opsional, jika diatur di .env)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={setupSecret}
                onChange={(e) => setSetupSecret(e.target.value)}
                placeholder="Isi jika variabel ADMIN_SETUP_SECRET diatur"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            <span>{loading ? "Memproses Inisialisasi..." : "Buat Akun Administrator"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center space-y-1.5">
          <Link
            href="/admin/login"
            className="text-xs font-bold text-slate-600 hover:text-emerald-800 block"
          >
            Sudah memiliki akun? Masuk di sini &rarr;
          </Link>
          <Link
            href="/"
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 block"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}


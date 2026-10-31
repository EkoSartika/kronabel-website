"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "unauthorized"
      ? "Sesi Anda tidak memiliki izin administrator."
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal masuk. Periksa email dan kata sandi Anda.");
        setLoading(false);
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan. Pastikan koneksi internet stabil.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-8 text-white text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4 text-gold-300">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">KRONABEL CMS</h1>
        <p className="text-xs text-emerald-100/80 mt-1">
          Panel Manajemen Konten & Operasional Website
        </p>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kronabel.id"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info & initial setup link */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-500">
            Belum mengatur akun admin pertama kali?{" "}
            <Link
              href="/admin/setup"
              className="font-bold text-emerald-800 hover:underline"
            >
              Konfigurasi Awal
            </Link>
          </p>
          <Link
            href="/"
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 block"
          >
            &larr; Kembali ke Website Publik
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-slate-500">Memuat formulir masuk...</p>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

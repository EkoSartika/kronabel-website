"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle, Bug, Sparkles, MessageCircle, Shield } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("saran");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Anti-spam

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (honeypot) {
      // Spam bot triggered
      setSuccess(true);
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage("Isi pesan masukan minimal 10 karakter.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          category,
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage(data.error || "Gagal mengirim masukan. Silakan coba kembali sesaat lagi.");
      }
    } catch {
      setErrorMessage("Terjadi kendala koneksi saat mengirim formulir.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "saran", label: "Saran", icon: Sparkles, desc: "Ide perbaikan alur atau kenyamanan penggunaan" },
    { id: "fitur", label: "Permintaan Fitur", icon: MessageSquare, desc: "Usulan fungsi baru untuk jadwal atau audio" },
    { id: "bug", label: "Laporan Bug", icon: Bug, desc: "Kendala teknis atau galat sistem saat aplikasi berjalan" },
    { id: "kritik", label: "Kritik", icon: MessageCircle, desc: "Evaluasi obyektif untuk kemajuan software" },
    { id: "lainnya", label: "Lainnya", icon: HelpCircle, desc: "Pertanyaan atau masukan seputar proyek KRONABEL" },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            Kotak Suara Pengguna
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Saran & Masukan <span className="text-emerald-800">{SITE_CONFIG.brandName}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Suara Anda sangat berharga bagi kami. Sampaikan evaluasi, laporan kendala teknis, atau permintaan fitur untuk menyempurnakan aplikasi bel sekolah otomatis ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200">
            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Terima Kasih Atas Masukan Anda!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Pesan Anda telah berhasil tersimpan dan akan segera ditinjau oleh tim pengembang untuk penyempurnaan rilis KRONABEL berikutnya.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition shadow-sm"
                  >
                    Kirim Masukan Lainnya
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                {/* Honeypot field (hidden from view) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Website</label>
                  <input
                    type="text"
                    id="website_url"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">
                    Pilih Kategori Masukan <span className="text-emerald-700">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-start gap-3 ${
                            isSelected
                              ? "bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20"
                              : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl shrink-0 transition ${
                              isSelected ? "bg-emerald-700 text-white" : "bg-white text-slate-500 border border-slate-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">{cat.label}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cat.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama / Sekolah <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pak Budi / SMPN 1 Maju"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Alamat Email <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Untuk balasan jika diperlukan"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={100}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Uraian Pesan / Deskripsi Kendala <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {message.length} / 2000 karakter
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Tuliskan saran, langkah terjadinya bug, pesan error yang muncul, atau fitur yang Anda harapkan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={2000}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition resize-y"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Untuk laporan bug, cantumkan spesifikasi Windows (misal Windows 10 64-bit) dan nama file audio yang digunakan jika relevan.
                  </p>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 disabled:opacity-50 transition shadow-sm"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Mengirimkan Masukan...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirimkan Masukan Sekarang
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Jaminan Privasi Pengguna</h3>
                  <p className="text-xs text-slate-500">Kerahasiaan data Anda terlindungi</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informasi identitas dan email yang Anda cantumkan hanya digunakan untuk keperluan klarifikasi teknis pengembangan KRONABEL. Kami tidak akan pernah membagikan atau mempublikasikan data Anda.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                Mengalami Kendala Teknis?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sebelum mengirim laporan, Anda dapat memeriksa modul pemecahan masalah resmi di halaman panduan.
              </p>
              <div className="pt-2">
                <Link
                  href="/panduan#troubleshooting"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
                >
                  Buka Modul Troubleshooting &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


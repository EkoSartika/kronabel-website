import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_CONFIG } from "@/config/site";
import { Heart, Shield, Laptop, FileText, Download, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-forest-900/10 bg-ivory-muted pt-14 pb-10 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Kolom 1: Profil & Filosofi */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" />

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-forest-900">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-forest-100/80 px-2.5 py-1 text-forest-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-forest-700" /> Sistem Bel Otomatis
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-forest-100/80 px-2.5 py-1 text-forest-800">
                <Shield className="h-3.5 w-3.5 text-forest-700" /> Presisi &amp; Terjadwal
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gold-100 px-2.5 py-1 text-gold-900">
                <Heart className="h-3.5 w-3.5 fill-gold-600 text-gold-600" /> Dukungan Sukarela
              </span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-950">
              Navigasi Halaman
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm font-medium">
              {SITE_CONFIG.footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-forest-900 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Dukungan & Model Distribusi */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-forest-950">
              Dukungan Sukarela
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Aplikasi ini dikembangkan untuk memajukan ketertiban operasional sekolah di Indonesia tanpa sistem langganan.
            </p>
            <div className="mt-4">
              <Link
                href="/dukungan"
                className="inline-flex items-center gap-2 rounded-lg border border-gold-600/30 bg-gold-100/80 px-3.5 py-2 text-xs font-bold text-gold-900 hover:bg-gold-200 transition-all"
              >
                <Heart className="h-3.5 w-3.5 fill-gold-600 text-gold-600" />
                <span>Beri Donasi via Saweria</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer Merek & Copyright */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© 2026 {SITE_CONFIG.brandName}. Semua hak dilindungi.</p>
            <p className="max-w-2xl text-[11px] leading-relaxed italic text-slate-500">
              * {SITE_CONFIG.brandDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};


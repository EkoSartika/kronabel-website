"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_CONFIG } from "@/config/site";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="border-t border-forest-900/10 bg-ivory-muted pt-14 pb-10 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Kolom 1: Profil & Filosofi */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" />

            <div className="pt-2">
              <Link
                href="/unduh"
                className="group block overflow-hidden rounded-xl border border-forest-900/15 bg-white p-1.5 shadow-sm transition-all hover:border-forest-900/30 hover:shadow-md max-w-sm"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-forest-950">
                  <Image
                    src="/images/screenshot_real_compact.png"
                    alt="Tampilan Antarmuka Aplikasi KRONABEL"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
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
              Dukungan Pengembang
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Aplikasi ini dikembangkan untuk memajukan ketertiban operasional sekolah di Indonesia tanpa sistem langganan.
            </p>
            <div className="mt-4">
              <a
                href={SITE_CONFIG.donation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gold-600/30 bg-gold-100/80 px-3.5 py-2 text-xs font-bold text-gold-900 hover:bg-gold-200 transition-all shadow-sm"
              >
                <Heart className="h-3.5 w-3.5 fill-gold-600 text-gold-600" />
                <span>Dukung Pengembang</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© 2026 {SITE_CONFIG.brandName}. Semua hak dilindungi.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};


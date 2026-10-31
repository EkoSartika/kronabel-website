"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_CONFIG } from "@/config/site";
import { Download, Heart, Menu, X, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-forest-900/10 bg-ivory-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {SITE_CONFIG.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-forest-900/10 text-forest-900 font-bold"
                  : "text-slate-700 hover:bg-forest-900/5 hover:text-forest-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/dukungan"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold-600/40 bg-gold-100/70 px-3.5 py-2 text-xs font-bold text-gold-900 transition-all hover:bg-gold-200 hover:shadow-sm"
          >
            <Heart className="h-3.5 w-3.5 fill-gold-600 text-gold-600" />
            <span>Dukung Pengembang</span>
          </Link>

          <Link
            href="/unduh"
            className="inline-flex items-center gap-2 rounded-lg bg-forest-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-forest-800 hover:shadow-md"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Unduh v{SITE_CONFIG.release.latestVersion}</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-forest-900/5 focus:outline-none"
            aria-label="Buka Menu Navigasi"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-forest-900/10 bg-ivory-50 px-4 pb-5 pt-2 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1.5">
            {SITE_CONFIG.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-forest-900/10 text-forest-900 font-bold"
                    : "text-slate-700 hover:bg-forest-900/5"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Link
                href="/dukungan"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-gold-600/40 bg-gold-100 py-2.5 text-sm font-bold text-gold-900"
              >
                <Heart className="h-4 w-4 fill-gold-600 text-gold-600" />
                <span>Dukung via Saweria</span>
              </Link>

              <Link
                href="/unduh"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-sm font-bold text-white shadow"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Gratis (v{SITE_CONFIG.release.latestVersion})</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};


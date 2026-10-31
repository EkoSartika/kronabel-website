"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Shield,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
  currentPath?: string;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/setup";

  // Ambil unread feedback count untuk badge sidebar
  useEffect(() => {
    if (isAuthPage) return;

    async function fetchBadge() {
      try {
        const res = await fetch("/api/admin/feedback?limit=1");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // Abaikan jika server belum terhubung
      }
    }

    fetchBadge();
  }, [isAuthPage, pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Jika halaman login atau setup, tampilkan halaman penuh tanpa sidebar dashboard
  if (isAuthPage) {
    return <div className="min-h-screen bg-ivory-100">{children}</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Kelola Konten", href: "/admin/konten", icon: FileText },
    { name: "Halaman", href: "/admin/halaman", icon: Layers },
    { name: "Pustaka Media", href: "/admin/media", icon: ImageIcon },
    {
      name: "Saran & Masukan",
      href: "/admin/masukan",
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between bg-forest-950 text-white px-4 py-3 border-b border-forest-900 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center font-black text-sm border border-gold-500/40">
            K
          </div>
          <div>
            <span className="font-black tracking-wider text-sm block">KRONABEL</span>
            <span className="text-[10px] text-gold-300 font-medium -mt-1 block">Admin CMS</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-forest-900 text-slate-200 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-forest-950 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-forest-900 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-forest-900 hidden lg:flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 text-forest-950 flex items-center justify-center font-black text-base shadow-md">
                K
              </div>
              <div>
                <span className="font-black tracking-wider text-base text-white block">KRONABEL</span>
                <span className="text-[11px] text-gold-400 font-semibold tracking-wide uppercase block">Content System</span>
              </div>
            </Link>
          </div>

          {/* Quick External Link to Live Site */}
          <div className="px-4 py-3 border-b border-forest-900/60">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-forest-900/40 hover:bg-forest-900 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span>Lihat Website Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gold-500 text-forest-950 font-bold shadow-sm"
                      : "text-slate-300 hover:bg-forest-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-forest-950" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-forest-950 text-gold-300"
                          : "bg-amber-400 text-forest-950"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="p-4 border-t border-forest-900 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-forest-900/40 text-xs">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="font-bold text-white block truncate">Administrator</span>
              <span className="text-[10px] text-slate-400 block truncate">admin@kronabel</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:text-white hover:bg-red-500/20 border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;

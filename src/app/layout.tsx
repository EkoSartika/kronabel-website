import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE_CONFIG } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.brandName}`,
  },
  description: `${SITE_CONFIG.brandSubtitle}. ${SITE_CONFIG.description}`,
  keywords: [
    "Bel Sekolah Otomatis",
    "KRONABEL",
    "Bel Otomatis Windows",
    "Jadwal Bel Sekolah",
    "Software Bel Sekolah Gratis",
    "Bel Sekolah Ramadan Ujian",
    "Aplikasi Sekolah Indonesia",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  icons: {
    icon: "/images/app_icon.png",
    shortcut: "/images/app_icon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_CONFIG.brandName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-screen bg-ivory-50 text-slate-800 antialiased flex flex-col justify-between selection:bg-gold-200 selection:text-gold-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


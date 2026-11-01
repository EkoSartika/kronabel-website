import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE_CONFIG } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.brandSubtitle} Windows (Gratis & Offline)`,
    template: `%s | ${SITE_CONFIG.brandName}`,
  },
  description: `${SITE_CONFIG.brandSubtitle} untuk PC Windows 10 & 11 (64-bit). ${SITE_CONFIG.description}`,
  keywords: [
    "aplikasi bel sekolah otomatis",
    "software bel sekolah otomatis",
    "aplikasi bel sekolah gratis",
    "bel sekolah otomatis Windows",
    "aplikasi bel sekolah offline",
    "download aplikasi bel sekolah",
    "bel sekolah otomatis",
    "jadwal bel sekolah",
    "bel sekolah MP3 WAV",
    "KRONABEL",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.brandName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_CONFIG.siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-kronabel.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/logo-kronabel.png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.brandName,
    title: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.brandSubtitle} Windows`,
    description: `Download ${SITE_CONFIG.brandName}, software bel sekolah otomatis gratis untuk Windows 10 & 11 (64-bit). 100% offline, presisi, mendukung MP3/WAV, dan tanpa biaya langganan.`,
    images: [
      {
        url: "/images/screenshot_real_compact.png",
        width: 1280,
        height: 720,
        alt: "Antarmuka Aplikasi Bel Sekolah Otomatis KRONABEL Windows",
      },
      {
        url: "/logo-kronabel.png",
        width: 1254,
        height: 1254,
        alt: "Logo Resmi KRONABEL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.brandName} — ${SITE_CONFIG.brandSubtitle} Windows`,
    description: `Software bel sekolah otomatis gratis untuk Windows 10 & 11 (64-bit). Bekerja 100% offline, praktis, dan tanpa biaya langganan.`,
    images: ["/images/screenshot_real_compact.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable}`}>
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2430722067128619"
          crossOrigin="anonymous"
        />
        <JsonLd />
      </head>
      <body className="min-h-screen bg-ivory-50 text-slate-800 antialiased flex flex-col justify-between selection:bg-gold-200 selection:text-gold-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `Kirim Saran & Masukan - ${SITE_CONFIG.brandName} Bel Sekolah Otomatis`,
  description: `Sampaikan saran, kritik, laporan kendala teknis, atau usulan fitur untuk pengembangan aplikasi bel sekolah otomatis Windows ${SITE_CONFIG.brandName}.`,
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/masukan`,
  },
  openGraph: {
    title: `Kirim Saran & Masukan - ${SITE_CONFIG.brandName} Bel Sekolah Otomatis`,
    description: `Sampaikan saran, kritik, atau usulan fitur untuk pengembangan software bel sekolah otomatis ${SITE_CONFIG.brandName}.`,
    url: `${SITE_CONFIG.siteUrl}/masukan`,
    images: [
      {
        url: "/images/screenshot_real_compact.png",
        width: 1280,
        height: 720,
        alt: `Saran & Masukan ${SITE_CONFIG.brandName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Saran & Masukan - ${SITE_CONFIG.brandName}`,
    description: `Formulir umpan balik dan laporan kendala aplikasi bel sekolah otomatis Windows KRONABEL.`,
    images: ["/images/screenshot_real_compact.png"],
  },
};

export default function MasukanPage() {
  return <FeedbackForm />;
}

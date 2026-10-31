import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `Saran & Masukan - ${SITE_CONFIG.brandName}`,
  description: `Sampaikan saran, kritik, laporan kendala teknis, atau permintaan fitur untuk pengembangan aplikasi bel sekolah otomatis ${SITE_CONFIG.brandName}.`,
  alternates: {
    canonical: "/masukan",
  },
  openGraph: {
    title: `Saran & Masukan - ${SITE_CONFIG.brandName}`,
    description: `Sampaikan saran, kritik, laporan kendala teknis, atau permintaan fitur untuk ${SITE_CONFIG.brandName}.`,
    url: "/masukan",
  },
};

export default function MasukanPage() {
  return <FeedbackForm />;
}

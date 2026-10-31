import React from "react";
import { SITE_CONFIG } from "@/config/site";

export function JsonLd() {
  const structuredData = [
    // 1. SoftwareApplication Schema
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": SITE_CONFIG.brandName,
      "alternateName": "Aplikasi Bel Sekolah Otomatis KRONABEL",
      "operatingSystem": SITE_CONFIG.targetOS,
      "applicationCategory": "EducationalApplication",
      "applicationSubCategory": "School Bell Scheduler",
      "softwareVersion": SITE_CONFIG.release.latestVersion,
      "datePublished": "2026-10-29",
      "inLanguage": "id-ID",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR",
        "availability": "https://schema.org/InStock",
      },
      "description":
        "Aplikasi bel sekolah otomatis desktop Windows untuk membunyikan jadwal pelajaran secara presisi, handal, dan bekerja 100% offline.",
      "downloadUrl": SITE_CONFIG.release.installer.downloadUrl,
      "fileFormat": "application/x-msdownload",
      "fileSize": SITE_CONFIG.release.installer.size,
      "screenshot": `${SITE_CONFIG.siteUrl}/images/screenshot_real_compact.png`,
      "url": SITE_CONFIG.siteUrl,
      "author": {
        "@type": "Organization",
        "name": SITE_CONFIG.brandName,
        "url": SITE_CONFIG.siteUrl,
      },
    },
    // 2. Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SITE_CONFIG.brandName,
      "url": SITE_CONFIG.siteUrl,
      "logo": `${SITE_CONFIG.siteUrl}/images/app_icon.png`,
      "description":
        "Pengembang perangkat lunak bel sekolah otomatis Windows gratis dan mandiri untuk institusi pendidikan di Indonesia.",
    },
    // 3. WebSite Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_CONFIG.brandName,
      "url": SITE_CONFIG.siteUrl,
      "inLanguage": "id-ID",
      "description": SITE_CONFIG.description,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}


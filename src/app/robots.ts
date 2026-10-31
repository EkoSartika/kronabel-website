import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export const revalidate = 86400; // Cache robots.txt selama 24 jam untuk Vercel Edge Cache

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
    host: SITE_CONFIG.siteUrl,
  };
}


import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('KRONABEL Website — Technical SEO Audit', () => {
  const robotsPath = path.resolve('src/app/robots.ts');
  const sitemapPath = path.resolve('src/app/sitemap.ts');
  const layoutPath = path.resolve('src/app/layout.tsx');
  const jsonLdPath = path.resolve('src/components/JsonLd.tsx');

  // 1. Robots.txt rules verification
  test('1. robots.ts mengizinkan akses publik dan memblokir /admin/ dan /api/', () => {
    assert.ok(fs.existsSync(robotsPath), 'src/app/robots.ts must exist');
    const content = fs.readFileSync(robotsPath, 'utf8');

    assert.ok(content.includes('allow: "/"'), 'Must allow root access');
    assert.ok(content.includes('disallow: ["/admin/", "/api/"]'), 'Must disallow /admin/ and /api/');
    assert.ok(content.includes('sitemap.xml'), 'Must point to sitemap.xml');
  });

  // 2. Sitemap.xml pages verification
  test('2. sitemap.ts memuat seluruh halaman publik dan mengecualikan area admin/api', () => {
    assert.ok(fs.existsSync(sitemapPath), 'src/app/sitemap.ts must exist');
    const content = fs.readFileSync(sitemapPath, 'utf8');

    // Required pages in sitemap
    const publicPages = [
      'url: `${baseUrl}`',
      'url: `${baseUrl}/unduh`',
      'url: `${baseUrl}/panduan`',
      'url: `${baseUrl}/riwayat-versi`',
      'url: `${baseUrl}/tentang`',
      'url: `${baseUrl}/dukungan`',
      'url: `${baseUrl}/masukan`',
      'url: `${baseUrl}/privasi`',
    ];

    for (const page of publicPages) {
      assert.ok(content.includes(page), `Sitemap must include: ${page}`);
    }

    // Must NOT contain internal routes
    assert.ok(!content.includes('/admin'), 'Sitemap must not contain /admin');
    assert.ok(!content.includes('/api'), 'Sitemap must not contain /api');
    assert.ok(!content.includes('/setup'), 'Sitemap must not contain /setup');
    assert.ok(!content.includes('/login'), 'Sitemap must not contain /login');
  });

  // 3. Metadata OpenGraph, Twitter, Canonical & Robots in RootLayout
  test('3. RootLayout memuat metadata OpenGraph, Twitter Card, Canonical URL, dan Robots', () => {
    assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx must exist');
    const content = fs.readFileSync(layoutPath, 'utf8');

    assert.ok(content.includes('metadataBase: new URL(SITE_CONFIG.siteUrl)'), 'Must configure metadataBase');
    assert.ok(content.includes('canonical: SITE_CONFIG.siteUrl'), 'Must set canonical URL');
    assert.ok(content.includes('openGraph:'), 'Must configure Open Graph metadata');
    assert.ok(content.includes('locale: "id_ID"'), 'Must set locale to id_ID');
    assert.ok(content.includes('twitter:'), 'Must configure Twitter card metadata');
    assert.ok(content.includes('summary_large_image'), 'Must use summary_large_image card');
    assert.ok(content.includes('googleBot:'), 'Must configure googleBot directives');
    assert.ok(content.includes('<JsonLd />'), 'Must inject Schema.org JsonLd in head');
  });

  // 4. Schema.org JSON-LD Structured Data
  test('4. Schema.org JSON-LD memuat SoftwareApplication, Organization, dan WebSite yang valid', () => {
    assert.ok(fs.existsSync(jsonLdPath), 'src/components/JsonLd.tsx must exist');
    const content = fs.readFileSync(jsonLdPath, 'utf8');

    assert.ok(content.includes('"@type": "SoftwareApplication"'), 'Must declare SoftwareApplication schema');
    assert.ok(content.includes('"@type": "Organization"'), 'Must declare Organization schema');
    assert.ok(content.includes('"@type": "WebSite"'), 'Must declare WebSite schema');
    assert.ok(content.includes('"applicationCategory": "EducationalApplication"'), 'Must set applicationCategory');
    assert.ok(content.includes('"price": "0"'), 'Must declare free price offer');
    assert.ok(content.includes('inLanguage'), 'Must declare language');
  });
});

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('KRONABEL Website — Official Logo & Favicon Integration', () => {
  const logoPath = path.resolve('public/logo-kronabel.png');
  const faviconIcoPath = path.resolve('public/favicon.ico');
  const icon48Path = path.resolve('public/icon-48.png');
  const icon96Path = path.resolve('public/icon-96.png');
  const icon192Path = path.resolve('public/icon-192.png');
  const appleIconPath = path.resolve('public/apple-icon.png');
  const brandLogoPath = path.resolve('src/components/BrandLogo.tsx');
  const layoutPath = path.resolve('src/app/layout.tsx');
  const jsonLdPath = path.resolve('src/components/JsonLd.tsx');

  test('1. Master logo resmi dan aset icon resolusi tinggi tersedia di public/', () => {
    assert.ok(fs.existsSync(logoPath), 'public/logo-kronabel.png harus tersedia');
    assert.ok(fs.statSync(logoPath).size > 100000, 'Master logo harus berukuran penuh/resolusi tinggi');

    assert.ok(fs.existsSync(faviconIcoPath), 'public/favicon.ico harus tersedia');
    assert.ok(fs.statSync(faviconIcoPath).size > 1000, 'favicon.ico harus valid');

    assert.ok(fs.existsSync(icon48Path), 'public/icon-48.png harus tersedia');
    assert.ok(fs.existsSync(icon96Path), 'public/icon-96.png harus tersedia');
    assert.ok(fs.existsSync(icon192Path), 'public/icon-192.png harus tersedia');
    assert.ok(fs.existsSync(appleIconPath), 'public/apple-icon.png harus tersedia');
  });

  test('2. BrandLogo menggunakan logo resmi KRONABEL dengan Next Image', () => {
    assert.ok(fs.existsSync(brandLogoPath), 'src/components/BrandLogo.tsx harus ada');
    const content = fs.readFileSync(brandLogoPath, 'utf8');

    assert.ok(content.includes('src="/logo-kronabel.png"'), 'BrandLogo harus menggunakan /logo-kronabel.png');
    assert.ok(content.includes('alt='), 'BrandLogo harus memiliki alt text untuk aksesibilitas');
    assert.ok(content.includes('object-contain'), 'BrandLogo harus mempertahankan rasio proporsional');
  });

  test('3. RootLayout mengonfigurasi favicon, icons, dan OpenGraph logo', () => {
    assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx harus ada');
    const content = fs.readFileSync(layoutPath, 'utf8');

    assert.ok(content.includes('url: "/favicon.ico"'), 'Layout harus menyertakan favicon.ico');
    assert.ok(content.includes('url: "/icon-48.png"'), 'Layout harus menyertakan icon-48.png untuk Google Search');
    assert.ok(content.includes('url: "/icon-96.png"'), 'Layout harus menyertakan icon-96.png');
    assert.ok(content.includes('url: "/icon-192.png"'), 'Layout harus menyertakan icon-192.png');
    assert.ok(content.includes('url: "/logo-kronabel.png"'), 'OpenGraph harus menyertakan logo resmi');
  });

  test('4. Schema.org JSON-LD menggunakan logo resmi KRONABEL', () => {
    assert.ok(fs.existsSync(jsonLdPath), 'src/components/JsonLd.tsx harus ada');
    const content = fs.readFileSync(jsonLdPath, 'utf8');

    assert.ok(content.includes('/logo-kronabel.png'), 'Organization logo harus mengarah ke /logo-kronabel.png');
  });
});


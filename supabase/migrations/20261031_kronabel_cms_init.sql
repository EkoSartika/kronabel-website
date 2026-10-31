-- =============================================================================
-- KRONABEL CMS & FEEDBACK SYSTEM - SUPABASE INITIAL MIGRATION
-- File: supabase/migrations/20261031_kronabel_cms_init.sql
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL ADMIN USERS
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. TABEL SITE CONTENT
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    title TEXT,
    content JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. TABEL FEEDBACK (SARAN & MASUKAN)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    category TEXT NOT NULL CHECK (category IN ('saran', 'kritik', 'bug', 'fitur', 'lainnya')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru', 'dibaca', 'diproses', 'selesai')),
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL CONTENT HISTORY (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.content_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_key TEXT NOT NULL,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content JSONB NOT NULL,
    status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_content_page ON public.site_content(page);
CREATE INDEX IF NOT EXISTS idx_site_content_status ON public.site_content(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_history_key ON public.content_history(content_key);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
END;
$$;

-- RLS: admin_users
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update own admin profile" ON public.admin_users;
CREATE POLICY "Admins can update own admin profile"
ON public.admin_users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- RLS: site_settings
DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;
CREATE POLICY "Public can view public site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- RLS: site_content
DROP POLICY IF EXISTS "Public can view published content" ON public.site_content;
CREATE POLICY "Public can view published content"
ON public.site_content FOR SELECT
TO anon, authenticated
USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all site content" ON public.site_content;
CREATE POLICY "Admins can manage all site content"
ON public.site_content FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- RLS: feedback
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;
CREATE POLICY "Anyone can insert feedback"
ON public.feedback FOR INSERT
TO anon, authenticated
WITH CHECK (
    message IS NOT NULL AND
    length(message) >= 5 AND
    length(message) <= 3000
);

DROP POLICY IF EXISTS "Only admins can view feedback" ON public.feedback;
CREATE POLICY "Only admins can view feedback"
ON public.feedback FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update or delete feedback" ON public.feedback;
CREATE POLICY "Only admins can update or delete feedback"
ON public.feedback FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete feedback" ON public.feedback;
CREATE POLICY "Only admins can delete feedback"
ON public.feedback FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS: content_history
DROP POLICY IF EXISTS "Only admins can view content history" ON public.content_history;
CREATE POLICY "Only admins can view content history"
ON public.content_history FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can insert content history" ON public.content_history;
CREATE POLICY "Only admins can insert content history"
ON public.content_history FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- =============================================================================
-- STORAGE BUCKET: website-media
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'website-media',
    'website-media',
    true,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];

-- Storage Policies
DROP POLICY IF EXISTS "Public can view website media" ON storage.objects;
CREATE POLICY "Public can view website media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Admins can upload website media" ON storage.objects;
CREATE POLICY "Admins can upload website media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'website-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update website media" ON storage.objects;
CREATE POLICY "Admins can update website media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'website-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete website media" ON storage.objects;
CREATE POLICY "Admins can delete website media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'website-media' AND public.is_admin());

-- =============================================================================
-- SEED DATA (DEFAULT CONTENT & SETTINGS)
-- =============================================================================

INSERT INTO public.site_settings (key, value, description)
VALUES 
(
    'general',
    '{
        "brandName": "KRONABEL",
        "brandSubtitle": "Aplikasi Bel Sekolah Otomatis",
        "tagline": "Bel Otomatis, Waktu Lebih Teratur.",
        "siteUrl": "https://kronabel.vercel.app",
        "targetOS": "Windows 10 & Windows 11 (64-bit)",
        "author": "Pengembang KRONABEL"
    }'::jsonb,
    'Pengaturan umum identitas website'
),
(
    'donation',
    '{
        "platform": "Saweria",
        "url": "https://saweria.co/sartikamuhammadeko",
        "status": "active",
        "label": "Dukung Pengembang",
        "description": "KRONABEL 100% gratis digunakan untuk seluruh sekolah di Indonesia tanpa biaya lisensi maupun langganan. Jika Anda merasa aplikasi ini bermanfaat, Anda dapat memberikan dukungan untuk keberlanjutan pengembangan."
    }'::jsonb,
    'Konfigurasi donasi sukarela Saweria'
),
(
    'release',
    '{
        "latestVersion": "1.2.2",
        "releaseDate": "29 Oktober 2026",
        "framework": "Python 3.11.9 + PySide6 (Qt 6.12 Native)",
        "architecture": "Windows x64 (64-bit)",
        "githubReleaseUrl": "https://github.com/EkoSartika/kronabel/releases/tag/v1.2.2",
        "repositoryUrl": "https://github.com/EkoSartika/kronabel",
        "installer": {
            "filename": "BelOtomatisSekolah_Setup_v1.2.2.exe",
            "size": "45.63 MB",
            "sha256": "c1a6275c94533f54b8fca069de453a34b2c10a3aedb8f63450acbeda4dc72ae0",
            "downloadUrl": "https://github.com/EkoSartika/kronabel/releases/download/v1.2.2/BelOtomatisSekolah_Setup_v1.2.2.exe"
        },
        "portable": {
            "filename": "BelOtomatisSekolah_Portable_v1.2.2.zip",
            "size": "79.80 MB",
            "sha256": "a8f693c6ab2dd5c28a55c05231758be749050b2aae9c8ccd221761868d0f8004",
            "downloadUrl": "https://github.com/EkoSartika/kronabel/releases/download/v1.2.2/BelOtomatisSekolah_Portable_v1.2.2.zip"
        }
    }'::jsonb,
    'Konfigurasi rilis dan link download aplikasi'
)
ON CONFLICT (key) DO NOTHING;

-- Seed Home Page Content
INSERT INTO public.site_content (key, page, section, title, content, status)
VALUES
(
    'home.hero',
    'beranda',
    'hero',
    'Hero Section Beranda',
    '{
        "heading": "KRONABEL",
        "tagline": "“Bel Otomatis, Waktu Lebih Teratur.”",
        "description": "Kelola jadwal bel sekolah secara praktis melalui aplikasi Windows yang mudah digunakan. Gratis, tanpa biaya langganan, dan bekerja 100% offline.",
        "ctaDownloadText": "Unduh Gratis (v1.2.2)",
        "ctaDownloadHref": "/unduh",
        "ctaSupportText": "Dukung Pengembang",
        "ctaSupportHref": "/dukungan",
        "previewImage": "/images/screenshot_real_compact.png"
    }'::jsonb,
    'published'
),
(
    'home.cta_bottom',
    'beranda',
    'cta_bottom',
    'CTA Bawah Beranda',
    '{
        "title": "Mulai Gunakan KRONABEL Hari Ini",
        "description": "Tingkatkan ketepatan jam pelajaran di sekolah Anda dengan aplikasi bel otomatis yang handal, elegan, dan mudah dikelola.",
        "primaryButtonText": "Buka Halaman Unduh",
        "primaryButtonHref": "/unduh",
        "secondaryButtonText": "Pelajari Panduan",
        "secondaryButtonHref": "/panduan"
    }'::jsonb,
    'published'
),
(
    'about.intro',
    'tentang',
    'intro',
    'Pengenalan KRONABEL',
    '{
        "title": "Mengenal KRONABEL",
        "subtitle": "Inisiatif perangkat lunak bel sekolah otomatis yang handal, elegan, dan didedikasikan sepenuhnya untuk pendidikan di Indonesia.",
        "purposeTitle": "Latar Belakang & Tujuan",
        "purposeSubtitle": "Menghadirkan ketertiban waktu belajar tanpa biaya tinggi",
        "paragraph1": "Ketepatan pergantian jam pelajaran merupakan salah satu fondasi disiplin di lingkungan sekolah. Namun, banyak sekolah masih bergantung pada pemukulan bel manual oleh petugas piket yang rentan terlambat, atau terbebani oleh perangkat bel digital impor berbiaya jutaan rupiah yang sulit diatur jadwalnya.",
        "paragraph2": "KRONABEL hadir sebagai solusi perangkat lunak Windows yang dapat dipasang langsung pada komputer ruang guru atau ruang piket. Dengan menghubungkan output audio komputer ke amplifier pengeras suara sekolah, seluruh jadwal bel berbunyi secara presisi, teratur, dan otomatis setiap hari."
    }'::jsonb,
    'published'
),
(
    'support.intro',
    'dukungan',
    'intro',
    'Halaman Dukungan Pengembang',
    '{
        "badge": "Dukungan Pengembang",
        "title": "Dukung Pengembangan KRONABEL",
        "subtitle": "KRONABEL didedikasikan 100% gratis untuk seluruh satuan pendidikan di Indonesia tanpa batasan waktu dan tanpa biaya tersembunyi.",
        "cardTitle": "Traktir Kopi untuk Pengembang",
        "cardDescription": "Jika KRONABEL terbukti membantu ketertiban waktu belajar di sekolah Anda, meringankan tugas bapak/ibu guru piket, dan menghemat anggaran sekolah, Anda dapat menyisihkan donasi sukarela melalui platform Saweria.",
        "buttonText": "Dukung KRONABEL",
        "disclaimer": "Dukungan ini bersifat sukarela untuk mendukung keberlanjutan pengembangan. Aplikasi KRONABEL tetap 100% gratis digunakan untuk seluruh sekolah di Indonesia."
    }'::jsonb,
    'published'
)
ON CONFLICT (key) DO NOTHING;


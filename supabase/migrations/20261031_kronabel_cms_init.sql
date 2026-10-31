-- =============================================================================
-- KRONABEL CMS & FEEDBACK SYSTEM - SUPABASE INITIAL MIGRATION (SECURE v2)
-- File: supabase/migrations/20261031_kronabel_cms_init.sql
-- Revisi Keamanan: 2026-10-31
--   - is_admin() diperkuat dengan search_path terkunci & schema-qualified
--   - Feedback INSERT diperketat: hanya field izin terbatas, status terkunci 'baru'
--   - site_settings SELECT dibatasi: anon hanya dapat baca key publik
--   - admin_users UPDATE diperketat: role tidak bisa dinaikan sendiri
--   - Storage: SVG dan ICO dihapus dari allowed MIME types
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
    is_public BOOLEAN NOT NULL DEFAULT false,   -- flag: apakah key ini boleh dibaca anon
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
    name TEXT CHECK (name IS NULL OR length(name) <= 100),
    email TEXT CHECK (email IS NULL OR (length(email) <= 100 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
    category TEXT NOT NULL CHECK (category IN ('saran', 'kritik', 'bug', 'fitur', 'lainnya')),
    message TEXT NOT NULL CHECK (length(message) >= 5 AND length(message) <= 3000),
    -- status dikunci ke 'baru' saat INSERT via constraint trigger di bawah
    status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru', 'dibaca', 'diproses', 'selesai')),
    ip_hash TEXT CHECK (ip_hash IS NULL OR length(ip_hash) <= 64),  -- SHA-256 hex (max 64 char)
    user_agent TEXT CHECK (user_agent IS NULL OR length(user_agent) <= 200),
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
CREATE INDEX IF NOT EXISTS idx_site_settings_public ON public.site_settings(is_public);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_ip_hash ON public.feedback(ip_hash);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_history_key ON public.content_history(content_key);

-- =============================================================================
-- TRIGGER: Kunci status feedback ke 'baru' saat INSERT publik
-- Admin mengubah status via UPDATE (bukan INSERT), sehingga ini aman.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.enforce_feedback_insert_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Paksa status selalu 'baru' saat INSERT (anon maupun authenticated)
    NEW.status := 'baru';
    -- Pastikan created_at dan updated_at tidak bisa dimanipulasi dari luar
    NEW.created_at := NOW();
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_feedback_insert_defaults ON public.feedback;
CREATE TRIGGER trg_feedback_insert_defaults
BEFORE INSERT ON public.feedback
FOR EACH ROW EXECUTE FUNCTION public.enforce_feedback_insert_defaults();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTION: is_admin()
-- Diperkuat:
--   - search_path dikunci ke public & pg_catalog (mencegah search_path injection)
--   - Menggunakan nama schema-qualified secara eksplisit
--   - SECURITY DEFINER tetap (diperlukan agar RLS bisa memanggil tanpa rekursi)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.id = auth.uid()
  );
END;
$$;

-- Revoke execute dari public (hanya dipanggil internal DB/RLS)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;  -- diperlukan agar RLS policies on anon bisa evaluasi

-- =============================================================================
-- RLS: admin_users
-- =============================================================================
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin());

-- UPDATE: admin hanya boleh ubah username sendiri, TIDAK BOLEH ubah role
DROP POLICY IF EXISTS "Admins can update own admin profile" ON public.admin_users;
CREATE POLICY "Admins can update own username only"
ON public.admin_users FOR UPDATE
TO authenticated
USING (id = auth.uid() AND public.is_admin())
WITH CHECK (
    id = auth.uid()
    -- role tidak boleh diubah melalui RLS path (perubahan role hanya via service_role / admin API)
    AND role = (SELECT role FROM public.admin_users WHERE id = auth.uid())
);

-- =============================================================================
-- RLS: site_settings
-- Publik (anon): hanya bisa baca key yang is_public = true
-- Admin: dapat membaca dan mengelola semua key
-- =============================================================================
DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;
CREATE POLICY "Anon can view public site settings only"
ON public.site_settings FOR SELECT
TO anon
USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated can view public site settings" ON public.site_settings;
CREATE POLICY "Admins can view all site settings"
ON public.site_settings FOR SELECT
TO authenticated
USING (is_public = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- RLS: site_content
-- =============================================================================
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

-- =============================================================================
-- RLS: feedback
-- INSERT: anon & authenticated, TAPI field yang diizinkan sangat terbatas.
--   - id, status, created_at, updated_at dikontrol oleh trigger & DB default
--   - ip_hash, user_agent diisi oleh server (API route), BUKAN dari client body
--   - RLS hanya memvalidasi field konten (name, email, category, message)
-- SELECT/UPDATE/DELETE: hanya admin
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;
CREATE POLICY "Public can submit feedback (content only)"
ON public.feedback FOR INSERT
TO anon, authenticated
WITH CHECK (
    -- Validasi konten
    message IS NOT NULL
    AND length(trim(message)) >= 5
    AND length(message) <= 3000
    AND category IN ('saran', 'kritik', 'bug', 'fitur', 'lainnya')
    -- name & email opsional tapi dibatasi panjangnya
    AND (name IS NULL OR length(name) <= 100)
    AND (email IS NULL OR length(email) <= 100)
);

DROP POLICY IF EXISTS "Only admins can view feedback" ON public.feedback;
CREATE POLICY "Only admins can view feedback"
ON public.feedback FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update or delete feedback" ON public.feedback;
CREATE POLICY "Only admins can update feedback"
ON public.feedback FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete feedback" ON public.feedback;
CREATE POLICY "Only admins can delete feedback"
ON public.feedback FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- RLS: content_history
-- =============================================================================
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
-- SVG dihapus (XSS risk), ICO dihapus (tidak diperlukan untuk CMS konten)
-- Hanya JPG, PNG, WebP yang diperbolehkan
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'website-media',
    'website-media',
    true,
    5242880,  -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

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
-- is_public = true  → dapat dibaca anon (website publik)
-- is_public = false → internal admin only
-- =============================================================================

INSERT INTO public.site_settings (key, value, is_public, description)
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
    true,
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
    true,
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
    true,
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
        "tagline": "\u201cBel Otomatis, Waktu Lebih Teratur.\u201d",
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

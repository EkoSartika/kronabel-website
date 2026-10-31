-- =============================================================================
-- KRONABEL CMS SECURITY PATCH (FINAL HARDENING)
-- File: supabase/migrations/20261031_security_patch.sql
--
-- TUJUAN: Patch tambahan untuk database yang sudah menjalankan migration awal.
-- Jika Anda BARU menjalankan migration (database kosong), TIDAK PERLU menjalankan
-- file ini — gunakan 20261031_kronabel_cms_init.sql saja.
--
-- Jalankan file ini HANYA jika tabel sudah ada dari migration sebelumnya.
-- Semua perubahan bersifat 100% IDEMPOTENT (aman dijalankan berulang kali).
-- =============================================================================

-- =============================================================================
-- PATCH 1: Tambah kolom is_public ke site_settings (jika belum ada)
-- =============================================================================
ALTER TABLE public.site_settings
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;

-- Tandai key publik yang boleh dibaca anon
UPDATE public.site_settings
SET is_public = true
WHERE key IN ('general', 'donation', 'release');

-- =============================================================================
-- PATCH 2: Tambah constraint dan kolom keamanan di tabel feedback (jika belum ada)
-- =============================================================================

-- Tambah column ip_hash jika masih menggunakan ip_address lama
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'feedback'
      AND column_name = 'ip_address'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'feedback'
      AND column_name = 'ip_hash'
  ) THEN
    ALTER TABLE public.feedback
      ADD COLUMN ip_hash TEXT CHECK (ip_hash IS NULL OR length(ip_hash) <= 64);
  END IF;
END $$;

-- Tambah constraint panjang pesan jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_schema = 'public'
      AND table_name = 'feedback'
      AND constraint_name LIKE '%message%len%'
  ) THEN
    ALTER TABLE public.feedback
      ADD CONSTRAINT feedback_message_length
      CHECK (length(message) >= 5 AND length(message) <= 3000);
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- PATCH 3: Helper Functions Role & Admin (Bebas dari Rekursi RLS)
-- Semua fungsi menggunakan SECURITY DEFINER dan mengunci search_path ke public, pg_catalog.
-- =============================================================================

-- Membaca role admin pengguna aktif tanpa memicu RLS loop pada tabel admin_users
CREATE OR REPLACE FUNCTION public.current_admin_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT au.role INTO v_role
  FROM public.admin_users au
  WHERE au.id = auth.uid();
  RETURN v_role;
END;
$$;

REVOKE ALL ON FUNCTION public.current_admin_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO authenticated;

-- Memeriksa apakah pengguna aktif terdaftar di admin_users (superadmin, admin, editor)
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

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- Memeriksa apakah pengguna aktif adalah superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN public.current_admin_role() = 'superadmin';
END;
$$;

REVOKE ALL ON FUNCTION public.is_superadmin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO authenticated;

-- Memeriksa apakah pengguna aktif berhak mengelola pengaturan sensitif (superadmin dan admin)
CREATE OR REPLACE FUNCTION public.can_manage_settings()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN public.current_admin_role() IN ('superadmin', 'admin');
END;
$$;

REVOKE ALL ON FUNCTION public.can_manage_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_settings() TO authenticated;

-- =============================================================================
-- PATCH 4: Trigger Enforce Feedback Defaults & Metadata Protection
-- Memastikan:
--   1. Status SELALU 'baru' saat INSERT.
--   2. Created_at dan updated_at selalu menggunakan waktu database saat ini.
--   3. Jika dipanggil langsung oleh anon / client tanpa service_role,
--      ip_hash dan user_agent dipaksa NULL agar tidak bisa dipalsukan.
-- Trigger HANYA berjalan BEFORE INSERT, tidak mengganggu UPDATE oleh admin.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.enforce_feedback_insert_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Paksa status selalu 'baru' saat INSERT
    NEW.status := 'baru';

    -- Kunci timestamp database
    NEW.created_at := NOW();
    NEW.updated_at := NOW();

    -- Jika panggilan dilakukan oleh anon atau client langsung (bukan service_role),
    -- kosongkan ip_hash dan user_agent agar anon tidak bisa mengontrol metadata keamanan.
    IF auth.role() = 'anon' OR auth.role() IS NULL THEN
        NEW.ip_hash := NULL;
        NEW.user_agent := NULL;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_feedback_insert_defaults ON public.feedback;
CREATE TRIGGER trg_feedback_insert_defaults
BEFORE INSERT ON public.feedback
FOR EACH ROW EXECUTE FUNCTION public.enforce_feedback_insert_defaults();

-- =============================================================================
-- PATCH 5: Perbarui RLS admin_users (Cegah Rekursi & Role Escalation)
-- =============================================================================
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update own admin profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update own username only" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update own admin profile or superadmin can manage" ON public.admin_users;
CREATE POLICY "Admins can update own admin profile or superadmin can manage"
ON public.admin_users FOR UPDATE
TO authenticated
USING (
    public.is_superadmin()
    OR (id = auth.uid() AND public.is_admin())
)
WITH CHECK (
    public.is_superadmin()
    OR (id = auth.uid() AND role = public.current_admin_role())
);

DROP POLICY IF EXISTS "Superadmins can insert admin_users" ON public.admin_users;
CREATE POLICY "Superadmins can insert admin_users"
ON public.admin_users FOR INSERT
TO authenticated
WITH CHECK (public.is_superadmin());

DROP POLICY IF EXISTS "Superadmins can delete admin_users" ON public.admin_users;
CREATE POLICY "Superadmins can delete admin_users"
ON public.admin_users FOR DELETE
TO authenticated
USING (public.is_superadmin());

-- =============================================================================
-- PATCH 6: Perbarui RLS site_settings (Batasi Pembacaan Publik & Kewenangan Kelola)
-- =============================================================================
DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can view public site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anon can view public site settings only" ON public.site_settings;
CREATE POLICY "Anon can view public site settings only"
ON public.site_settings FOR SELECT
TO anon
USING (is_public = true);

DROP POLICY IF EXISTS "Admins can view all site settings" ON public.site_settings;
CREATE POLICY "Admins can view all site settings"
ON public.site_settings FOR SELECT
TO authenticated
USING (is_public = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins and superadmins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins and superadmins can manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.can_manage_settings())
WITH CHECK (public.can_manage_settings());

-- =============================================================================
-- PATCH 7: Perbarui RLS site_content
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
-- PATCH 8: Perbarui RLS feedback (Perketat INSERT Publik & Hak Akses Kelola)
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Public can submit feedback (content only)" ON public.feedback;
CREATE POLICY "Public can submit feedback (content only)"
ON public.feedback FOR INSERT
TO anon, authenticated
WITH CHECK (
    message IS NOT NULL
    AND length(trim(message)) >= 5
    AND length(message) <= 3000
    AND category IN ('saran', 'kritik', 'bug', 'fitur', 'lainnya')
    AND (name IS NULL OR length(name) <= 100)
    AND (email IS NULL OR length(email) <= 100)
    AND (status IS NULL OR status = 'baru')
);

DROP POLICY IF EXISTS "Only admins can view feedback" ON public.feedback;
CREATE POLICY "Only admins can view feedback"
ON public.feedback FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update or delete feedback" ON public.feedback;
DROP POLICY IF EXISTS "Only admins can update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins and superadmins can update feedback" ON public.feedback;
CREATE POLICY "Admins and superadmins can update feedback"
ON public.feedback FOR UPDATE
TO authenticated
USING (public.can_manage_settings())
WITH CHECK (public.can_manage_settings());

DROP POLICY IF EXISTS "Only admins can delete feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins and superadmins can delete feedback" ON public.feedback;
CREATE POLICY "Admins and superadmins can delete feedback"
ON public.feedback FOR DELETE
TO authenticated
USING (public.can_manage_settings());

-- =============================================================================
-- PATCH 9: Perbarui RLS content_history
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
-- PATCH 10: Perbarui Storage Bucket & Policies (website-media)
-- SVG dihapus (XSS risk), ICO dihapus
-- =============================================================================
UPDATE storage.buckets
SET
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
    file_size_limit    = 5242880
WHERE id = 'website-media';

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
-- VERIFIKASI AKHIR
-- =============================================================================
DO $$
DECLARE
  v_policy_count INT;
  v_trigger_exists BOOLEAN;
  v_is_public_col BOOLEAN;
  v_ip_hash_col BOOLEAN;
  v_role_fn_exists BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO v_policy_count
  FROM pg_policies WHERE schemaname = 'public';

  SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE event_object_schema = 'public'
      AND event_object_table = 'feedback'
      AND trigger_name = 'trg_feedback_insert_defaults'
  ) INTO v_trigger_exists;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'site_settings'
      AND column_name = 'is_public'
  ) INTO v_is_public_col;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'feedback'
      AND column_name = 'ip_hash'
  ) INTO v_ip_hash_col;

  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'current_admin_role'
  ) INTO v_role_fn_exists;

  RAISE NOTICE '=== KRONABEL SECURITY PATCH VERIFICATION ===';
  RAISE NOTICE 'Total RLS policies aktif di schema public: %', v_policy_count;
  RAISE NOTICE 'Trigger enforce_feedback_insert_defaults: %', CASE WHEN v_trigger_exists THEN 'AKTIF' ELSE 'TIDAK DITEMUKAN' END;
  RAISE NOTICE 'Kolom site_settings.is_public: %', CASE WHEN v_is_public_col THEN 'ADA' ELSE 'TIDAK ADA' END;
  RAISE NOTICE 'Kolom feedback.ip_hash: %', CASE WHEN v_ip_hash_col THEN 'ADA' ELSE 'TIDAK ADA' END;
  RAISE NOTICE 'Helper function current_admin_role(): %', CASE WHEN v_role_fn_exists THEN 'TERDAFTAR' ELSE 'TIDAK DITEMUKAN' END;
  RAISE NOTICE '============================================';
END $$;

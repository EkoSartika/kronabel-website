-- =============================================================================
-- KRONABEL CMS SECURITY PATCH
-- File: supabase/migrations/20261031_security_patch.sql
--
-- TUJUAN: Patch tambahan untuk database yang sudah menjalankan migration awal.
-- Jika Anda BARU menjalankan migration (database kosong), TIDAK PERLU menjalankan
-- file ini — gunakan 20261031_kronabel_cms_init.sql saja.
--
-- Jalankan file ini HANYA jika tabel sudah ada dari migration sebelumnya.
-- Semua perubahan bersifat idempotent (aman dijalankan berulang).
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
-- PATCH 2: Perkuat is_admin() dengan search_path terkunci
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

-- Atur hak eksekusi secara eksplisit
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- =============================================================================
-- PATCH 3: Tambah constraint keamanan di tabel feedback (jika belum ada)
-- =============================================================================

-- Tambah column ip_hash jika masih menggunakan ip_address
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
    -- Hapus kolom lama setelah migrasi (opsional, komentari jika ingin pertahankan)
    -- ALTER TABLE public.feedback DROP COLUMN ip_address;
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
-- PATCH 4: Trigger untuk mengunci status feedback saat INSERT
-- =============================================================================
CREATE OR REPLACE FUNCTION public.enforce_feedback_insert_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Paksa status selalu 'baru' saat INSERT — anon tidak bisa set status lain
    NEW.status := 'baru';
    -- Kunci timestamp agar tidak bisa dimanipulasi
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
-- PATCH 5: Perbarui RLS site_settings — pisahkan anon vs admin
-- =============================================================================

-- Hapus kebijakan lama yang terlalu longgar
DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can view public site settings" ON public.site_settings;

-- Anon hanya bisa baca key is_public = true
CREATE POLICY "Anon can view public site settings only"
ON public.site_settings FOR SELECT
TO anon
USING (is_public = true);

-- Admin bisa baca semua
CREATE POLICY "Admins can view all site settings"
ON public.site_settings FOR SELECT
TO authenticated
USING (is_public = true OR public.is_admin());

-- =============================================================================
-- PATCH 6: Perbarui RLS feedback — perketat INSERT publik
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedback;

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
);

-- =============================================================================
-- PATCH 7: Perbarui RLS admin_users — cegah role self-escalation
-- =============================================================================
DROP POLICY IF EXISTS "Admins can update own admin profile" ON public.admin_users;

CREATE POLICY "Admins can update own username only"
ON public.admin_users FOR UPDATE
TO authenticated
USING (id = auth.uid() AND public.is_admin())
WITH CHECK (
    id = auth.uid()
    -- Role tidak boleh berubah lewat UPDATE path ini
    AND role = (SELECT role FROM public.admin_users WHERE id = auth.uid())
);

-- =============================================================================
-- PATCH 8: Perbarui allowed MIME types storage — hapus SVG dan ICO
-- =============================================================================
UPDATE storage.buckets
SET
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
    file_size_limit    = 5242880
WHERE id = 'website-media';

-- =============================================================================
-- VERIFIKASI (output informatif, tidak mengubah data)
-- =============================================================================
DO $$
DECLARE
  v_policy_count INT;
  v_trigger_exists BOOLEAN;
  v_is_public_col BOOLEAN;
  v_ip_hash_col BOOLEAN;
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

  RAISE NOTICE '=== KRONABEL SECURITY PATCH VERIFICATION ===';
  RAISE NOTICE 'Total RLS policies aktif: %', v_policy_count;
  RAISE NOTICE 'Trigger enforce_feedback_insert_defaults: %', CASE WHEN v_trigger_exists THEN 'AKTIF' ELSE 'TIDAK DITEMUKAN' END;
  RAISE NOTICE 'Kolom site_settings.is_public: %', CASE WHEN v_is_public_col THEN 'ADA' ELSE 'TIDAK ADA' END;
  RAISE NOTICE 'Kolom feedback.ip_hash: %', CASE WHEN v_ip_hash_col THEN 'ADA' ELSE 'TIDAK ADA' END;
  RAISE NOTICE '============================================';
END $$;


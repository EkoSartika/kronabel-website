import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !rawKey) {
    return null;
  }

  let supabaseUrl = rawUrl.trim();
  try {
    supabaseUrl = new URL(supabaseUrl).origin;
  } catch {
    supabaseUrl = supabaseUrl.replace(/\/+$/, "");
  }
  const serviceRoleKey = rawKey.trim();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}


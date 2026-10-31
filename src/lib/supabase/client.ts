import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) {
    return null;
  }

  let supabaseUrl = rawUrl.trim();
  try {
    supabaseUrl = new URL(supabaseUrl).origin;
  } catch {
    supabaseUrl = supabaseUrl.replace(/\/+$/, "");
  }
  const supabaseAnonKey = rawKey.trim();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}


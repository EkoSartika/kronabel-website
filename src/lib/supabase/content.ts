import { createClient } from "./server";
import { SITE_CONFIG } from "@/config/site";
import type { SiteContent, SiteSetting } from "./types";

/**
 * Mengambil setting website dari Supabase dengan fallback ke SITE_CONFIG lokal.
 */
export async function getSiteSetting<T = Record<string, unknown>>(
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    const supabase = await createClient();
    if (!supabase) return defaultValue;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      return defaultValue;
    }

    return (data.value as T) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Mengambil konten bagian halaman dari Supabase dengan fallback ke nilai default lokal.
 */
export async function getPageContent<T = Record<string, unknown>>(
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    const supabase = await createClient();
    if (!supabase) return defaultValue;

    const { data, error } = await supabase
      .from("site_content")
      .select("content, status")
      .eq("key", key)
      .eq("status", "published")
      .single();

    if (error || !data || !data.content) {
      return defaultValue;
    }

    return (data.content as T) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Mengambil semua konten untuk satu halaman (admin/editor helper).
 */
export async function getAllPageContents(page: string): Promise<SiteContent[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("page", page)
      .order("section", { ascending: true });

    if (error || !data) return [];
    return data as SiteContent[];
  } catch {
    return [];
  }
}


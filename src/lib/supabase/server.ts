import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

export type AdminRole = "superadmin" | "admin" | "editor";

export async function getAuthenticatedAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("id, email, username, role")
    .eq("id", user.id)
    .single();

  if (adminError || !adminRecord) {
    return { supabase, user, role: null as AdminRole | null };
  }

  return {
    supabase,
    user,
    role: adminRecord.role as AdminRole,
    adminRecord,
  };
}


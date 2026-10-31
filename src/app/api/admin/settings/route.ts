import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const auth = await getAuthenticatedAdmin();
    if (!auth || !auth.user || !auth.role) {
      return NextResponse.json({ error: "Sesi admin tidak sah." }, { status: 401 });
    }

    const { supabase } = auth;
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settingsMap: Record<string, unknown> = {};
    (data || []).forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    return NextResponse.json({ settings: settingsMap, raw: data });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan internal server." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedAdmin();
    if (!auth || !auth.user || !auth.role) {
      return NextResponse.json({ error: "Sesi admin tidak sah." }, { status: 401 });
    }

    // Role check: hanya superadmin dan admin yang boleh ubah pengaturan website
    if (auth.role !== "superadmin" && auth.role !== "admin") {
      return NextResponse.json(
        { error: "Peran Editor tidak memiliki izin untuk mengubah konfigurasi dan pengaturan website." },
        { status: 403 }
      );
    }

    const { supabase, user } = auth;
    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Parameter key dan value wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("site_settings")
      .upsert({
        key,
        value,
        description: description || null,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      revalidatePath("/", "layout");
    } catch {
      // Abaikan jika di luar cache context
    }

    return NextResponse.json({ success: true, setting: data });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}


import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase belum terkonfigurasi." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

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
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase belum terkonfigurasi." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

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

    return NextResponse.json({ success: true, setting: data });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}


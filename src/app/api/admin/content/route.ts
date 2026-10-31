import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase belum terkonfigurasi." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

    const page = request.nextUrl.searchParams.get("page");
    let query = supabase.from("site_content").select("*").order("updated_at", { ascending: false });

    if (page) {
      query = query.eq("page", page);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contents: data });
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
    const { key, page, section, title, content, status } = body;

    if (!key || !page || !section || !content) {
      return NextResponse.json({ error: "Parameter key, page, section, dan content wajib diisi." }, { status: 400 });
    }

    const validStatus = status === "draft" ? "draft" : "published";

    // 1. Simpan/perbarui di tabel site_content
    const { data: updatedContent, error: upsertError } = await supabase
      .from("site_content")
      .upsert({
        key,
        page,
        section,
        title: title || null,
        content,
        status: validStatus,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // 2. Simpan jejak audit ke content_history
    await supabase.from("content_history").insert({
      content_key: key,
      page,
      section,
      content,
      status: validStatus,
      changed_by: user.id,
    });

    // 3. Revalidasi cache halaman publik agar perubahan langsung aktif tanpa redeploy
    try {
      revalidatePath("/", "layout");
    } catch {
      // Abaikan jika dipanggil di luar konteks request cache
    }

    return NextResponse.json({ success: true, data: updatedContent });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan internal saat menyimpan konten." }, { status: 500 });
  }
}


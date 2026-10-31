import { NextResponse, type NextRequest } from "next/server";
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

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const offset = (page - 1) * limit;

    let query = supabase.from("feedback").select("*", { count: "exact" });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (search && search.trim() !== "") {
      query = query.or(`message.ilike.%${search.trim()}%,name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`);
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Hitung masukan berstatus baru untuk badge notifikasi
    const { count: unreadCount } = await supabase
      .from("feedback")
      .select("*", { count: "exact", head: true })
      .eq("status", "baru");

    return NextResponse.json({
      feedback: data,
      total: count || 0,
      unreadCount: unreadCount || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan internal server." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { id, status } = body;

    const validStatuses = ["baru", "dibaca", "diproses", "selesai"];
    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "ID dan status masukan tidak valid." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("feedback")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, feedback: data });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui status masukan." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase belum terkonfigurasi." }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID masukan wajib disertakan." }, { status: 400 });
    }

    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Masukan berhasil dihapus." });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus masukan." }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Koneksi Supabase belum dikonfigurasi pada server." },
        { status: 503 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Kredensial login tidak valid." },
        { status: 401 }
      );
    }

    // Pastikan user terdaftar di tabel admin_users
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("username, role")
      .eq("id", authData.user.id)
      .single();

    if (adminError || !adminRecord) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Akun ini tidak memiliki hak akses administrator." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: adminRecord.username,
        role: adminRecord.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}


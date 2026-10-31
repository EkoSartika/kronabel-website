import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const supabase = await createClient();
    if (!supabase) {
      console.error(
        "[Auth Login Error] Klien Supabase tidak dapat diinisialisasi. Periksa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di server."
      );
      return NextResponse.json(
        { error: "Koneksi Supabase belum dikonfigurasi pada server." },
        { status: 503 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: String(password),
      });

    if (authError || !authData.user) {
      const errorMsg = authError?.message || "";
      const errorCode = authError?.code || "";
      const errorStatus = authError?.status || 401;

      // Logging aman di server tanpa menampilkan kata sandi atau token
      console.error(
        `[Auth Login Failed] Status: ${errorStatus}, Code: ${errorCode || "N/A"}, Message: ${errorMsg}`
      );

      const lowerMsg = errorMsg.toLowerCase();

      // Deteksi error konfigurasi server (API key tidak valid)
      if (
        lowerMsg.includes("invalid api key") ||
        lowerMsg.includes("apikey") ||
        errorCode === "PGRST301"
      ) {
        return NextResponse.json(
          {
            error:
              "Konfigurasi API Key Supabase (Anon Key) di server tidak valid. Pastikan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel sesuai dengan project Supabase aktif.",
          },
          { status: 500 }
        );
      }

      // Deteksi error format URL / routing
      if (
        lowerMsg.includes("invalid path") ||
        errorCode === "PGRST125"
      ) {
        return NextResponse.json(
          {
            error:
              "Format URL Supabase di server tidak valid. Pastikan NEXT_PUBLIC_SUPABASE_URL di Vercel berupa origin murni tanpa subpath.",
          },
          { status: 500 }
        );
      }

      // Deteksi email belum dikonfirmasi
      if (
        lowerMsg.includes("email not confirmed") ||
        errorCode === "email_not_confirmed"
      ) {
        return NextResponse.json(
          {
            error:
              "Alamat email administrator belum dikonfirmasi di Supabase Auth. Harap verifikasi akun di dashboard Supabase.",
          },
          { status: 403 }
        );
      }

      // Default: kredensial salah (email atau kata sandi tidak cocok)
      return NextResponse.json(
        {
          error:
            "Email atau kata sandi tidak cocok. Pastikan menggunakan email dan kata sandi yang didaftarkan saat inisialisasi CMS.",
        },
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
      console.warn(
        `[Auth Login Warning] User ID ${authData.user.id} berhasil login ke Auth tetapi tidak terdaftar di tabel admin_users.`
      );
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Akun ini tidak memiliki hak akses administrator KRONABEL CMS." },
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
  } catch (err: unknown) {
    const errorText = err instanceof Error ? err.message : String(err);
    console.error("[Auth Login Server Exception]:", errorText);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat memproses login." },
      { status: 500 }
    );
  }
}


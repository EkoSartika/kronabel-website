import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasSetupSecret = Boolean(process.env.ADMIN_SETUP_SECRET);

    if (!supabaseUrl || !hasServiceKey) {
      return NextResponse.json(
        {
          configured: false,
          error: "Environment variables Supabase belum lengkap di Vercel.",
          hasUrl: Boolean(supabaseUrl),
          hasServiceKey,
          hasAnonKey,
          hasSetupSecret,
        },
        { status: 503 }
      );
    }

    let projectHost = "";
    try {
      projectHost = new URL(supabaseUrl).host;
    } catch {
      projectHost = "Format URL tidak valid";
    }

    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      return NextResponse.json(
        {
          configured: false,
          error: "Gagal menginisialisasi klien Supabase Admin.",
        },
        { status: 500 }
      );
    }

    // Uji koneksi tabel admin_users
    const { count, error: countError, status: httpStatus, statusText } = await adminSupabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      // Ekstrak semua properti error termasuk non-enumerable
      const rawErrorProps: Record<string, unknown> = {};
      try {
        const errorRecord = countError as unknown as Record<string, unknown>;
        for (const key of Object.getOwnPropertyNames(countError)) {
          rawErrorProps[key] = errorRecord[key];
        }
      } catch {
        rawErrorProps.fallback = String(countError);
      }

      const errMsg =
        countError.message ||
        countError.details ||
        countError.hint ||
        String(rawErrorProps.message || "") ||
        "";

      const isTableNotFound =
        countError.code === "PGRST205" ||
        countError.code === "42P01" ||
        errMsg.toLowerCase().includes("does not exist") ||
        errMsg.toLowerCase().includes("not found");
      const isAuthError =
        httpStatus === 401 ||
        countError.code === "PGRST301" ||
        errMsg.toLowerCase().includes("jwt") ||
        errMsg.toLowerCase().includes("api key") ||
        errMsg.toLowerCase().includes("unauthorized") ||
        statusText?.toLowerCase().includes("unauthorized");

      let errorCategory = "DATABASE_ERROR";
      let userGuidance = "Terjadi kesalahan saat memeriksa database.";

      if (isAuthError) {
        errorCategory = "INVALID_CREDENTIALS";
        userGuidance = `Kunci SUPABASE_SERVICE_ROLE_KEY di Vercel tidak sah (HTTP ${httpStatus} Unauthorized). Pastikan Anda menyalin 'service_role' secret key, BUKAN 'anon' public key atau password database.`;
      } else if (isTableNotFound) {
        errorCategory = "TABLE_NOT_FOUND";
        userGuidance = `Tabel public.admin_users tidak ditemukan pada project '${projectHost}'. Pastikan migration SQL dijalankan di project Supabase ini.`;
      }

      return NextResponse.json(
        {
          configured: true,
          connected: false,
          projectHost,
          hasSetupSecret,
          httpStatus,
          statusText,
          errorCategory,
          userGuidance,
          rawErrorProps,
          code: countError.code || rawErrorProps.code || null,
          message: countError.message || rawErrorProps.message || null,
          details: countError.details || rawErrorProps.details || null,
          hint: countError.hint || rawErrorProps.hint || null,
        },
        { status: 200 }
      );
    }

    const adminCount = count || 0;

    return NextResponse.json({
      configured: true,
      connected: true,
      projectHost,
      hasSetupSecret,
      adminCount,
      isSetupLocked: adminCount > 0,
      message:
        adminCount > 0
          ? "Sistem sudah memiliki administrator aktif. Form setup dinonaktifkan."
          : "Database Supabase terhubung dengan baik. Siap membuat akun administrator pertama.",
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        configured: false,
        error: "Terjadi kesalahan internal saat memeriksa status koneksi.",
        detail: error?.message || String(err),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      return NextResponse.json(
        {
          error:
            "Koneksi Service Role Supabase belum dikonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY telah diatur di Environment Variables.",
        },
        { status: 503 }
      );
    }

    // Periksa apakah sudah ada admin terdaftar di sistem
    const { count, error: countError } = await adminSupabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      const errMsg = countError.message || countError.details || countError.hint || "";
      const isTableNotFound =
        countError.code === "PGRST205" ||
        countError.code === "42P01" ||
        errMsg.toLowerCase().includes("does not exist") ||
        errMsg.toLowerCase().includes("not found");
      const isAuthError =
        countError.code === "PGRST301" ||
        errMsg.toLowerCase().includes("jwt") ||
        errMsg.toLowerCase().includes("api key") ||
        errMsg.toLowerCase().includes("unauthorized");

      let errorMsg = "Tabel admin_users belum dapat diakses di database Supabase.";
      if (isTableNotFound) {
        errorMsg = "Tabel admin_users belum ditemukan di database proyek Supabase yang terhubung ke Vercel.";
      } else if (isAuthError) {
        errorMsg = "Kunci SUPABASE_SERVICE_ROLE_KEY di Vercel tidak cocok dengan proyek Supabase ini (Invalid Key).";
      }

      return NextResponse.json(
        {
          error: errorMsg,
          code: countError.code || null,
          detail: countError.message || countError.details || countError.hint || "Pemeriksaan tabel gagal",
        },
        { status: 400 }
      );
    }

    // Jika sudah ada admin, tolak inisialisasi ulang
    if (count && count > 0) {
      return NextResponse.json(
        {
          error:
            "Sistem sudah memiliki akun administrator aktif. Inisialisasi awal hanya dapat dilakukan satu kali untuk keamanan.",
        },
        { status: 403 }
      );
    }

    const { email, password, username, setupSecret } = await request.json();

    // Verifikasi setupSecret jika ADMIN_SETUP_SECRET didefinisikan di environment
    const requiredSecret = process.env.ADMIN_SETUP_SECRET;
    if (requiredSecret && setupSecret !== requiredSecret) {
      return NextResponse.json(
        { error: "Token rahasia inisialisasi (ADMIN_SETUP_SECRET) tidak valid." },
        { status: 403 }
      );
    }

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Email wajib diisi dan kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Cegah penggunaan password bawaan yang tidak aman
    if (password.toLowerCase() === "admin" || password.toLowerCase() === "admin123" || password.toLowerCase() === "password") {
      return NextResponse.json(
        { error: "Kata sandi terlalu mudah ditebak. Harap gunakan kata sandi yang lebih kuat." },
        { status: 400 }
      );
    }

    // 1. Buat user di Supabase Auth
    const { data: authUser, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username: username || "admin",
          role: "superadmin",
        },
      });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || "Gagal membuat akun autentikasi Supabase." },
        { status: 400 }
      );
    }

    // 2. Daftarkan di tabel admin_users
    const { error: dbError } = await adminSupabase.from("admin_users").insert({
      id: authUser.user.id,
      username: username || "admin",
      role: "superadmin",
    });

    if (dbError) {
      // Rollback auth user jika insert tabel gagal
      await adminSupabase.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: "Gagal menyimpan data administrator ke tabel admin_users: " + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Akun administrator pertama berhasil dibuat. Silakan login ke Dashboard Admin KRONABEL.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat inisialisasi admin." },
      { status: 500 }
    );
  }
}


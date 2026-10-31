import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    // Ambil IP pengunjung dari header (Vercel menyediakan x-forwarded-for)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const body = await request.json();
    const { name, email, category, message, honeypot } = body;

    // Honeypot spam trap: field tersembunyi yang hanya diisi oleh spam bot
    if (honeypot) {
      // Return 200 diam-diam agar bot tidak tahu strateginya gagal
      return NextResponse.json({ success: true, message: "Terima kasih atas masukan Anda!" });
    }

    // Validasi kategori
    const validCategories = ["saran", "kritik", "bug", "fitur", "lainnya"];
    if (!category || !validCategories.includes(category.toLowerCase())) {
      return NextResponse.json(
        { error: "Kategori masukan wajib dipilih dari daftar yang tersedia." },
        { status: 400 }
      );
    }

    // Validasi pesan
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Pesan masukan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length < 5) {
      return NextResponse.json(
        { error: "Pesan masukan terlalu singkat (minimal 5 karakter)." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 3000) {
      return NextResponse.json(
        { error: "Pesan masukan melebihi batas maksimal (3.000 karakter)." },
        { status: 400 }
      );
    }

    // Validasi email jika diisi
    if (email && typeof email === "string" && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: "Format alamat email tidak valid." },
          { status: 400 }
        );
      }
    }

    // Gunakan admin client agar dapat INSERT tanpa auth session (public endpoint)
    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Layanan database belum terhubung. Silakan coba kembali nanti." },
        { status: 503 }
      );
    }

    // Rate limiting persisten via Supabase: 
    // Cek berapa kali IP ini mengirim dalam 10 menit terakhir
    const rateWindowMs = 10 * 60 * 1000; // 10 menit
    const rateLimit = 5;
    const since = new Date(Date.now() - rateWindowMs).toISOString();

    // Hash IP untuk privasi (tidak simpan IP asli)
    const ipHash = await hashIp(ip);

    const { count: recentCount } = await supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    if (recentCount !== null && recentCount >= rateLimit) {
      return NextResponse.json(
        {
          error:
            "Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa menit sebelum mengirim masukan kembali.",
        },
        { status: 429 }
      );
    }

    const cleanName = name && typeof name === "string" ? name.trim().slice(0, 100) : null;
    const cleanEmail = email && typeof email === "string" ? email.trim().slice(0, 100) : null;

    const { error: insertError } = await supabase.from("feedback").insert({
      name: cleanName || null,
      email: cleanEmail || null,
      category: category.toLowerCase(),
      message: cleanMessage,
      status: "baru",
      ip_hash: ipHash,
      user_agent: request.headers.get("user-agent")?.slice(0, 200) || null,
    });

    if (insertError) {
      console.error("Feedback insert error:", insertError.code, insertError.message);
      return NextResponse.json(
        { error: "Gagal menyimpan masukan ke database. Silakan coba beberapa saat lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Terima kasih! Saran dan masukan Anda telah berhasil dikirim ke tim pengembang KRONABEL.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses formulir." },
      { status: 500 }
    );
  }
}

/**
 * Hash IP address untuk privasi (simpan hash, bukan IP asli).
 * Menggunakan Web Crypto API yang tersedia di Edge Runtime.
 */
async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.ADMIN_SETUP_SECRET ?? "kronabel-salt"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Cache in-memory sederhana untuk pembatasan laju (rate limiting) per IP
const ipRateLimit = new Map<string, { count: number; firstRequestTime: number }>();

export async function POST(request: NextRequest) {
  try {
    // Ambil IP pengunjung dari header
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: Maksimal 5 pengiriman feedback per 10 menit per IP
    const now = Date.now();
    const rateWindowMs = 10 * 60 * 1000;
    const clientRecord = ipRateLimit.get(ip);

    if (clientRecord) {
      if (now - clientRecord.firstRequestTime < rateWindowMs) {
        if (clientRecord.count >= 5) {
          return NextResponse.json(
            {
              error:
                "Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa menit sebelum mengirim masukan kembali.",
            },
            { status: 429 }
          );
        }
        clientRecord.count += 1;
      } else {
        ipRateLimit.set(ip, { count: 1, firstRequestTime: now });
      }
    } else {
      ipRateLimit.set(ip, { count: 1, firstRequestTime: now });
    }

    const body = await request.json();
    const { name, email, category, message, honeypot } = body;

    // Honeypot spam trap: field tersembunyi yang hanya diisi oleh spam bot
    if (honeypot) {
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

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Layanan database belum terhubung. Silakan coba kembali nanti." },
        { status: 503 }
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
      user_agent: request.headers.get("user-agent")?.slice(0, 200) || null,
    });

    if (insertError) {
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


import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// MIME types yang diizinkan: SVG dihapus (risiko XSS), ICO dihapus
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

    const { data: files, error } = await supabase.storage
      .from("website-media")
      .list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mediaWithUrls = (files || []).map((file) => {
      const { data: publicUrlData } = supabase.storage
        .from("website-media")
        .getPublicUrl(file.name);

      return {
        ...file,
        publicUrl: publicUrlData.publicUrl,
      };
    });

    return NextResponse.json({ media: mediaWithUrls });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan saat memuat daftar media." }, { status: 500 });
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Berkas tidak ditemukan dalam formulir." }, { status: 400 });
    }

    // Validasi ukuran: Maksimal 5 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Ukuran berkas melebihi batas maksimal 5 MB." }, { status: 400 });
    }

    // Validasi MIME type — SVG dilarang (risiko XSS via stored SVG)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe berkas tidak didukung. Harap unggah gambar JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    // Validasi ekstensi berkas (double-check, mencegah MIME spoofing)
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: "Ekstensi berkas tidak diizinkan. Gunakan .jpg, .jpeg, .png, atau .webp." },
        { status: 400 }
      );
    }

    // Penamaan berkas yang aman: sanitize + timestamp untuk keunikan
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const safeFileName = `${Date.now()}-${baseName}.${extension}`;

    const { data, error } = await supabase.storage
      .from("website-media")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("website-media")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      file: {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      },
    });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah berkas." }, { status: 500 });
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

    // Gunakan query param "name" (konsisten dengan admin/media page.tsx)
    const filename = request.nextUrl.searchParams.get("name") ||
                     request.nextUrl.searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Nama berkas wajib disertakan." }, { status: 400 });
    }

    // Sanitasi: pastikan tidak ada path traversal (hanya nama berkas, bukan path)
    const safeFilename = filename.replace(/[/\\]/g, "");
    if (!safeFilename || safeFilename !== filename) {
      return NextResponse.json({ error: "Nama berkas tidak valid." }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from("website-media")
      .remove([safeFilename]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Berkas berhasil dihapus." });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus berkas." }, { status: 500 });
  }
}

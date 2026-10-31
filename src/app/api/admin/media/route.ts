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
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "Ukuran berkas melebihi batas maksimal 5 MB." }, { status: 400 });
    }

    // Validasi tipe berkas
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe berkas tidak didukung. Harap unggah berkas gambar (JPG, PNG, WebP, SVG, ICO)." },
        { status: 400 }
      );
    }

    // Penamaan berkas yang aman: sanitize dan tambahkan timestamp
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 40);

    const safeFileName = `${Date.now()}-${baseName}.${extension}`;

    const { data, error } = await supabase.storage
      .from("website-media")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
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

    const filename = request.nextUrl.searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "Nama berkas wajib disertakan." }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from("website-media")
      .remove([filename]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Berkas berhasil dihapus." });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan saat menghapus berkas." }, { status: 500 });
  }
}


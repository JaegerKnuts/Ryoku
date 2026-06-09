import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";

const MAX_BLOB_SIZE = 4.5 * 1024 * 1024;
const MAX_FALLBACK_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function hasBlobCredentials() {
  return !!(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, PNG, WebP o GIF." },
        { status: 400 }
      );
    }

    if (hasBlobCredentials()) {
      if (file.size > MAX_BLOB_SIZE) {
        return NextResponse.json(
          { error: "La imagen no puede superar 4,5 MB." },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop() || "jpg";
      const filename = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const blob = await put(filename, file, {
        access: "public",
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url });
    }

    if (file.size > MAX_FALLBACK_SIZE) {
      return NextResponse.json(
        {
          error:
            "La imagen supera 2 MB y el almacenamiento en la nube no está configurado. Usa una imagen más pequeña o configura Vercel Blob en el proyecto.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const url = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Error al subir la imagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

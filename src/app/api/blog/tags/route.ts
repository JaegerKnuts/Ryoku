import { NextResponse } from "next/server";
import { getBlogTags } from "@/lib/blog-tags";

export async function GET() {
  try {
    const tags = await getBlogTags({ publishedOnly: true });
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json({ error: "Error al obtener secciones" }, { status: 500 });
  }
}

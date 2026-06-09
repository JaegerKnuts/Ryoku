import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBlogTags } from "@/lib/blog-tags";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tags = await getBlogTags({ publishedOnly: false });
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching admin blog tags:", error);
    return NextResponse.json({ error: "Error al obtener secciones" }, { status: 500 });
  }
}

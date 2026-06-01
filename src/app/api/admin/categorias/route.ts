import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const withCount = searchParams.get("withCount") === "true";

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: withCount ? {
      _count: { select: { products: true } },
    } : undefined,
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, description, order } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Nombre y slug son requeridos" }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        order: order || 0,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}

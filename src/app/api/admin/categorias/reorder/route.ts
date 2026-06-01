import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { categoryIds } = body;

  if (!Array.isArray(categoryIds)) {
    return NextResponse.json({ error: "categoryIds debe ser un array" }, { status: 400 });
  }

  try {
    const updates = categoryIds.map((id, index) =>
      prisma.category.update({
        where: { id: Number(id) },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering categories:", error);
    return NextResponse.json({ error: "Error al reordenar categorías" }, { status: 500 });
  }
}

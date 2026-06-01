import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { imageIds } = body;

  if (!Array.isArray(imageIds)) {
    return NextResponse.json({ error: "imageIds debe ser un array" }, { status: 400 });
  }

  try {
    // Update each image order
    const updates = imageIds.map((imageId, index) =>
      prisma.productImage.update({
        where: { id: Number(imageId) },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering images:", error);
    return NextResponse.json({ error: "Error al reordenar imágenes" }, { status: 500 });
  }
}

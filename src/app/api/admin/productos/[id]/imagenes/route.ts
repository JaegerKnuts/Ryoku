import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { url, alt, order } = body;

  if (!url) {
    return NextResponse.json({ error: "URL requerida" }, { status: 400 });
  }

  try {
    const image = await prisma.productImage.create({
      data: {
        productId: Number(id),
        url,
        alt: alt || null,
        order: order || 0,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error("Error creating image:", error);
    return NextResponse.json({ error: "Error al crear imagen" }, { status: 500 });
  }
}

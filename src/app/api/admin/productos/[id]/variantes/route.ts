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
  const { name, size, color, colorHex, price, stock, sku } = body;

  try {
    const variant = await prisma.variant.create({
      data: {
        productId: Number(id),
        name: name || `${size} ${color}`,
        size: size || null,
        color: color || null,
        colorHex: colorHex || null,
        price: price || null,
        stock: stock || 0,
        sku: sku || null,
      },
    });

    return NextResponse.json({ variant }, { status: 201 });
  } catch (error) {
    console.error("Error creating variant:", error);
    return NextResponse.json({ error: "Error al crear variante" }, { status: 500 });
  }
}

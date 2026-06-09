import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, description, price, comparePrice, categoryId, productType, featured, active, variants, images } = body;

  if (!name || !slug || !price || !categoryId) {
    return NextResponse.json({ error: "Campos obligatorios: name, slug, price, categoryId" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      price,
      comparePrice: comparePrice || null,
      categoryId: Number(categoryId),
      productType: productType || "MERCH",
      featured: featured || false,
      active: active !== false,
      // Create variants if provided
      variants: variants && variants.length > 0 ? {
        create: variants.map((v: any) => ({
          name: v.name || `${v.size} ${v.color}`,
          size: v.size || null,
          color: v.color || null,
          colorHex: v.colorHex || null,
          price: v.price || null,
          stock: v.stock || 0,
          sku: v.sku || null,
        })),
      } : undefined,
      // Create images if provided
      images: images && images.length > 0 ? {
        create: images.map((img: any, idx: number) => ({
          url: img.url,
          alt: img.alt || name,
          order: idx,
        })),
      } : undefined,
    },
    include: {
      variants: true,
      images: true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}

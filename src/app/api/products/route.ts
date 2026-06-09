import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("cat");
  const search = searchParams.get("q");
  const sort = searchParams.get("sort") || "novedades";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  try {
    const where: Record<string, unknown> = { active: true };

    if (category && category !== "todo") {
      if (category === "merch") {
        where.productType = "MERCH";
      } else if (category === "selected-gear") {
        where.productType = "SELECTED_GEAR";
      } else {
        where.productType = category.toUpperCase();
      }
    }

    if (search) {
      where.name = { contains: search };
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "precio_asc":
        orderBy.price = "asc";
        break;
      case "precio_desc":
        orderBy.price = "desc";
        break;
      case "nombre":
        orderBy.name = "asc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

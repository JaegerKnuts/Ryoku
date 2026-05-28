import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

export async function GET() {
  const sessionId = await getSessionId();

  try {
    const items = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        product: {
          include: { images: { orderBy: { order: "asc" }, take: 1 } },
        },
        variant: true,
      },
    });

    const response = NextResponse.json({ items });
    response.cookies.set("cart_session", sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Error al obtener carrito" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  const body = await request.json();
  const { productId, variantId, quantity = 1 } = body;

  if (!productId) {
    return NextResponse.json({ error: "productId requerido" }, { status: 400 });
  }

  try {
    // Check if item already in cart
    const existing = await prisma.cartItem.findFirst({
      where: { sessionId, productId, variantId: variantId || null },
    });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { sessionId, productId, variantId, quantity },
      });
    }

    const response = NextResponse.json({ item });
    response.cookies.set("cart_session", sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Error al añadir al carrito" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("id");

  if (!itemId) {
    return NextResponse.json({ error: "id requerido" }, { status: 400 });
  }

  try {
    await prisma.cartItem.delete({ where: { id: parseInt(itemId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: "Error al eliminar del carrito" }, { status: 500 });
  }
}

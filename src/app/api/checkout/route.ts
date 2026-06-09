import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const SHIPPING_COST = 4.99;
const FREE_SHIPPING_THRESHOLD = 50;

let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY no configurada");
    stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  }
  return stripe;
}

async function resolveCheckoutUserId(sessionEmail?: string | null) {
  if (sessionEmail) {
    const user = await prisma.user.findUnique({ where: { email: sessionEmail } });
    if (user) return user.id;
  }

  const guestEmail = "checkout-guest@ryoku.internal";
  const guest = await prisma.user.findUnique({ where: { email: guestEmail } });
  if (guest) return guest.id;

  const created = await prisma.user.create({
    data: {
      name: "Invitado",
      email: guestEmail,
      password: await hash(crypto.randomUUID(), 12),
    },
  });
  return created.id;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, address } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    if (!address?.name || !address?.surname || !address?.address || !address?.city || !address?.province || !address?.postalCode) {
      return NextResponse.json({ error: "Dirección incompleta" }, { status: 400 });
    }

    const productIds = items.map((item: { id: number }) => Number(item.id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      include: { variants: true, images: { orderBy: { order: "asc" }, take: 1 } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const validatedItems: Array<{
      id: number;
      name: string;
      price: number;
      qty: number;
      variantId: number | null;
      color?: string;
      size?: string;
      image: string;
    }> = [];

    for (const item of items) {
      const product = productMap.get(Number(item.id));
      if (!product) {
        return NextResponse.json({ error: `Producto no disponible: ${item.name || item.id}` }, { status: 400 });
      }

      const variant = item.variantId
        ? product.variants.find((v) => v.id === Number(item.variantId))
        : null;

      if (item.variantId && !variant) {
        return NextResponse.json({ error: `Variante no válida para ${product.name}` }, { status: 400 });
      }

      const stock = variant?.stock ?? product.variants.reduce((max, v) => Math.max(max, v.stock), 0);
      const qty = Math.max(1, Number(item.qty) || 1);

      if (stock < qty) {
        return NextResponse.json({ error: `Stock insuficiente para ${product.name}` }, { status: 400 });
      }

      const price = variant?.price ?? product.price;

      validatedItems.push({
        id: product.id,
        name: product.name,
        price: Number(price),
        qty,
        variantId: variant?.id ?? null,
        color: variant?.color ?? undefined,
        size: variant?.size ?? undefined,
        image: product.images[0]?.url || item.image || "",
      });
    }

    const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    const userId = await resolveCheckoutUserId(session?.user?.email);

    const addressRecord = await prisma.address.create({
      data: {
        userId,
        name: address.name,
        surname: address.surname,
        address: address.address,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        phone: address.phone || null,
        country: "ES",
        isDefault: false,
      },
    });

    const orderNumber = `RY${Date.now().toString(36).toUpperCase()}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: addressRecord.id,
        status: "PENDING",
        subtotal,
        shipping,
        total,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.id,
            variantId: item.variantId,
            quantity: item.qty,
            price: item.price,
            total: item.price * item.qty,
          })),
        },
      },
    });

    let stripeInstance;
    try {
      stripeInstance = getStripe();
    } catch {
      return NextResponse.json(
        { error: "El pago no está configurado. Contacta con el administrador." },
        { status: 503 }
      );
    }

    const stripeSession = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: [item.color, item.size].filter(Boolean).join(" / ") || undefined,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      shipping_options: shipping > 0
        ? [{
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: Math.round(shipping * 100), currency: "eur" },
              display_name: "Envío estándar",
            },
          }]
        : [{
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "eur" },
              display_name: "Envío gratis",
            },
          }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?order=${orderNumber}`,
      metadata: { orderId: String(order.id), orderNumber },
      customer_email: session?.user?.email || undefined,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Error al procesar el checkout" }, { status: 500 });
  }
}

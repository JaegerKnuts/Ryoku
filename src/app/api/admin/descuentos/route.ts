import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const discounts = await prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ discounts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { code, percent, usageLimit, expiresAt } = body;

  if (!code || !percent) {
    return NextResponse.json({ error: "code y percent son obligatorios" }, { status: 400 });
  }

  const discount = await prisma.discount.create({
    data: {
      code,
      percent,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(discount, { status: 201 });
}

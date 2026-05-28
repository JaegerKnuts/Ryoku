import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, posts, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return NextResponse.json({ products, posts, orders, users });
}

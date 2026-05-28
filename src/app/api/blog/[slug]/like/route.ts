import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value || crypto.randomUUID();

  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    // Check existing like by session
    const existing = await prisma.blogLike.findFirst({
      where: { postId: post.id, sessionId },
    });

    if (existing) {
      await prisma.blogLike.delete({ where: { id: existing.id } });
      const count = await prisma.blogLike.count({ where: { postId: post.id } });
      return NextResponse.json({ liked: false, count });
    }

    await prisma.blogLike.create({
      data: { postId: post.id, sessionId },
    });

    const count = await prisma.blogLike.count({ where: { postId: post.id } });

    const response = NextResponse.json({ liked: true, count });
    response.cookies.set("cart_session", sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

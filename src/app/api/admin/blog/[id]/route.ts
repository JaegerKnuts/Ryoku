import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncBlogCoverImage } from "@/lib/blog";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const postId = Number(id);
  const { title, slug, excerpt, content, coverImage, tag, status } = body;

  const data: Record<string, unknown> = {
    title,
    slug,
    excerpt: excerpt ?? null,
    content: content ?? null,
    coverImage: coverImage ?? null,
    tag: tag ?? null,
    status: status ?? "DRAFT",
  };

  if (status === "PUBLISHED" && !body.publishedAt) {
    data.publishedAt = new Date();
  }

  const post = await prisma.$transaction(async (tx) => {
    const updated = await tx.blogPost.update({ where: { id: postId }, data });
    await syncBlogCoverImage(tx, postId, coverImage ?? null);
    return updated;
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}

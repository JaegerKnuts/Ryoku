import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncBlogCoverImage } from "@/lib/blog";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, excerpt, content, coverImage, tag, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Campos obligatorios: title, slug" }, { status: 400 });
  }

  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        coverImage: coverImage || null,
        tag: tag || null,
        status: status || "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    await syncBlogCoverImage(tx, created.id, coverImage || null);
    return created;
  });

  return NextResponse.json(post, { status: 201 });
}

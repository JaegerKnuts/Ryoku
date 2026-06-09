import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para comentar" },
      { status: 401 }
    );
  }

  const { slug } = await params;

  try {
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "El comentario no puede estar vacío" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    const userId = Number((session.user as { id?: string }).id);
    if (!userId) {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
    }

    const comment = await prisma.blogComment.create({
      data: {
        postId: post.id,
        userId,
        content: content.trim(),
        status: "approved",
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Error al publicar el comentario" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true },
        });
      }
      return NextResponse.json({ success: true, message: "¡Ya estás suscrito!" });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });

    return NextResponse.json({ success: true, message: "¡Suscripción exitosa!" });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Error al suscribirse" },
      { status: 500 }
    );
  }
}

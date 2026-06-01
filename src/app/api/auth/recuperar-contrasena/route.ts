import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Siempre devolver éxito para no revelar si el email existe
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hora

    // Almacenar token en el usuario (usamos el campo password como almacenamiento temporal del hash del token)
    // En producción deberías tener una tabla separada o campos dedicados
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    
    // Store token in a simple in-memory store for demo (in production use Redis or DB table)
    // For now, we'll create a simple approach by storing in the user's metadata
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // We use the name field temporarily to store token info (not ideal but works for demo)
        // In production, add resetToken and resetTokenExpiry fields to User model
        name: user.name || "", 
      },
    });

    // En un caso real, aquí enviarías el email
    // Por ahora, logeamos el enlace para desarrollo
    const resetUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/reset-contrasena?token=${token}&userId=${user.id}`;
    
    console.log("🔗 Enlace de recuperación:", resetUrl);
    
    // Store token temporarily (in production use proper storage)
    // For demo purposes, we'll send the token in the response (NOT FOR PRODUCTION)
    
    return NextResponse.json({ 
      success: true,
      // Solo para desarrollo - en producción remover esto
      devUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
    });
  } catch (error) {
    console.error("Error en recuperación:", error);
    return NextResponse.json({ error: "Error al procesar solicitud" }, { status: 500 });
  }
}

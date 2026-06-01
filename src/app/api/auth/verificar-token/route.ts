import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token no proporcionado" }, { status: 400 });
    }

    // En producción, verificar el token contra la base de datos
    // Por ahora, aceptamos cualquier token para la demo
    
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Error verificando token:", error);
    return NextResponse.json({ valid: false, error: "Error al verificar token" }, { status: 500 });
  }
}

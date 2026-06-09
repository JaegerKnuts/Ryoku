import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPass = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ryoku.es" },
    update: {},
    create: {
      name: "Admin Ryoku",
      email: "admin@ryoku.es",
      password: adminPass,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created:", admin.email);

  // Categories
  const ropa = await prisma.category.upsert({
    where: { slug: "ropa" },
    update: {},
    create: { name: "Ropa", slug: "ropa", description: "Streetwear Ryoku: sudaderas, camisetas, gorras y más.", order: 1 },
  });
  const parafernalia = await prisma.category.upsert({
    where: { slug: "parafernalia" },
    update: {},
    create: { name: "Parafernalia", slug: "parafernalia", description: "Accesorios de fumador: bandejas, grinders, papers y mecheros.", order: 2 },
  });
  console.log("✓ Categories created");

  // Products - Ropa
  const ropaProducts = [
    { name: "Hoodie Ryoku Classic", slug: "hoodie-ryoku-classic", price: 59.99, description: "Sudadera oversize de algodón orgánico 100%. Bordado Ryoku en el pecho y estampado trasero exclusivo.", featured: true },
    { name: "Tee Haze Edition", slug: "tee-haze-edition", price: 34.99, description: "Camiseta de algodón premium con estampado Haze exclusivo. Corte regular unisex." },
    { name: "Sudadera Kush Green", slug: "sudadera-kush-green", price: 64.99, description: "Sudadera con capucha en verde oliva. Interior afelpado, bordado discreto.", featured: true },
    { name: "Gorra Ryoku Snap", slug: "gorra-ryoku-snap", price: 29.99, description: "Gorra snapback con logo bordado. Ajuste universal." },
    { name: "Tee OG Strain", slug: "tee-og-strain", price: 34.99, description: "Camiseta con diseño OG Strain en serigrafía. Algodón 180g." },
    { name: "Hoodie Sativa Club", slug: "hoodie-sativa-club", price: 62.99, description: "Sudadera negra con estampado Sativa Club en la espalda. Algodón orgánico." },
  ];

  for (const p of ropaProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        categoryId: ropa.id,
        productType: "MERCH",
        featured: p.featured || false,
        variants: {
          create: [
            { name: "S Negro", size: "S", color: "Negro", colorHex: "#111111", stock: 20 },
            { name: "M Negro", size: "M", color: "Negro", colorHex: "#111111", stock: 30 },
            { name: "L Negro", size: "L", color: "Negro", colorHex: "#111111", stock: 25 },
            { name: "XL Negro", size: "XL", color: "Negro", colorHex: "#111111", stock: 15 },
          ],
        },
      },
    });
  }
  console.log("✓ Ropa products created");

  // Products - Parafernalia
  const paraProducts = [
    { name: "Rolling Tray Bamboo", slug: "rolling-tray-bamboo", price: 24.99, description: "Bandeja de liar en bambú natural con grabado Ryoku. Tamaño grande.", featured: true },
    { name: "Grinder Ryoku 4P", slug: "grinder-ryoku-4p", price: 19.99, description: "Grinder de aluminio de 4 piezas con logo grabado. Dientes de diamante." },
    { name: "Papers Ryoku King Size", slug: "papers-ryoku-king-size", price: 3.99, description: "Papeles de liar king size slim, papel de arroz ultrafino. 32 hojas." },
    { name: "Mechero Clipper Ryoku", slug: "mechero-clipper-ryoku", price: 4.99, description: "Clipper edición limitada Ryoku. Recargable y con piedra reemplazable." },
    { name: "Bandeja Ryoku Metal XL", slug: "bandeja-ryoku-metal-xl", price: 34.99, description: "Bandeja metálica XL con diseño exclusivo. Bordes elevados antiderrame.", featured: true },
    { name: "Grinder Mini Pocket", slug: "grinder-mini-pocket", price: 12.99, description: "Grinder compacto de 2 piezas ideal para llevar. Aluminio anodizado." },
  ];

  for (const p of paraProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        categoryId: parafernalia.id,
        productType: "SELECTED_GEAR",
        featured: p.featured || false,
      },
    });
  }
  console.log("✓ Parafernalia products created");

  // Blog posts
  const posts = [
    {
      slug: "como-curar-cogollos",
      title: "Cómo curar cogollos correctamente",
      excerpt: "La fase de curado es fundamental para obtener un producto de calidad. Te explicamos paso a paso.",
      content: "El curado es, sin duda, una de las fases más importantes del proceso...",
      tag: "Cuidados",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-28"),
    },
    {
      slug: "mejores-fertilizantes-organicos",
      title: "Los 5 mejores fertilizantes orgánicos",
      excerpt: "Repasamos los fertilizantes orgánicos más efectivos para cada fase del ciclo.",
      content: "Los fertilizantes orgánicos son la base de un cultivo saludable...",
      tag: "Cultivo",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-25"),
    },
    {
      slug: "indoor-vs-outdoor",
      title: "Indoor vs Outdoor: pros y contras",
      excerpt: "Analizamos las ventajas e inconvenientes de cada método de cultivo.",
      content: "La eterna pregunta entre cultivadores...",
      tag: "Cultivo",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-22"),
    },
    {
      slug: "guia-esquejes",
      title: "Guía completa de esquejes",
      excerpt: "Todo lo que necesitas saber para hacer esquejes exitosos.",
      content: "Hacer esquejes es una de las técnicas más útiles...",
      tag: "Cultivo",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-18"),
    },
    {
      slug: "como-hacer-mantequilla-cannabica",
      title: "Cómo hacer mantequilla cannábica",
      excerpt: "Receta paso a paso para preparar cannabutter de calidad en casa.",
      content: "La mantequilla cannábica es la base de la mayoría de recetas...",
      tag: "Recetas",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-12"),
    },
    {
      slug: "galletas-cannabis",
      title: "Receta: Galletas de cannabis perfectas",
      excerpt: "Galletas crujientes por fuera, tiernas por dentro.",
      content: "Para esta receta necesitarás mantequilla cannábica previamente preparada...",
      tag: "Recetas",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-05"),
    },
  ];

  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log("✓ Blog posts created");

  // Discount code
  await prisma.discount.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", percent: 10, active: true },
  });
  console.log("✓ Discount code WELCOME10 created");

  console.log("\n✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

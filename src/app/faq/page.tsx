import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — RYOKU",
  description: "Preguntas frecuentes sobre RYOKU, envíos, devoluciones y más.",
};

const faqs = [
  {
    q: "¿Qué es RYOKU?",
    a: "RYOKU es un archivo independiente sobre hash culture que también desarrolla merch y selecciona herramientas útiles para consumir, conservar y entender mejor el producto.",
  },
  {
    q: "¿Hacen envíos internacionales?",
    a: "Actualmente enviamos solo a España peninsular. Pronto ampliaremos a Baleares, Canarias y Europa.",
  },
  {
    q: "¿Cuánto tarda el envío?",
    a: "Los pedidos se procesan en 24-48h. El envío estándar tarda 2-4 días laborables.",
  },
  {
    q: "¿El envío es gratuito?",
    a: "Sí, para pedidos superiores a 60€. Para pedidos inferiores, el coste es de 4.90€.",
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "Sí, tienes 14 días desde la recepción para devolver cualquier producto en su estado original. Escríbenos a hola@ryoku.es y te indicamos el proceso.",
  },
  {
    q: "¿Cómo sé qué talla elegir?",
    a: "Cada producto tiene su propia guía de tallas en la ficha. Si tienes dudas, escríbenos y te ayudamos.",
  },
  {
    q: "¿Los productos seleccionados están probados?",
    a: "Sí. Solo recomendamos herramientas que hemos probado y que realmente cumplen su función. Cada producto incluye una explicación de para qué sirve y cuándo tiene sentido comprarlo.",
  },
  {
    q: "¿Puedo seguir el archivo sin comprar nada?",
    a: "Por supuesto. El archivo es independiente y gratuito. Puedes leer todos los artículos, usar el glosario y suscribirte a la newsletter sin necesidad de comprar.",
  },
];

export default function FAQPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">FAQ</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Preguntas frecuentes</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Todo lo que necesitas saber antes de comprar o explorar el archivo.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-xl border border-[var(--border)] overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium hover:bg-[var(--surface)] transition-colors list-none">
              {faq.q}
              <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-[var(--text-secondary)] mb-2">¿No encuentras lo que buscas?</p>
        <Link href="/contacto" className="text-sm text-[var(--brand)] hover:underline">
          Escríbenos directamente
        </Link>
      </div>
    </div>
  );
}

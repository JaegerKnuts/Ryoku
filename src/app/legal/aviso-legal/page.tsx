import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal — RYOKU",
};

export default function AvisoLegalPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">Legal</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Aviso Legal</h1>

      <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>
          En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa:
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Identificación del titular</h2>
        <p>
          Titular: RYOKU<br />
          Correo electrónico: hola@ryoku.es<br />
          España
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Propiedad intelectual e industrial</h2>
        <p>
          Todos los derechos de propiedad intelectual e industrial del sitio web, incluyendo
          textos, imágenes, diseños, logotipos y código fuente, pertenecen a RYOKU o a sus
          legítimos titulares. Queda prohibida la reproducción, distribución o modificación
          sin autorización expresa.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Exención de responsabilidad</h2>
        <p>
          El titular no se responsabiliza de los daños o perjuicios derivados del uso del sitio web,
          ni de la exactitud o actualización de la información proporcionada. El contenido del
          archivo tiene fines informativos y educativos.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Edad legal</h2>
        <p>
          Este sitio web está dirigido a mayores de edad. Al acceder y utilizar el sitio, declaras
          ser mayor de 18 años.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación española. Para cualquier controversia
          derivada del uso del sitio web, las partes se someten a los juzgados y tribunales
          de la ciudad correspondiente al domicilio del titular.
        </p>
      </div>

      <div className="mt-12">
        <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}

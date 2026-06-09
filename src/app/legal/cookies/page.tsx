import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies — RYOKU",
};

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">Legal</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Política de Cookies</h1>

      <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>
          Este sitio web utiliza cookies propias y de terceros para garantizar su funcionamiento
          y mejorar la experiencia del usuario.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando
          visitas un sitio web. Permiten recordar tus preferencias y mejorar la navegación.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Tipos de cookies utilizadas</h2>
        <ul className="space-y-2 pl-5">
          <li className="list-disc">
            <strong>Cookies técnicas:</strong> necesarias para el funcionamiento del sitio web
            (gestión de sesión, carrito de compra). No requieren consentimiento.
          </li>
          <li className="list-disc">
            <strong>Cookies de preferencias:</strong> permiten recordar tus preferencias
            (idioma, moneda).
          </li>
          <li className="list-disc">
            <strong>Cookies de análisis:</strong> recogen información anónima sobre el uso del
            sitio web para mejorar su funcionamiento.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Gestión de cookies</h2>
        <p>
          Puedes configurar, bloquear o eliminar las cookies en cualquier momento desde la
          configuración de tu navegador. A continuación, los enlaces para los navegadores más
          comunes:
        </p>
        <ul className="space-y-1 pl-5">
          <li className="list-disc text-xs">
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand)]">Google Chrome</a>
          </li>
          <li className="list-disc text-xs">
            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand)]">Mozilla Firefox</a>
          </li>
          <li className="list-disc text-xs">
            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand)]">Safari</a>
          </li>
        </ul>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Consentimiento</h2>
        <p>
          Al continuar navegando en este sitio web, consientes el uso de cookies según lo
          descrito en esta política. La desactivación de cookies técnicas puede afectar al
          funcionamiento del sitio.
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

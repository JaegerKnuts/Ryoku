import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad — RYOKU",
};

export default function PrivacidadPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto prose-sm">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">Legal</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Política de Privacidad</h1>

      <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p>
          En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD)
          y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos
          digitales (LOPDGDD), te informamos sobre el tratamiento de tus datos personales.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Responsable del tratamiento</h2>
        <p>
          Responsable: RYOKU<br />
          Correo electrónico: hola@ryoku.es<br />
          España
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Finalidad del tratamiento</h2>
        <p>Tus datos personales se recogen y tratan con las siguientes finalidades:</p>
        <ul className="space-y-2 pl-5">
          <li className="list-disc">Gestión de pedidos y facturación</li>
          <li className="list-disc">Envío de comunicaciones comerciales (newsletter) previo consentimiento</li>
          <li className="list-disc">Atención al cliente y resolución de incidencias</li>
          <li className="list-disc">Cumplimiento de obligaciones legales aplicables</li>
        </ul>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Legitimación</h2>
        <p>
          La base legal para el tratamiento de tus datos es la ejecución de un contrato (compraventa)
          y, en su caso, el consentimiento expreso para el envío de comunicaciones comerciales.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Destinatarios</h2>
        <p>
          No cedemos tus datos a terceros salvo obligación legal o para la ejecución del servicio
          (plataforma de pago, transporte). En estos casos, los encargados de tratamiento cumplen
          con la normativa aplicable.
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, portabilidad
          y oposición escribiendo a hola@ryoku.es. También puedes presentar una reclamación ante
          la Agencia Española de Protección de Datos (AEPD).
        </p>

        <h2 className="text-lg font-bold text-[var(--text)] mt-8">Consentimiento newsletter</h2>
        <p>
          El consentimiento para el envío de la newsletter se obtiene mediante una acción afirmativa
          (click en "Suscribirme") y puede ser revocado en cualquier momento.
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

import { Metadata } from "next";
import Link from "next/link";
import { Send, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto — RYOKU",
  description: "Ponte en contacto con RYOKU. Estamos en España.",
};

export default function ContactoPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">Contacto</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Escríbenos</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Respuesta en menos de 24h. Sin formularios automáticos.
        </p>
      </div>

      <div className="grid gap-6 mb-12">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)]">
          <Mail className="w-5 h-5 text-[var(--brand)]" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <a href="mailto:hola@ryoku.es" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">
              hola@ryoku.es
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)]">
          <Send className="w-5 h-5 text-[var(--brand)]" />
          <div>
            <p className="text-sm font-medium">Telegram</p>
            <a href="https://t.me/ryoku" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors">
              @ryoku
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)]">
          <MapPin className="w-5 h-5 text-[var(--brand)]" />
          <div>
            <p className="text-sm font-medium">Ubicación</p>
            <p className="text-sm text-[var(--text-secondary)]">España</p>
          </div>
        </div>
      </div>

      <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
        ← Volver al inicio
      </Link>
    </div>
  );
}

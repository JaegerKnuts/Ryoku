"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      }
    } catch {}
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="relative p-10 sm:p-14 border-2 overflow-hidden" style={{ borderColor: 'var(--ink)', borderRadius: 'var(--radius-lg)' }}>
          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-16 h-[3px]" style={{ background: 'var(--brand)' }} />
          <div className="absolute top-0 left-0 h-16 w-[3px]" style={{ background: 'var(--brand)' }} />

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl uppercase tracking-tight mb-3" style={{ fontFamily: 'var(--font-bebas), Impact, sans-serif' }}>
              Únete a la familia
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              Drops exclusivos, descuentos y contenido directo a tu bandeja. Sin spam.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-4 py-3 border text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
                  style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)' }}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold text-sm uppercase tracking-wider transition-all hover:opacity-90"
                  style={{ background: 'var(--brand)', borderRadius: 'var(--radius)' }}
                >
                  <Send className="w-4 h-4" />
                  Suscribirme
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[var(--brand)] font-medium"
              >
                ✓ ¡Bienvenido a la familia! Revisa tu correo.
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

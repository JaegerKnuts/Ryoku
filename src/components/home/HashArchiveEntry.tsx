"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowRight, Hash, FlaskConical, ShieldCheck, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Hash,
    title: "Extracciones",
    desc: "Dry sift, iceolator, static sift y métodos explicados paso a paso.",
  },
  {
    icon: FlaskConical,
    title: "Materia prima",
    desc: "Fresh frozen, material seco, WPFF y single source.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad",
    desc: "Micrajes, estrellas, full melt y full spectrum sin etiquetas vacías.",
  },
  {
    icon: Lightbulb,
    title: "Glosario",
    desc: "Definiciones breves para entender cada término sin rodeos.",
  },
];

export function HashArchiveEntry() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative p-10 sm:p-14 border-2 overflow-hidden"
        style={{ borderColor: "var(--ink)", borderRadius: "var(--radius-lg)" }}
      >
        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-16 h-[3px]" style={{ background: "var(--brand)" }} />
        <div className="absolute top-0 left-0 h-16 w-[3px]" style={{ background: "var(--brand)" }} />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] mb-3 font-medium" style={{ color: "var(--brand)" }}>
            Conocimiento
          </p>
          <h2 className="text-4xl sm:text-6xl uppercase tracking-tight mb-4" style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}>
            RYØKU Hash Archive
          </h2>
          <p className="text-base max-w-2xl leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
            Una guía en constante evolución para entender qué estás consumiendo,
            cómo se obtiene y qué significa realmente cada término.
            Sin repetir etiquetas vacías. Desde los conceptos básicos hasta los
            matices que separan dos extracciones aparentemente similares.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30 transition-colors"
                >
                  <Icon className="w-5 h-5 mb-3" style={{ color: "var(--brand)" }} />
                  <h3 className="text-sm font-bold mb-1">{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm uppercase tracking-[0.1em] transition-all hover:opacity-90"
            style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
          >
            Empezar desde cero
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

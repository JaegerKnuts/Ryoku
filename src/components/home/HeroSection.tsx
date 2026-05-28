"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Rising Sun background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative w-[700px] h-[700px]"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
            style={{ background: "var(--brand)", opacity: 0.07 }}
          />
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 h-[350px] w-[2px] origin-bottom"
              style={{
                background: "linear-gradient(to top, transparent, var(--brand))",
                opacity: 0.04,
                transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Ink splatter dots */}
      <div className="absolute top-20 right-20 w-3 h-3 rounded-full" style={{ background: "var(--ink)", opacity: 0.1 }} />
      <div className="absolute bottom-40 left-16 w-2 h-2 rounded-full" style={{ background: "var(--ink)", opacity: 0.08 }} />
      <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand)", opacity: 0.15 }} />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] mb-6 font-medium"
            style={{ color: "var(--brand)" }}
          >
            Streetwear · Smoking Culture · España
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[clamp(4rem,12vw,9rem)] leading-[0.85] font-bold uppercase tracking-tight mb-8"
            style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
          >
            Cultura<br />
            <span style={{ color: "var(--brand)" }}>que se lleva</span><br />
            puesta.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg max-w-lg leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Ropa, accesorios de fumador y contenido real. Todo diseñado y fabricado en España con la identidad Ryoku.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-sm uppercase tracking-[0.1em] transition-all hover:shadow-lg"
              style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
            >
              Explorar tienda
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 font-semibold text-sm uppercase tracking-[0.1em] transition-all hover:border-[var(--brand)] hover:text-[var(--brand)]"
              style={{ borderColor: "var(--ink)", color: "var(--ink)", borderRadius: "var(--radius)" }}
            >
              Leer el blog
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Brush stroke bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left"
        style={{ background: "var(--brand)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

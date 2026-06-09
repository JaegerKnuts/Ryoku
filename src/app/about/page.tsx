"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Shirt, Wrench, Sparkles } from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "Archivo especializado",
    description: "No somos una tienda genérica. Construimos un archivo independiente sobre hash culture con contenido real, explicado sin humo.",
  },
  {
    icon: Sparkles,
    title: "Conocimiento primero",
    description: "La tienda es una extensión del contenido, no el centro. Cada producto está vinculado a un artículo que explica su uso y por qué tiene sentido.",
  },
  {
    icon: Shirt,
    title: "Merch con identidad",
    description: "Camisetas, sudaderas, pegatinas y drops limitados. Ropa que cuenta historias y no encontrarás en ningún otro sitio.",
  },
  {
    icon: Wrench,
    title: "Herramientas seleccionadas",
    description: "Seleccionamos accesorios útiles para consumir, conservar y entender mejor el producto. Nada de dropshipping sin criterio.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-4">
            Sobre Ryoku
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Archivo independiente<br />
            <span className="text-gradient">sobre hash culture</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            RYØKU es un archivo independiente sobre hash culture que también desarrolla merch
            y selecciona herramientas útiles para consumir, conservar y entender mejor el producto.
            Todo desde España, con criterio y sin etiquetas vacías.
          </p>
        </motion.div>
      </section>

      {/* Image banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative h-[50vh] mb-20"
      >
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=800&fit=crop"
          alt="Ryoku lifestyle"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/50" />
      </motion.section>

      {/* Values */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">
            Valores
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Lo que nos define
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-glow)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[var(--brand)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <h2 className="text-2xl font-bold mb-3">¿Quieres saber más?</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Síguenos en redes, explora el archivo o escríbenos directamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:bg-[var(--brand-hover)] transition-colors"
            >
              Explorar el archivo
            </Link>
            <a
              href="https://instagram.com/ryoku"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[var(--border)] text-sm rounded-full text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--text)] transition-all"
            >
              @ryoku en Instagram
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

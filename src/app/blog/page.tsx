"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";

const tags = ["Todo", "Cultivo", "Recetas", "Cuidados", "Genética", "Novedades"];

const mockPosts = [
  {
    id: 1, slug: "como-curar-cogollos",
    title: "Cómo curar cogollos correctamente",
    excerpt: "La fase de curado es fundamental para obtener un producto de calidad. Te explicamos paso a paso cómo hacerlo bien.",
    image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=800&h=800&fit=crop",
    likes: 234, comments: 18, tag: "Cuidados", date: "28 May 2026",
  },
  {
    id: 2, slug: "mejores-fertilizantes-organicos",
    title: "Los 5 mejores fertilizantes orgánicos",
    excerpt: "Repasamos los fertilizantes orgánicos más efectivos para cada fase del ciclo de vida de la planta.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
    likes: 187, comments: 12, tag: "Cultivo", date: "25 May 2026",
  },
  {
    id: 3, slug: "indoor-vs-outdoor",
    title: "Indoor vs Outdoor: pros y contras",
    excerpt: "Analizamos las ventajas e inconvenientes de cultivar en interior frente al exterior.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=800&fit=crop",
    likes: 312, comments: 27, tag: "Cultivo", date: "22 May 2026",
  },
  {
    id: 4, slug: "guia-esquejes",
    title: "Guía completa de esquejes",
    excerpt: "Todo lo que necesitas saber para hacer esquejes exitosos: herramientas, técnica y errores comunes.",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
    likes: 156, comments: 9, tag: "Cultivo", date: "18 May 2026",
  },
  {
    id: 5, slug: "nutrientes-fase-floracion",
    title: "Nutrientes en fase de floración",
    excerpt: "Qué nutrientes necesita tu planta durante la floración y cómo administrarlos correctamente.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=800&fit=crop",
    likes: 201, comments: 14, tag: "Cuidados", date: "15 May 2026",
  },
  {
    id: 6, slug: "como-hacer-mantequilla-cannabica",
    title: "Cómo hacer mantequilla cannábica",
    excerpt: "Receta paso a paso para preparar cannabutter de calidad en casa, con dosificación incluida.",
    image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&h=800&fit=crop",
    likes: 445, comments: 38, tag: "Recetas", date: "12 May 2026",
  },
  {
    id: 7, slug: "variedades-autoflorecientes",
    title: "Las mejores variedades autoflorecientes de 2026",
    excerpt: "Selección de las autos más potentes y productivas de este año.",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=800&fit=crop",
    likes: 289, comments: 22, tag: "Genética", date: "10 May 2026",
  },
  {
    id: 8, slug: "ph-del-agua-riego",
    title: "pH del agua de riego: la clave que muchos ignoran",
    excerpt: "El pH correcto puede marcar la diferencia entre una cosecha mediocre y una excepcional.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
    likes: 178, comments: 11, tag: "Cuidados", date: "8 May 2026",
  },
  {
    id: 9, slug: "galletas-cannabis",
    title: "Receta: Galletas de cannabis perfectas",
    excerpt: "Galletas crujientes por fuera, tiernas por dentro. Con dosificación precisa para un efecto controlado.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop",
    likes: 523, comments: 41, tag: "Recetas", date: "5 May 2026",
  },
];

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState("Todo");

  const filtered = activeTag === "Todo"
    ? mockPosts
    : mockPosts.filter((p) => p.tag === activeTag);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">
          Blog
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
          Cultura sin filtros.
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-lg">
          Guías, recetas, tips de cultivo y todo lo que necesitas saber. Contenido real, sin rodeos.
        </p>
      </motion.div>

      {/* Tags filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2"
      >
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTag === tag
                ? "bg-[var(--brand)] text-black"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Instagram-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)] mb-4">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                {/* Hover stats */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-5 text-white text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5 fill-white" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5" />
                      {post.comments}
                    </span>
                  </div>
                </div>
                {/* Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white rounded-full backdrop-blur-sm">
                  {post.tag}
                </span>
              </div>

              {/* Content */}
              <div>
                <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-1.5">
                  {post.date}
                </p>
                <h2 className="text-base font-semibold leading-tight mb-2 group-hover:text-[var(--brand)] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>

            {/* Actions bar */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
              <button className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                <Heart className="w-3.5 h-3.5" />
                {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.comments}
              </button>
              <div className="flex-1" />
              <button className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

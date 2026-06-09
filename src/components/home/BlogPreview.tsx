"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    slug: "que-es-realmente-el-hash",
    title: "¿Qué es realmente el hash?",
    image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=600&h=600&fit=crop",
    likes: 234,
    comments: 18,
  },
  {
    id: 2,
    slug: "extraccion-dry-sift",
    title: "Extracción de dry sift: guía completa",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop",
    likes: 187,
    comments: 12,
  },
  {
    id: 3,
    slug: "curar-vs-mutar-hash",
    title: "Curar vs. mutar hash: no es lo mismo",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=600&fit=crop",
    likes: 312,
    comments: 27,
  },
  {
    id: 4,
    slug: "dry-sift-o-iceolator",
    title: "¿Dry sift o iceolator?",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop",
    likes: 156,
    comments: 9,
  },
  {
    id: 5,
    slug: "full-melt-vs-full-spectrum",
    title: "Full melt vs. full spectrum",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=600&fit=crop",
    likes: 201,
    comments: 14,
  },
  {
    id: 6,
    slug: "micrajes-del-hash",
    title: "Micrajes del hash: lo que significan",
    image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&h=600&fit=crop",
    likes: 445,
    comments: 38,
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] mb-2 font-medium" style={{ color: 'var(--brand)' }}>
            Hash Archive
          </p>
          <h2 className="text-5xl sm:text-6xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-bebas), Impact, sans-serif' }}>
            Últimos artículos
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
        >
          Ver todo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Instagram-style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {mockPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group relative block aspect-square overflow-hidden bg-[var(--surface)]"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {/* Hover overlay with stats */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-white text-sm font-medium">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </span>
                </div>
              </div>
              {/* Red line accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: 'var(--brand)' }} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]"
        >
          Ver todo el archivo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

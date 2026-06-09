"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    slug: "merch",
    title: "RYOKU MERCH",
    subtitle: "Camisetas, sudaderas, drops limitados",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&h=1000&fit=crop",
    count: 24,
  },
  {
    slug: "selected-gear",
    title: "RYOKU SELECTED GEAR",
    subtitle: "Grinders, tarros, herramientas de conservación",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=1000&fit=crop",
    count: 18,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] mb-2 font-medium" style={{ color: 'var(--brand)' }}>
          Categorías
        </p>
        <h2 className="text-5xl sm:text-6xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-bebas), Impact, sans-serif' }}>
          Merch y herramientas.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
          >
            <Link
              href={`/shop?cat=${cat.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
              {/* Red top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: 'var(--brand)' }} />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl text-white uppercase tracking-tight mb-1" style={{ fontFamily: 'var(--font-bebas), Impact, sans-serif' }}>
                  {cat.title}
                </h3>
                <p className="text-sm text-white/70">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

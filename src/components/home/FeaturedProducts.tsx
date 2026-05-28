"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "Hoodie Ryoku Classic",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
    category: "Ropa",
    badge: "Nuevo",
  },
  {
    id: 2,
    name: "Tee Haze Edition",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    category: "Ropa",
    badge: null,
  },
  {
    id: 3,
    name: "Rolling Tray Bamboo",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600&h=600&fit=crop",
    category: "Parafernalia",
    badge: "Top",
  },
  {
    id: 4,
    name: "Grinder Ryoku 4P",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop",
    category: "Parafernalia",
    badge: null,
  },
];

export function FeaturedProducts() {
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
            Catálogo
          </p>
          <h2 className="text-5xl sm:text-6xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-bebas), Impact, sans-serif' }}>
            Destacados
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
        >
          Ver todo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Product grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {mockProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={`/shop/producto/${product.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)] mb-3" style={{ borderRadius: 'var(--radius)' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: 'var(--brand)', borderRadius: 'var(--radius)' }}>
                    {product.badge}
                  </span>
                )}
                {/* Red line accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: 'var(--brand)' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5 group-hover:text-[var(--brand)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-bold">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile "ver todo" */}
      <div className="sm:hidden mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]"
        >
          Ver todo el catálogo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  featured: boolean;
  images: { url: string }[];
  category?: { name: string } | null;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] mb-2 font-medium" style={{ color: "var(--brand)" }}>
            Tienda
          </p>
          <h2 className="text-5xl sm:text-6xl uppercase tracking-tight" style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}>
            Productos seleccionados
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/shop/producto/${product.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)] mb-3" style={{ borderRadius: "var(--radius)" }}>
                {product.images[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--surface)]" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                {product.featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}>
                    Destacado
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: "var(--brand)" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5 group-hover:text-[var(--brand)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-bold">{Number(product.price).toFixed(2)} €</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)]">No hay productos destacados todavía.</p>
      )}

      <div className="sm:hidden mt-8 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
          Ver todo el catálogo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

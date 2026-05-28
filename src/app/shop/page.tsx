"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

const categories = [
  { slug: "todo", label: "Todo" },
  { slug: "ropa", label: "Ropa" },
  { slug: "parafernalia", label: "Parafernalia" },
];

const sortOptions = [
  { value: "novedades", label: "Novedades" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A–Z" },
];

const allProducts = [
  { id: 1, name: "Hoodie Ryoku Classic", price: 59.99, cat: "ropa", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop", badge: "Nuevo" },
  { id: 2, name: "Tee Haze Edition", price: 34.99, cat: "ropa", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop", badge: null },
  { id: 3, name: "Rolling Tray Bamboo", price: 24.99, cat: "parafernalia", image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600&h=600&fit=crop", badge: "Top" },
  { id: 4, name: "Grinder Ryoku 4P", price: 19.99, cat: "parafernalia", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop", badge: null },
  { id: 5, name: "Sudadera Kush Green", price: 64.99, cat: "ropa", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&h=600&fit=crop", badge: "Nuevo" },
  { id: 6, name: "Gorra Ryoku Snap", price: 29.99, cat: "ropa", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop", badge: null },
  { id: 7, name: "Papers Ryoku King Size", price: 3.99, cat: "parafernalia", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop", badge: null },
  { id: 8, name: "Mechero Clipper Ryoku", price: 4.99, cat: "parafernalia", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop", badge: null },
  { id: 9, name: "Tee OG Strain", price: 34.99, cat: "ropa", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop", badge: null },
  { id: 10, name: "Bandeja Ryoku Metal XL", price: 34.99, cat: "parafernalia", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop", badge: "Top" },
  { id: 11, name: "Hoodie Sativa Club", price: 62.99, cat: "ropa", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&h=600&fit=crop", badge: null },
  { id: 12, name: "Grinder Mini Pocket", price: 12.99, cat: "parafernalia", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop", badge: null },
];

export default function ShopPage() {
  const [activeCat, setActiveCat] = useState("todo");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("novedades");
  const [showSort, setShowSort] = useState(false);

  const filtered = allProducts
    .filter((p) => activeCat === "todo" || p.cat === activeCat)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "precio_asc") return a.price - b.price;
      if (sort === "precio_desc") return b.price - a.price;
      if (sort === "nombre") return a.name.localeCompare(b.name);
      return b.id - a.id;
    });

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
          Catálogo
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">Shop</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        {/* Category tabs */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCat(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                activeCat === cat.slug
                  ? "bg-[var(--brand)] text-black"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm w-full sm:w-56 placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--brand)] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Ordenar
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-lg z-20 overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                      sort === opt.value
                        ? "text-[var(--brand)] bg-[var(--brand-glow)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link href={`/shop/producto/${product.id}`} className="group block">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--surface)] mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--brand)] text-black rounded-full">
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="block w-full py-2.5 bg-white/95 text-black text-xs font-bold uppercase tracking-wider rounded-md text-center">
                      Ver producto
                    </span>
                  </div>
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
                  {product.cat === "ropa" ? "Ropa" : "Parafernalia"}
                </p>
                <h3 className="text-sm font-medium leading-tight mb-1 group-hover:text-[var(--brand)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold">{product.price.toFixed(2)} €</p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)] text-sm">No se encontraron productos.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  productType: string;
  featured: boolean;
  category: { name: string };
  images: { url: string; alt: string | null }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const categories = [
  { slug: "todo", label: "Todo" },
  { slug: "merch", label: "Merch" },
  { slug: "selected-gear", label: "Selected Gear" },
];

const sortOptions = [
  { value: "novedades", label: "Novedades" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A–Z" },
];

export default function ShopPage() {
  const [activeCat, setActiveCat] = useState("todo");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("novedades");
  const [showSort, setShowSort] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCat !== "todo") params.set("cat", activeCat);
      if (debouncedSearch) params.set("q", debouncedSearch);
      params.set("sort", sort);
      params.set("page", String(pagination.page));
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      
      if (data.products) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCat, debouncedSearch, sort, pagination.page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [activeCat, debouncedSearch, sort]);

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop";
  };

  const getProductBadge = (product: Product) => {
    if (product.featured) return "Destacado";
    if (product.comparePrice && product.comparePrice > product.price) return "Oferta";
    return null;
  };

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
          {loading ? "Cargando..." : `${pagination.total} producto${pagination.total !== 1 ? "s" : ""}`}
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
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Link href={`/shop/producto/${product.slug}`} className="group block">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--surface)] mb-3">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      {getProductBadge(product) && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--brand)] text-black rounded-full">
                          {getProductBadge(product)}
                        </span>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="block w-full py-2.5 bg-white/95 text-black text-xs font-bold uppercase tracking-wider rounded-md text-center">
                          Ver producto
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1">
                      {product.category?.name || (product.productType === "MERCH" ? "Merch" : "Selected Gear")}
                    </p>
                    <h3 className="text-sm font-medium leading-tight mb-1 group-hover:text-[var(--brand)] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{Number(product.price).toFixed(2)} €</p>
                      {product.comparePrice && (
                        <p className="text-xs text-[var(--text-muted)] line-through">
                          {Number(product.comparePrice).toFixed(2)} €
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--brand)] transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-[var(--text-secondary)]">
                Página {pagination.page} de {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--brand)] transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)] text-sm">No se encontraron productos.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

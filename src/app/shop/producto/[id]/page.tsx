"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, ChevronLeft, Star, Minus, Plus, Truck, Shield, RotateCcw, Check, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Variant {
  id: number;
  name: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  price: number | null;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  description: string | null;
  productType: string;
  category: { name: string };
  images: { url: string; alt: string | null }[];
  variants: Variant[];
  reviews: { rating: number; user: { name: string } }[];
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
        
        // Set default selections based on variants
        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants[0];
          if (firstVariant.color) setSelectedColor(firstVariant.color);
          if (firstVariant.size) setSelectedSize(firstVariant.size);
          setSelectedVariant(firstVariant);
        }
      } catch (err) {
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]);

  // Get unique sizes and colors from variants
  const getUniqueSizes = useCallback(() => {
    if (!product?.variants) return [];
    const sizes = product.variants
      .map(v => v.size)
      .filter((s): s is string => s !== null);
    return [...new Set(sizes)];
  }, [product?.variants]);

  const getUniqueColors = useCallback(() => {
    if (!product?.variants) return [];
    const colors = product.variants
      .map(v => ({ name: v.color, hex: v.colorHex }))
      .filter((c): c is { name: string; hex: string | null } => c.name !== null);
    // Remove duplicates by name
    return colors.filter((c, i, arr) => arr.findIndex(t => t.name === c.name) === i);
  }, [product?.variants]);

  // Update selected variant when size or color changes
  useEffect(() => {
    if (!product?.variants) return;
    
    const matchingVariant = product.variants.find(v => {
      const sizeMatch = !v.size || !selectedSize || v.size === selectedSize;
      const colorMatch = !v.color || !selectedColor || v.color === selectedColor;
      return sizeMatch && colorMatch;
    });
    
    setSelectedVariant(matchingVariant || null);
  }, [selectedSize, selectedColor, product?.variants]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const finalPrice = selectedVariant?.price || product.price;
    const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop";
    
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: imageUrl,
      size: selectedSize,
      color: selectedColor,
      variantId: selectedVariant?.id,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getStockForSelection = () => {
    if (!selectedVariant) return 0;
    return selectedVariant.stock;
  };

  const canAddToCart = () => {
    const sizes = getUniqueSizes();
    const colors = getUniqueColors();
    
    if (sizes.length > 0 && !selectedSize) return false;
    if (colors.length > 0 && !selectedColor) return false;
    if (getStockForSelection() < qty) return false;
    
    return true;
  };

  const getFinalPrice = () => {
    if (!product) return 0;
    return selectedVariant?.price || product.price;
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)] mb-4">{error || "Producto no encontrado"}</p>
          <Link href="/shop" className="text-[var(--brand)] hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const sizes = getUniqueSizes();
  const colors = getUniqueColors();
  const images = product.images?.length > 0 ? product.images : [{ url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop", alt: null }];
  const stock = getStockForSelection();

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)] mb-4">
            <Image
              src={images[selectedImage]?.url || images[0]?.url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-[var(--brand)]"
                      : "border-transparent hover:border-[var(--border)]"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">
            {product.category?.name || (product.productType === "ROPA" ? "Ropa" : "Parafernalia")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-3xl font-bold">{getFinalPrice().toFixed(2)} €</p>
            {product.comparePrice && product.comparePrice > getFinalPrice() && (
              <p className="text-xl text-[var(--text-muted)] line-through">
                {Number(product.comparePrice).toFixed(2)} €
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
                Color: <span className="text-[var(--text)]">{selectedColor || "Selecciona"}</span>
              </p>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-[var(--brand)] scale-110"
                        : "border-[var(--border)] hover:border-[var(--text-muted)]"
                    }`}
                    style={{ backgroundColor: color.hex || "#ccc" }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
                Talla
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-[var(--brand)] text-black"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--brand)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock info */}
          {selectedVariant && (
            <p className={`text-xs mb-4 ${stock > 5 ? "text-green-500" : stock > 0 ? "text-orange-500" : "text-red-500"}`}>
              {stock > 5 ? "✓ En stock" : stock > 0 ? `⚠ Solo quedan ${stock} unidades` : "✗ Sin stock"}
            </p>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              Cantidad
            </p>
            <div className="inline-flex items-center rounded-lg border border-[var(--border)]">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--surface)] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                disabled={stock > 0 && qty >= stock}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart() || added}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm rounded-full transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-[var(--brand)] text-white hover:opacity-90"
              }`}
            >
              {added ? (
                <><Check className="w-4 h-4" /> Añadido</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Añadir al carrito</>
              )}
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                liked
                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border)]">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-5 h-5 text-[var(--brand)]" />
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Envío gratis +60€
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Shield className="w-5 h-5 text-[var(--brand)]" />
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Pago seguro
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-5 h-5 text-[var(--brand)]" />
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Devolución 14 días
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

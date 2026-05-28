"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, ChevronLeft, Star, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const mockProduct = {
  id: 1,
  name: "Hoodie Ryoku Classic",
  price: 59.99,
  description: "Sudadera oversize de algodón orgánico 100%. Bordado Ryoku en el pecho y estampado trasero exclusivo. Fabricada en España con materiales premium. Corte unisex, ideal para el día a día.",
  images: [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
  ],
  category: "Ropa",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Negro", hex: "#111111" },
    { name: "Verde Oliva", hex: "#556B2F" },
    { name: "Blanco", hex: "#f5f5f5" },
  ],
  features: [
    "Algodón orgánico 100%",
    "Bordado a máquina reforzado",
    "Corte oversize unisex",
    "Fabricado en España",
  ],
  rating: 4.8,
  reviews: 24,
};

export default function ProductPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0].name);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      image: mockProduct.images[0],
      size: selectedSize,
      color: selectedColor,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3">
            {mockProduct.images.map((img, i) => (
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
                  src={img}
                  alt={`${mockProduct.name} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">
            {mockProduct.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {mockProduct.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(mockProduct.rating)
                      ? "text-[var(--brand)] fill-[var(--brand)]"
                      : "text-[var(--text-muted)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {mockProduct.rating} ({mockProduct.reviews} reseñas)
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold mb-6">{mockProduct.price.toFixed(2)} €</p>

          {/* Description */}
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
            {mockProduct.description}
          </p>

          {/* Color selector */}
          <div className="mb-6">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              Color: <span className="text-[var(--text)]">{selectedColor}</span>
            </p>
            <div className="flex gap-2">
              {mockProduct.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-[var(--brand)] scale-110"
                      : "border-[var(--border)] hover:border-[var(--text-muted)]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="mb-6">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              Talla
            </p>
            <div className="flex gap-2 flex-wrap">
              {mockProduct.sizes.map((size) => (
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
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--surface)] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm rounded-full transition-all uppercase tracking-wider ${
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

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-4">
              Características
            </p>
            <ul className="space-y-2">
              {mockProduct.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

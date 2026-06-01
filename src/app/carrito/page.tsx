"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 60;

export default function CartPage() {
  const { items, total: subtotal, updateQty, removeItem } = useCart();

  const freeShippingDiff = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">
          Tu carrito
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Carrito ({items.reduce((s, i) => s + i.qty, 0)})
        </h1>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <ShoppingBag className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] mb-6">Tu carrito está vacío.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:bg-[var(--brand-hover)] transition-colors"
          >
            Ir a la tienda
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-[var(--brand)]" />
                {freeShippingDiff > 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    Te faltan <strong className="text-[var(--text)]">{freeShippingDiff.toFixed(2)} €</strong> para envío gratis.
                  </p>
                ) : (
                  <p className="text-sm font-medium text-[var(--brand)]">¡Envío gratis!</p>
                )}
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[var(--brand)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Cart items */}
            {items.map((item, i) => (
              <motion.div
                key={`${item.id}-${item.variantId || 'no-variant'}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <Link href={`/shop/producto/${item.id}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--bg)] flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/producto/${item.id}`} className="font-medium text-sm hover:text-[var(--brand)] transition-colors">
                    {item.name}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{[item.color, item.size].filter(Boolean).join(" / ")}</p>
                  )}
                  <p className="text-sm font-semibold mt-1">{item.price.toFixed(2)} €</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center rounded-lg border border-[var(--border)]">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1, item.size, item.color, item.variantId)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1, item.size, item.color, item.variantId)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color, item.variantId)}
                      className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6">
                Resumen
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Envío</span>
                  <span>{freeShippingDiff > 0 ? "Calculado en checkout" : "Gratis"}</span>
                </div>
                <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:bg-[var(--brand-hover)] transition-all hover:shadow-[0_0_30px_rgba(139,195,74,0.3)] uppercase tracking-wider"
              >
                Tramitar pedido
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="block mt-4 text-center text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
              >
                ← Seguir comprando
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  // Clear cart on successful payment
  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">¡Pedido confirmado!</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Gracias por tu compra. Hemos recibido tu pedido correctamente.
        </p>

        {orderNumber && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-8">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Número de pedido</p>
            <p className="text-lg font-mono font-bold">{orderNumber}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-[var(--surface)] rounded-lg">
            <Mail className="w-5 h-5 text-[var(--brand)]" />
            <div className="text-left">
              <p className="text-sm font-medium">Confirmación por email</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Te enviaremos un email con los detalles de tu pedido
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[var(--surface)] rounded-lg">
            <Package className="w-5 h-5 text-[var(--brand)]" />
            <div className="text-left">
              <p className="text-sm font-medium">Envío en 3-5 días</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Recibirás tu pedido en la dirección indicada
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:bg-[var(--brand-hover)] transition-colors"
          >
            Seguir comprando
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border)] text-sm rounded-full hover:border-[var(--brand)] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

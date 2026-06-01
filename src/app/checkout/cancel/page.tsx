"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { XCircle, ArrowRight, CreditCard, Loader2 } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Pago cancelado</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          El proceso de pago ha sido cancelado. Tu pedido no ha sido procesado.
        </p>

        {orderNumber && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-8">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Número de pedido</p>
            <p className="text-lg font-mono font-bold">{orderNumber}</p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Este pedido quedará como pendiente. Puedes intentar el pago de nuevo.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:bg-[var(--brand-hover)] transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Intentar de nuevo
          </Link>
          <Link
            href="/carrito"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border)] text-sm rounded-full hover:border-[var(--brand)] transition-colors"
          >
            Volver al carrito
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}

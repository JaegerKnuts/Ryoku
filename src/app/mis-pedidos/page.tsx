"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight, Loader2, User, ShoppingBag, MapPin } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: number;
    name: string;
    slug: string;
    images: { url: string }[];
  };
  variant: {
    size: string | null;
    color: string | null;
  } | null;
}

interface Address {
  name: string;
  surname: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
  address: Address;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Pendiente" },
  PAID: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Pagado" },
  PROCESSING: { bg: "bg-purple-500/10", text: "text-purple-500", label: "Procesando" },
  SHIPPED: { bg: "bg-indigo-500/10", text: "text-indigo-500", label: "Enviado" },
  DELIVERED: { bg: "bg-green-500/10", text: "text-green-500", label: "Entregado" },
  CANCELLED: { bg: "bg-red-500/10", text: "text-red-500", label: "Cancelado" },
};

export default function MisPedidosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/mis-pedidos");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/mis-pedidos");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Mis pedidos</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Consulta el estado de tus pedidos y su historial
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
            <ShoppingBag className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] mb-4">No has realizado ningún pedido todavía</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand)] text-black font-semibold text-sm rounded-full hover:bg-[var(--brand-hover)] transition-colors"
            >
              Ir a la tienda
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = statusColors[order.status] || statusColors.PENDING;
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden"
                >
                  {/* Order header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-[var(--bg)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--bg)] rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-[var(--brand)]" />
                      </div>
                      <div className="text-left">
                        <p className="font-mono text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(order.createdAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                      <p className="font-semibold hidden sm:block">{Number(order.total).toFixed(2)} €</p>
                      <ChevronRight className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {/* Order details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--border)]"
                    >
                      {/* Items */}
                      <div className="p-4 sm:p-6 space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <Link href={`/shop/producto/${item.product.slug}`} className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--bg)] flex-shrink-0">
                              <Image
                                src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </Link>
                            <div className="flex-1">
                              <Link href={`/shop/producto/${item.product.slug}`} className="font-medium text-sm hover:text-[var(--brand)] transition-colors">
                                {item.product.name}
                              </Link>
                              {item.variant && (item.variant.size || item.variant.color) && (
                                <p className="text-xs text-[var(--text-muted)]">
                                  {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                                </p>
                              )}
                              <p className="text-sm text-[var(--text-secondary)]">
                                {item.quantity} x {Number(item.price).toFixed(2)} €
                              </p>
                            </div>
                            <p className="font-semibold text-sm">{Number(item.total).toFixed(2)} €</p>
                          </div>
                        ))}
                      </div>

                      {/* Shipping address */}
                      <div className="px-4 sm:px-6 py-4 border-t border-[var(--border)] bg-[var(--bg)]">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                          <p className="text-xs font-medium uppercase text-[var(--text-muted)]">Dirección de envío</p>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {order.address.name} {order.address.surname}<br />
                          {order.address.address}<br />
                          {order.address.postalCode} {order.address.city}, {order.address.province}
                        </p>
                      </div>

                      {/* Totals */}
                      <div className="px-4 sm:px-6 py-4 border-t border-[var(--border)]">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Subtotal</span>
                            <span>{Number(order.subtotal).toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Envío</span>
                            <span>{Number(order.shipping) === 0 ? "Gratis" : `${Number(order.shipping).toFixed(2)} €`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--border)]">
                            <span>Total</span>
                            <span>{Number(order.total).toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

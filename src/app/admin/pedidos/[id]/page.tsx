"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Loader2, Save } from "lucide-react";

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
  phone: string | null;
  country: string;
}

interface User {
  id: number;
  name: string | null;
  email: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  stripeId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address: Address;
  user: User;
}

const statusOptions = [
  { value: "PENDING", label: "Pendiente", color: "#D97706" },
  { value: "PAID", label: "Pagado", color: "#3B82F6" },
  { value: "PROCESSING", label: "Procesando", color: "#8B5CF6" },
  { value: "SHIPPED", label: "Enviado", color: "#6366F1" },
  { value: "DELIVERED", label: "Entregado", color: "#2D8B4E" },
  { value: "CANCELLED", label: "Cancelado", color: "#D41920" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/pedidos/${id}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setStatus(data.order.status);
        setNotes(data.order.notes || "");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        alert("Pedido actualizado correctamente");
      } else {
        alert("Error al actualizar el pedido");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-muted)]">Pedido no encontrado</p>
        <Link href="/admin/pedidos" className="text-[var(--brand)] hover:underline mt-4 inline-block">
          Volver a pedidos
        </Link>
      </div>
    );
  }

  const statusInfo = statusOptions.find(s => s.value === order.status) || statusOptions[0];

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pedidos" className="p-2 hover:bg-[var(--surface)] rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1
            className="text-4xl uppercase tracking-tight"
            style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
          >
            Pedido {order.orderNumber}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {new Date(order.createdAt).toLocaleString("es-ES")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status update */}
          <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-4">Estado del pedido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm bg-[var(--surface)]"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSave}
                  disabled={saving || (status === order.status && notes === (order.notes || ""))}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--brand)] text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar cambios
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">
                Notas internas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm bg-[var(--surface)] resize-none"
                placeholder="Notas sobre el pedido..."
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                  <th className="text-left p-4 font-semibold">Producto</th>
                  <th className="text-center p-4 font-semibold">Cantidad</th>
                  <th className="text-right p-4 font-semibold">Precio</th>
                  <th className="text-right p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--surface)]">
                          <Image
                            src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <Link 
                            href={`/shop/producto/${item.product.slug}`}
                            className="font-medium hover:text-[var(--brand)] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (item.variant.size || item.variant.color) && (
                            <p className="text-xs text-[var(--text-secondary)]">
                              {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">{item.quantity}</td>
                    <td className="p-4 text-right">{Number(item.price).toFixed(2)} €</td>
                    <td className="p-4 text-right font-semibold">{Number(item.total).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column - Customer & Shipping */}
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>{Number(order.subtotal).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Envío</span>
                <span>{Number(order.shipping) === 0 ? "Gratis" : `${Number(order.shipping).toFixed(2)} €`}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{Number(order.total).toFixed(2)} €</span>
              </div>
            </div>
            {order.stripeId && (
              <p className="text-xs text-[var(--text-muted)] mt-4">
                Stripe ID: <span className="font-mono">{order.stripeId}</span>
              </p>
            )}
          </div>

          {/* Customer info */}
          <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-4">Cliente</h2>
            <div className="text-sm">
              <p className="font-medium">{order.user.name || "Sin nombre"}</p>
              <p className="text-[var(--text-secondary)]">{order.user.email}</p>
              {order.user.id !== 1 && (
                <Link 
                  href={`/admin/usuarios`}
                  className="text-xs text-[var(--brand)] hover:underline mt-2 inline-block"
                >
                  Ver perfil del cliente
                </Link>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-4">Dirección de envío</h2>
            <div className="text-sm text-[var(--text-secondary)]">
              <p className="font-medium text-[var(--text)]">{order.address.name} {order.address.surname}</p>
              <p>{order.address.address}</p>
              <p>{order.address.postalCode} {order.address.city}</p>
              <p>{order.address.province}, {order.address.country}</p>
              {order.address.phone && <p className="mt-2">📞 {order.address.phone}</p>}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
            <h2 className="text-lg font-semibold mb-4">Estado actual</h2>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
              >
                {order.status === "DELIVERED" && <CheckCircle className="w-5 h-5" />}
                {order.status === "SHIPPED" && <Truck className="w-5 h-5" />}
                {order.status === "CANCELLED" && <XCircle className="w-5 h-5" />}
                {!["DELIVERED", "SHIPPED", "CANCELLED"].includes(order.status) && <Clock className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium" style={{ color: statusInfo.color }}>{statusInfo.label}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Actualizado: {new Date(order.updatedAt).toLocaleString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

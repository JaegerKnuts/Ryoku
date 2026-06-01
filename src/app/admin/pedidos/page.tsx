"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pedidos")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusColors: Record<string, { color: string; label: string }> = {
    PENDING: { color: "#D97706", label: "Pendiente" },
    PAID: { color: "#3B82F6", label: "Pagado" },
    PROCESSING: { color: "#8B5CF6", label: "Procesando" },
    SHIPPED: { color: "#6366F1", label: "Enviado" },
    DELIVERED: { color: "#2D8B4E", label: "Entregado" },
    CANCELLED: { color: "#D41920", label: "Cancelado" },
  };

  return (
    <div>
      <h1
        className="text-4xl uppercase tracking-tight mb-8"
        style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
      >
        Pedidos
      </h1>

      <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="text-left p-4 font-semibold">Nº Pedido</th>
              <th className="text-left p-4 font-semibold">Cliente</th>
              <th className="text-left p-4 font-semibold">Total</th>
              <th className="text-center p-4 font-semibold">Estado</th>
              <th className="text-right p-4 font-semibold">Fecha</th>
              <th className="text-center p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">Cargando...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">No hay pedidos aún</td></tr>
            ) : (
              orders.map((order) => {
                const statusInfo = statusColors[order.status] || { color: "#666", label: order.status };
                return (
                  <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                    <td className="p-4 font-mono font-medium">{order.orderNumber}</td>
                    <td className="p-4">{order.user?.name || order.user?.email}</td>
                    <td className="p-4 font-semibold">{Number(order.total).toFixed(2)} €</td>
                    <td className="p-4 text-center">
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded"
                        style={{ color: statusInfo.color, background: `${statusInfo.color}15` }}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[var(--text-secondary)]">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="p-2 rounded hover:bg-[var(--bg)] transition-colors inline-flex items-center justify-center"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

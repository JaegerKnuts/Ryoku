"use client";

import { useEffect, useState } from "react";

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

  const statusColors: Record<string, string> = {
    PENDING: "#D97706",
    CONFIRMED: "#2D8B4E",
    SHIPPED: "#6366F1",
    DELIVERED: "#2D8B4E",
    CANCELLED: "#D41920",
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">Cargando...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">No hay pedidos aún</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4 font-mono font-medium">{order.orderNumber}</td>
                  <td className="p-4">{order.user?.name || order.user?.email}</td>
                  <td className="p-4 font-semibold">{Number(order.total).toFixed(2)} €</td>
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{ color: statusColors[order.status] || "#666", background: `${statusColors[order.status] || "#666"}15` }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[var(--text-secondary)]">
                    {new Date(order.createdAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

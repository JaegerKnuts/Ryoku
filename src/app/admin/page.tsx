"use client";

import { useEffect, useState } from "react";
import { Package, FileText, ShoppingCart, Users, Folder, Tag } from "lucide-react";

interface Stats {
  products: number;
  posts: number;
  orders: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, posts: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Productos", value: stats.products, icon: Package, color: "var(--brand)" },
    { label: "Blog Posts", value: stats.posts, icon: FileText, color: "#2D8B4E" },
    { label: "Pedidos", value: stats.orders, icon: ShoppingCart, color: "#D97706" },
    { label: "Usuarios", value: stats.users, icon: Users, color: "#6366F1" },
  ];

  return (
    <div>
      <h1
        className="text-4xl uppercase tracking-tight mb-8"
        style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
      >
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <p className="text-3xl font-bold">
              {loading ? "—" : card.value}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <a
            href="/admin/productos/nuevo"
            className="p-4 border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition-colors text-center"
          >
            <Package className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--brand)" }} />
            <span className="text-sm font-medium">Nuevo producto</span>
          </a>
          <a
            href="/admin/categorias"
            className="p-4 border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition-colors text-center"
          >
            <Folder className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--brand)" }} />
            <span className="text-sm font-medium">Categorías</span>
          </a>
          <a
            href="/admin/blog/nuevo"
            className="p-4 border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition-colors text-center"
          >
            <FileText className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--brand)" }} />
            <span className="text-sm font-medium">Nuevo post</span>
          </a>
          <a
            href="/admin/descuentos"
            className="p-4 border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition-colors text-center"
          >
            <Tag className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--brand)" }} />
            <span className="text-sm font-medium">Descuentos</span>
          </a>
          <a
            href="/admin/pedidos"
            className="p-4 border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition-colors text-center"
          >
            <ShoppingCart className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--brand)" }} />
            <span className="text-sm font-medium">Ver pedidos</span>
          </a>
        </div>
      </div>
    </div>
  );
}

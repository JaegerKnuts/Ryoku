"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  active: boolean;
  featured: boolean;
  category?: { name: string };
}

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/admin/productos/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-4xl uppercase tracking-tight"
          style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
        >
          Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold uppercase tracking-wider transition-all"
          style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
        >
          <Plus className="w-4 h-4" /> Nuevo
        </Link>
      </div>

      <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="text-left p-4 font-semibold">Producto</th>
              <th className="text-left p-4 font-semibold">Categoría</th>
              <th className="text-left p-4 font-semibold">Precio</th>
              <th className="text-center p-4 font-semibold">Estado</th>
              <th className="text-right p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                  Cargando...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                  No hay productos
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{product.category?.name || "—"}</td>
                  <td className="p-4">{Number(product.price).toFixed(2)} €</td>
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{
                        background: product.active ? "rgba(45,139,78,0.1)" : "rgba(212,25,32,0.1)",
                        color: product.active ? "#2D8B4E" : "var(--brand)",
                      }}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="p-2 rounded hover:bg-[var(--surface)] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

export default function EditProducto() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    productType: "ROPA",
    featured: false,
    active: true,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/productos/${id}`).then((r) => r.json()),
      fetch("/api/admin/categorias").then((r) => r.json()),
    ]).then(([product, catData]) => {
      if (product && !product.error) {
        setForm({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          price: String(product.price || ""),
          comparePrice: product.comparePrice ? String(product.comparePrice) : "",
          categoryId: String(product.categoryId || ""),
          productType: product.productType || "ROPA",
          featured: product.featured || false,
          active: product.active !== false,
        });
      }
      setCategories(catData.categories || []);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        categoryId: Number(form.categoryId),
        productType: form.productType,
        featured: form.featured,
        active: form.active,
      }),
    });

    if (res.ok) {
      router.push("/admin/productos");
    } else {
      const data = await res.json();
      alert(data.error || "Error al guardar");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-[var(--text-muted)]">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="p-2 hover:bg-[var(--surface)] rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1
          className="text-4xl uppercase tracking-tight"
          style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
        >
          Editar Producto
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-[var(--bg)] p-8 rounded-lg border border-[var(--border)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Precio (€) *</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Precio anterior (€)</label>
            <input
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Categoría *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Tipo</label>
            <select
              value={form.productType}
              onChange={(e) => setForm({ ...form, productType: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="ROPA">Ropa</option>
              <option value="PARAFERNALIA">Parafernalia</option>
            </select>
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[var(--brand)]"
              />
              <span className="text-sm">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-[var(--brand)]"
              />
              <span className="text-sm">Activo</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-white font-semibold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
            style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link
            href="/admin/productos"
            className="px-6 py-3 border border-[var(--border)] text-sm font-medium rounded-md hover:bg-[var(--surface)] transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

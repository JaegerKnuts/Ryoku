"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  _count?: { products: number };
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categorias?withCount=true");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories.sort((a: Category, b: Category) => a.order - b.order));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreate = async () => {
    if (!newCategory.name.trim()) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.name,
          slug: newCategory.slug || generateSlug(newCategory.name),
          description: newCategory.description || null,
          order: categories.length,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, data.category]);
        setNewCategory({ name: "", slug: "", description: "" });
      } else {
        alert("Error al crear categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear categoría");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return;

    try {
      const res = await fetch(`/api/admin/categorias/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert("Error al eliminar categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar categoría");
    }
  };

  const moveCategory = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index >= categories.length - 1)) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newCategories = [...categories];
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];

    // Update orders
    try {
      const res = await fetch("/api/admin/categorias/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryIds: newCategories.map(c => c.id),
        }),
      });

      if (res.ok) {
        setCategories(newCategories);
      }
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl uppercase tracking-tight mb-8" style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}>
          Categorías
        </h1>
        <p className="text-[var(--text-muted)]">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-[var(--surface)] rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-4xl uppercase tracking-tight" style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}>
          Categorías
        </h1>
      </div>

      {/* Add new category */}
      <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--border)] mb-6">
        <h2 className="text-lg font-semibold mb-4">Nueva categoría</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">Nombre *</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: generateSlug(e.target.value) })}
              placeholder="Ej: Ropa"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">Slug</label>
            <input
              type="text"
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              placeholder="ropa"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md text-sm bg-[var(--surface)]"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase text-[var(--text-secondary)] mb-2">Descripción</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Opcional"
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md text-sm"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!newCategory.name.trim() || saving}
              className="px-4 py-2 bg-[var(--brand)] text-black font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              Añadir
            </button>
          </div>
        </div>
      </div>

      {/* Categories list */}
      <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="text-left p-4 font-semibold w-16">Orden</th>
              <th className="text-left p-4 font-semibold">Nombre</th>
              <th className="text-left p-4 font-semibold">Slug</th>
              <th className="text-left p-4 font-semibold">Descripción</th>
              <th className="text-center p-4 font-semibold">Productos</th>
              <th className="text-center p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                  No hay categorías creadas
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveCategory(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-[var(--bg)] rounded disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <span className="font-mono text-[var(--text-muted)]">{category.order}</span>
                      <button
                        onClick={() => moveCategory(index, "down")}
                        disabled={index === categories.length - 1}
                        className="p-1 hover:bg-[var(--bg)] rounded disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4 font-mono text-sm text-[var(--text-secondary)]">{category.slug}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{category.description || "—"}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[var(--surface)]">
                      {category._count?.products || 0}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

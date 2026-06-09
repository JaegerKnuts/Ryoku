"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, Package } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  name: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  price: number | null;
  stock: number;
  sku: string | null;
}

interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  order: number;
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
    productType: "MERCH",
    featured: false,
    active: true,
  });
  
  // Variants
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState({
    name: "",
    size: "",
    color: "",
    colorHex: "#000000",
    price: "",
    stock: "0",
    sku: "",
  });
  
  // Images
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

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
          productType: product.productType || "MERCH",
          featured: product.featured || false,
          active: product.active !== false,
        });
        setVariants(product.variants || []);
        setImages(product.images?.sort((a: ProductImage, b: ProductImage) => a.order - b.order) || []);
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

  // Variant handlers
  const addVariant = async () => {
    const res = await fetch(`/api/admin/productos/${id}/variantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newVariant.name || `${newVariant.size} ${newVariant.color}`,
        size: newVariant.size || null,
        color: newVariant.color || null,
        colorHex: newVariant.colorHex || null,
        price: newVariant.price ? parseFloat(newVariant.price) : null,
        stock: parseInt(newVariant.stock) || 0,
        sku: newVariant.sku || null,
      }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setVariants([...variants, data.variant]);
      setNewVariant({ name: "", size: "", color: "", colorHex: "#000000", price: "", stock: "0", sku: "" });
    } else {
      alert("Error al crear variante");
    }
  };

  const removeVariant = async (variantId: number) => {
    const res = await fetch(`/api/admin/productos/${id}/variantes/${variantId}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      setVariants(variants.filter(v => v.id !== variantId));
    } else {
      alert("Error al eliminar variante");
    }
  };

  // Image handlers
  const addImage = async () => {
    if (!newImageUrl.trim()) return;
    
    const res = await fetch(`/api/admin/productos/${id}/imagenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: newImageUrl,
        alt: newImageAlt || form.name,
        order: images.length,
      }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setImages([...images, data.image]);
      setNewImageUrl("");
      setNewImageAlt("");
    } else {
      alert("Error al añadir imagen");
    }
  };

  const removeImage = async (imageId: number) => {
    const res = await fetch(`/api/admin/productos/${id}/imagenes/${imageId}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      setImages(images.filter(img => img.id !== imageId));
    } else {
      alert("Error al eliminar imagen");
    }
  };

  const moveImage = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index >= images.length - 1)) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    // Update orders
    const res = await fetch(`/api/admin/productos/${id}/imagenes/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageIds: newImages.map(img => img.id),
      }),
    });
    
    if (res.ok) {
      setImages(newImages);
    }
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
              <option value="MERCH">Merch</option>
              <option value="SELECTED_GEAR">Selected Gear</option>
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

        {/* Images Section */}
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-[var(--brand)]" />
            <h2 className="text-lg font-semibold">Imágenes</h2>
          </div>
          
          {/* Add image */}
          <div className="flex gap-3 mb-4">
            <input
              type="url"
              placeholder="URL de la imagen"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-[var(--border)] rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Texto alternativo (opcional)"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
              className="w-48 px-4 py-2 border border-[var(--border)] rounded-md text-sm"
            />
            <button
              type="button"
              onClick={addImage}
              disabled={!newImageUrl.trim()}
              className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:bg-[var(--bg)] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Image list */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-[var(--surface)]">
                    <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="p-1 bg-white rounded text-black disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                      className="p-1 bg-white rounded text-black disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-1 bg-red-500 rounded text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--brand)] text-black text-xs font-bold rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No hay imágenes</p>
          )}
        </div>

        {/* Variants Section */}
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[var(--brand)]" />
            <h2 className="text-lg font-semibold">Variantes</h2>
          </div>

          {/* Add variant */}
          <div className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)] mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Talla M Negro"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Talla</label>
                <input
                  type="text"
                  placeholder="S, M, L..."
                  value={newVariant.size}
                  onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Color</label>
                <input
                  type="text"
                  placeholder="Negro..."
                  value={newVariant.color}
                  onChange={(e) => setNewVariant({...newVariant, color: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Hex</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newVariant.colorHex}
                    onChange={(e) => setNewVariant({...newVariant, colorHex: e.target.value})}
                    className="w-10 h-9 border border-[var(--border)] rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newVariant.colorHex}
                    onChange={(e) => setNewVariant({...newVariant, colorHex: e.target.value})}
                    className="flex-1 px-2 py-2 border border-[var(--border)] rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Opcional"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1">Stock *</label>
                <input
                  type="number"
                  value={newVariant.stock}
                  onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--text-secondary)] mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="Código"
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="p-2 bg-[var(--brand)] text-black rounded hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Variants list */}
          {variants.length > 0 ? (
            <div className="space-y-2">
              {variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-3 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  {variant.colorHex && (
                    <div 
                      className="w-6 h-6 rounded-full border border-[var(--border)]"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{variant.name || `${variant.size} ${variant.color}`}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Stock: {variant.stock} 
                      {variant.price && ` • Precio: ${variant.price}€`}
                      {variant.sku && ` • SKU: ${variant.sku}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No hay variantes</p>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
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

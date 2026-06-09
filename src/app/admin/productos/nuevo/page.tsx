"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, Package } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

interface Variant {
  id: string;
  name: string;
  size: string;
  color: string;
  colorHex: string;
  price: string;
  stock: string;
  sku: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export default function NuevoProducto() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
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
  
  // Images
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  useEffect(() => {
    fetch("/api/admin/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        categoryId: Number(form.categoryId),
        variants: variants.map(v => ({
          ...v,
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock) || 0,
        })),
        images: images.map((img, idx) => ({ ...img, order: idx })),
      }),
    });

    if (res.ok) {
      router.push("/admin/productos");
    } else {
      const data = await res.json();
      alert(data.error || "Error al crear producto");
    }
    setLoading(false);
  };

  // Variant handlers
  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: "",
      size: "",
      color: "",
      colorHex: "#000000",
      price: "",
      stock: "0",
      sku: "",
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (id: string, field: keyof Variant, value: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  // Image handlers
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    const newImage: ProductImage = {
      id: Date.now().toString(),
      url: newImageUrl,
      alt: newImageAlt || form.name,
      order: images.length,
    };
    setImages([...images, newImage]);
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      setImages(newImages);
    } else if (direction === "down" && index < images.length - 1) {
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setImages(newImages);
    }
  };

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
          Nuevo Producto
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-[var(--bg)] p-8 rounded-lg border border-[var(--border)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
              required
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Precio (€) *
            </label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Precio anterior (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Categoría *
            </label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Tipo
            </label>
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
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
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
            <p className="text-sm text-[var(--text-muted)]">No hay imágenes añadidas</p>
          )}
        </div>

        {/* Variants Section */}
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[var(--brand)]" />
              <h2 className="text-lg font-semibold">Variantes</h2>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:bg-[var(--bg)] transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Añadir variante
            </button>
          </div>

          {variants.length > 0 ? (
            <div className="space-y-3">
              {variants.map((variant) => (
                <div key={variant.id} className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1">Nombre</label>
                      <input
                        type="text"
                        placeholder="Ej: Talla M Negro"
                        value={variant.name}
                        onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1">Talla</label>
                      <input
                        type="text"
                        placeholder="S, M, L..."
                        value={variant.size}
                        onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1">Color</label>
                      <input
                        type="text"
                        placeholder="Negro..."
                        value={variant.color}
                        onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1">Hex</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={variant.colorHex}
                          onChange={(e) => updateVariant(variant.id, "colorHex", e.target.value)}
                          className="w-10 h-9 border border-[var(--border)] rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={variant.colorHex}
                          onChange={(e) => updateVariant(variant.id, "colorHex", e.target.value)}
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
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1">Stock *</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-[var(--text-secondary)] mb-1">SKU</label>
                        <input
                          type="text"
                          placeholder="Código"
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              No hay variantes. Añade variantes si el producto tiene diferentes tallas, colores o combinaciones.
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-white font-semibold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
            style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
          >
            {loading ? "Creando..." : "Crear producto"}
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

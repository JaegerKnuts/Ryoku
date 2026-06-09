"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BlogTagField from "@/components/admin/BlogTagField";
import BlogEditor from "@/components/admin/blog/BlogEditor";
import BlogPostEditorLayout from "@/components/admin/blog/BlogPostEditorLayout";

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tag: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((post) => {
        if (post && !post.error) {
          setForm({
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            tag: post.tag || "",
            status: post.status || "DRAFT",
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/blog");
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
    <BlogPostEditorLayout
      title="Editar Post"
      preview={{
        postTitle: form.title,
        excerpt: form.excerpt,
        tag: form.tag,
        content: form.content,
      }}
    >
      <form onSubmit={handleSubmit} className="bg-[var(--bg)] p-6 sm:p-8 rounded-lg border border-[var(--border)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Extracto</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            Contenido del post
          </label>
          <BlogEditor
            key={id}
            value={form.content}
            onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            postTitle={form.title}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Sección</label>
            <BlogTagField
              value={form.tag}
              onChange={(tag) => setForm({ ...form, tag })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Estado</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
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
            href="/admin/blog"
            className="px-6 py-3 border border-[var(--border)] text-sm font-medium rounded-md hover:bg-[var(--surface)] transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </BlogPostEditorLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  tag: string | null;
  publishedAt: string | null;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-4xl uppercase tracking-tight"
          style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}
        >
          Blog Posts
        </h1>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold uppercase tracking-wider transition-all"
          style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
        >
          <Plus className="w-4 h-4" /> Nuevo post
        </Link>
      </div>

      <div className="bg-[var(--bg)] rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="text-left p-4 font-semibold">Título</th>
              <th className="text-left p-4 font-semibold">Tag</th>
              <th className="text-center p-4 font-semibold">Estado</th>
              <th className="text-right p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">Cargando...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">No hay posts</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{post.tag || "—"}</td>
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded"
                      style={{
                        background: post.status === "PUBLISHED" ? "rgba(45,139,78,0.1)" : "rgba(212,25,32,0.1)",
                        color: post.status === "PUBLISHED" ? "#2D8B4E" : "var(--brand)",
                      }}
                    >
                      {post.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/${post.id}`} className="p-2 rounded hover:bg-[var(--surface)] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className="p-2 rounded hover:bg-red-50 text-red-500 transition-colors">
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

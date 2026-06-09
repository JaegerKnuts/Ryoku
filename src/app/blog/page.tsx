"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark, Loader2, ArrowRight } from "lucide-react";
import { getBlogPostImage } from "@/lib/blog";
import { START_HERE_TAG } from "@/lib/blog-tags";
import { isPostSaved, toggleSavedPost } from "@/lib/local-prefs";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tag: string;
  status: string;
  createdAt: string;
  images: { url: string; alt: string | null }[];
  likes: { id: number }[];
  comments: { id: number }[];
}

export default function BlogPage() {
  const [tags, setTags] = useState<string[]>(["Todo"]);
  const [activeTag, setActiveTag] = useState("Todo");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [likeState, setLikeState] = useState<Record<string, { liked: boolean; count: number }>>({});

  useEffect(() => {
    fetch("/api/blog/tags")
      .then((res) => res.json())
      .then((data) => {
        const existing = data.tags || [];
        setTags(["Todo", ...existing]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeTag]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTag !== "Todo") params.set("tag", activeTag);
      params.set("page", "1");
      params.set("limit", "12");

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      
      if (data.posts) {
        setPosts(data.posts);
        setPagination(data.pagination);
        const saved: Record<string, boolean> = {};
        data.posts.forEach((post: BlogPost) => {
          saved[post.slug] = isPostSaved(post.slug);
        });
        setSavedPosts(saved);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleLike = async (slug: string) => {
    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      setLikeState((prev) => ({ ...prev, [slug]: { liked: data.liked, count: data.count } }));
    } catch {
      // ignore
    }
  };

  const handleSave = (slug: string) => {
    const saved = toggleSavedPost(slug);
    setSavedPosts((prev) => ({ ...prev, [slug]: saved }));
  };

  const filtered = posts;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--brand)] mb-2">
          RYØKU Hash Archive
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          RYØKU Hash Archive
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-2xl leading-relaxed mb-6">
          Una guía en constante evolución para entender qué estás consumiendo, cómo se obtiene y qué significa realmente cada término. Sin repetir etiquetas vacías. Sin asumir que todo el mundo sabe de lo que se está hablando. Desde los conceptos básicos hasta los matices que separan dos extracciones aparentemente similares.
        </p>
        <button
          type="button"
          onClick={() => setActiveTag(tags.includes(START_HERE_TAG) ? START_HERE_TAG : tags[1] || "Todo")}
          className="group inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold text-xs uppercase tracking-[0.1em] transition-all hover:opacity-90"
          style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
        >
          Empezar desde cero
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      {/* Tags filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2"
      >
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTag === tag
                ? "bg-[var(--brand)] text-black"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        </div>
      ) : (
        <>
          {/* Instagram-style grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)] mb-4">
                    {(() => {
                      const imageSrc = getBlogPostImage(post);
                      return imageSrc.startsWith("data:") ? (
                        <img
                          src={imageSrc}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    {/* Hover stats */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-5 text-white text-sm font-medium">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-5 h-5 fill-white" />
                          {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="w-5 h-5" />
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                    {/* Tag */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white rounded-full backdrop-blur-sm">
                      {post.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-[var(--text-muted)] mb-1.5">
                      {formatDate(post.createdAt)}
                    </p>
                    <h2 className="text-base font-semibold leading-tight mb-2 group-hover:text-[var(--brand)] transition-colors break-words">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed break-words">
                      {post.excerpt || ""}
                    </p>
                  </div>
                </Link>

                {/* Actions bar */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => handleLike(post.slug)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      likeState[post.slug]?.liked ? "text-red-500" : "text-[var(--text-muted)] hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likeState[post.slug]?.liked ? "fill-red-500" : ""}`} />
                    {likeState[post.slug]?.count ?? post.likes?.length ?? 0}
                  </button>
                  <Link
                    href={`/blog/${post.slug}#comments`}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments?.length || 0}
                  </Link>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => handleSave(post.slug)}
                    className={`transition-colors ${
                      savedPosts[post.slug] ? "text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-[var(--brand)]"
                    }`}
                    aria-label="Guardar post"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${savedPosts[post.slug] ? "fill-[var(--brand)]" : ""}`} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)]">No hay artículos en esta categoría.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

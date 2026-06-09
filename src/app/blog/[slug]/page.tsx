"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, Send, Loader2, ArrowUpRight, Package } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getBlogPostImages } from "@/lib/blog";
import { getReadTimeFromContent, hasHeroBlock, isStructuredContent } from "@/lib/blog-content";
import BlogContent from "@/components/blog/BlogContent";
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
  comments: { id: number; content: string; createdAt: string; user: { name: string } | null }[];
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) throw new Error("Post no encontrado");
        const data = await res.json();
        setPost(data);
        setLikeCount(data.likes?.length || 0);
      } catch (err) {
        setError("Error al cargar el post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (slug) setSaved(isPostSaved(slug));
  }, [slug]);

  const scrollToComments = () => {
    document.getElementById("comments")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!loading && window.location.hash === "#comments") {
      scrollToComments();
    }
  }, [loading]);

  const handleSave = () => {
    if (!slug) return;
    setSaved(toggleSavedPost(slug));
  };

  const handleShare = async () => {
    if (!post) return;

    const url = window.location.href;
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareFeedback("Enlace copiado");
      setTimeout(() => setShareFeedback(""), 2000);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback("Enlace copiado");
      } catch {
        setShareFeedback("No se pudo compartir");
      }
      setTimeout(() => setShareFeedback(""), 2000);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch {
      // ignore
    }
  };

  const handleCommentSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setCommentError("");

    if (!session) {
      router.push(`/login?callbackUrl=/blog/${slug}`);
      return;
    }

    if (!comment.trim()) {
      setCommentError("Escribe un comentario antes de enviar.");
      return;
    }

    setCommentLoading(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCommentError(data.error || "No se pudo publicar el comentario.");
        return;
      }

      setPost((prev) =>
        prev
          ? { ...prev, comments: [data.comment, ...(prev.comments || [])] }
          : prev
      );
      setComment("");
    } catch {
      setCommentError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <p className="text-[var(--text-muted)]">{error || "Post no encontrado"}</p>
        <Link href="/blog" className="text-[var(--brand)] hover:underline mt-4 inline-block">
          Volver al archivo
        </Link>
      </div>
    );
  }

  const structured = isStructuredContent(post.content);
  const showLegacyCarousel = !structured || !hasHeroBlock(post.content);
  const images = getBlogPostImages(post);
  const readTime = getReadTimeFromContent(post.content);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto min-w-0 break-words overflow-x-hidden">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Hash Archive
        </Link>
      </motion.div>

      {showLegacyCarousel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
            {images[currentImage].startsWith("data:") ? (
              <img
                src={images[currentImage]}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={images[currentImage]}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImage === i
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-red-500" : "text-[var(--text-muted)] hover:text-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
          {likeCount}
        </button>
        <button
          type="button"
          onClick={scrollToComments}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
          aria-label="Ir a comentarios"
        >
          <MessageCircle className="w-5 h-5" />
          {post.comments?.length || 0}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
          aria-label="Compartir post"
        >
          <Share2 className="w-5 h-5" />
          {shareFeedback && <span className="text-xs text-[var(--brand)]">{shareFeedback}</span>}
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleSave}
          className={`transition-colors ${
            saved ? "text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-[var(--brand)]"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-[var(--brand)]" : ""}`} />
        </button>
      </motion.div>

      {/* Meta */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--brand-glow)] text-[var(--brand)] rounded-full">
            {post.tag}
          </span>
          <span className="text-xs text-[var(--text-muted)]">{formatDate(post.createdAt)}</span>
          <span className="text-xs text-[var(--text-muted)]">· {readTime} lectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight break-words">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed break-words">
            {post.excerpt}
          </p>
        )}
      </motion.div>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-12"
      >
        <BlogContent content={post.content} />
      </motion.article>

      {/* Productos útiles */}
      {post.tag && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-12 p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[var(--brand)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Productos relacionados</h3>
          </div>
          <Link
            href={`/shop`}
            className="group inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
          >
            Ver productos recomendados en la tienda
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      )}

      {/* Comments */}
      <section id="comments" className="border-t border-[var(--border)] pt-8 scroll-mt-28">
        <h3 className="text-lg font-bold mb-6">
          Comentarios ({post.comments?.length || 0})
        </h3>

        {/* Comment input */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[var(--text-muted)]">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "TÚ"}
              </span>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={session ? "Escribe un comentario..." : "Inicia sesión para comentar"}
                disabled={commentLoading}
                className="w-full px-4 py-2.5 pr-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={commentLoading || !comment.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors disabled:opacity-50"
                aria-label="Enviar comentario"
              >
                {commentLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {commentError && (
            <p className="mt-2 text-xs text-red-400">{commentError}</p>
          )}
          {!session && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              <Link href={`/login?callbackUrl=/blog/${slug}`} className="text-[var(--brand)] hover:underline">
                Inicia sesión
              </Link>{" "}
              para dejar un comentario.
            </p>
          )}
        </form>

        {/* Comments list */}
        <div className="space-y-6">
          {(post.comments || []).map((c: any) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-glow)] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--brand)]">
                  {c.user?.name?.charAt(0) || '?'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{c.user?.name || 'Anónimo'}</span>
                  <span className="text-xs text-[var(--text-muted)]">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

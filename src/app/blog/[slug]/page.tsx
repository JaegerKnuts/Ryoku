"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, ChevronLeft, Send, Loader2 } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  tag: string;
  status: string;
  createdAt: string;
  images: { url: string; alt: string | null }[];
  likes: { id: number }[];
  comments: { id: number; text: string; createdAt: string; user: { name: string } }[];
}

function parseContent(content: string): string[] {
  // Split content by newlines to create blocks
  return content.split('\n').filter(line => line.trim() !== '');
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [comment, setComment] = useState("");

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

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
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
          Volver al blog
        </Link>
      </div>
    );
  }

  const contentBlocks = parseContent(post.content || "");
  const hasImages = post.images && post.images.length > 0;
  const defaultImage = "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=1200&h=800&fit=crop";
  const images = hasImages ? post.images.map(img => img.url) : [defaultImage];
  const readTime = getReadTime(post.content || "");

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Blog
        </Link>
      </motion.div>

      {/* Image carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
          <Image
            src={images[currentImage]}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          {/* Dots */}
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
        <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
          <MessageCircle className="w-5 h-5" />
          {post.comments?.length || 0}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setSaved(!saved)}
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>
      </motion.div>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-12"
      >
        {contentBlocks.map((block: string, i: number) => {
          if (block.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-xl font-bold mt-8 mb-3 text-[var(--text)]"
              >
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("- ")) {
            const items = block.split("\n");
            return (
              <ul key={i} className="space-y-2 my-4">
                {items.map((item: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-1.5 flex-shrink-0" />
                    {item.replace("- ", "")}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {block}
            </p>
          );
        })}
      </motion.article>

      {/* Comments */}
      <section className="border-t border-[var(--border)] pt-8">
        <h3 className="text-lg font-bold mb-6">
          Comentarios ({post.comments?.length || 0})
        </h3>

        {/* Comment input */}
        <div className="flex gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[var(--text-muted)]">TÚ</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full px-4 py-2.5 pr-10 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

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
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

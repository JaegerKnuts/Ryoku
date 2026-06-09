"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { getBlogPostImage } from "@/lib/blog";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  coverImage: string | null;
  images: { url: string }[];
  likes: { id: number }[];
  comments: { id: number }[];
}

export function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog?limit=6")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] mb-2 font-medium" style={{ color: "var(--brand)" }}>
            Hash Archive
          </p>
          <h2 className="text-5xl sm:text-6xl uppercase tracking-tight" style={{ fontFamily: "var(--font-bebas), Impact, sans-serif" }}>
            Últimos artículos
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors"
        >
          Ver todo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {posts.map((post, i) => {
          const imageSrc = getBlogPostImage(post);
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group relative block aspect-square overflow-hidden bg-[var(--surface)]"
                style={{ borderRadius: "var(--radius)" }}
              >
                {imageSrc.startsWith("data:") ? (
                  <img src={imageSrc} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <Image
                    src={imageSrc}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 text-white text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      {post.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: "var(--brand)" }} />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)]">Aún no hay artículos publicados.</p>
      )}

      <div className="sm:hidden mt-8 text-center">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
          Ver todo el archivo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

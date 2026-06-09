"use client";

import { Eye } from "lucide-react";
import BlogContent from "@/components/blog/BlogContent";
import { getReadTimeFromContent, hasHeroBlock, parseBlogContent } from "@/lib/blog-content";

interface BlogPostLivePreviewProps {
  title: string;
  excerpt: string;
  tag: string;
  content: string;
}

export default function BlogPostLivePreview({ title, excerpt, tag, content }: BlogPostLivePreviewProps) {
  const blocks = parseBlogContent(content);
  const hasContent = blocks.length > 0;
  const readTime = getReadTimeFromContent(content);
  const showHeroInContent = hasHeroBlock(content);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/60 flex items-center gap-2">
        <Eye className="w-4 h-4 text-[var(--brand)]" />
        <span className="text-xs font-bold uppercase tracking-wider">Vista previa en vivo</span>
        <span className="text-[10px] text-[var(--text-muted)] ml-auto">Se actualiza al editar</span>
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-5 sm:p-6 break-words">
        {!title && !excerpt && !hasContent ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-2">Tu post aparecerá aquí</p>
            <p className="text-xs text-[var(--text-muted)]">
              Añade título, extracto y bloques para ver cómo quedará en la web.
            </p>
          </div>
        ) : (
          <article className="max-w-none">
            <div className="mb-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {tag ? (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--brand-glow)] text-[var(--brand)] rounded-full">
                    {tag}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--text-muted)] rounded-full">
                    Sin sección
                  </span>
                )}
                {hasContent && (
                  <span className="text-[10px] text-[var(--text-muted)]">· {readTime} lectura</span>
                )}
              </div>

              <h1 className="text-xl font-bold tracking-tight leading-tight break-words">
                {title || "Título del post"}
              </h1>

              {excerpt && (
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed break-words">
                  {excerpt}
                </p>
              )}
            </div>

            {hasContent ? (
              <BlogContent content={content} showPlaceholders />
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">
                Añade bloques de contenido para completar el artículo.
              </p>
            )}

            {showHeroInContent && (
              <p className="text-[10px] text-[var(--text-muted)] mt-6 pt-4 border-t border-[var(--border)]">
                Las imágenes de portada se muestran dentro del contenido, no duplicadas arriba.
              </p>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

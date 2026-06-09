"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { parseBlogContent } from "@/lib/blog-content";
import type { BlogBlock } from "@/lib/blog-blocks";

function BlockImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (src.startsWith("data:")) {
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <Image src={src} alt={alt} fill className={className || "object-cover"} sizes={sizes} />
  );
}

function ImagePlaceholder({ label = "Imagen", compact = false }: { label?: string; compact?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[var(--surface)] border-2 border-dashed border-[var(--border)]">
      <ImageIcon className={compact ? "w-4 h-4 text-[var(--text-muted)]" : "w-6 h-6 text-[var(--text-muted)]"} />
      <span className={`${compact ? "text-[8px]" : "text-[10px]"} text-[var(--text-muted)] uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  );
}

function spacing(compact: boolean, normal: string, tight: string) {
  return compact ? tight : normal;
}

function renderBlock(block: BlogBlock, index: number, showPlaceholders: boolean, compact: boolean) {
  const my = spacing(compact, "my-8", "my-3");
  const mySm = spacing(compact, "my-6", "my-2");
  const myMd = spacing(compact, "my-4", "my-2");

  switch (block.type) {
    case "hero":
      if (block.layout === "image-left" || block.layout === "image-right") {
        const imageFirst = block.layout === "image-left";
        const showImage = block.image || showPlaceholders;
        return (
          <div key={block.id || index} className={`${my} grid grid-cols-1 sm:grid-cols-2 gap-6 items-center`}>
            {imageFirst && showImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
                {block.image ? (
                  <BlockImage src={block.image} alt={block.imageAlt || "Portada"} sizes="(max-width: 640px) 100vw, 50vw" />
                ) : (
                  <ImagePlaceholder label="Portada" compact={compact} />
                )}
              </div>
            )}
            {block.subtitle && (
              <p className={`${compact ? "text-xs" : "text-base sm:text-lg"} text-[var(--text-secondary)] leading-relaxed break-words`}>
                {block.subtitle}
              </p>
            )}
            {!imageFirst && showImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
                {block.image ? (
                  <BlockImage src={block.image} alt={block.imageAlt || "Portada"} sizes="(max-width: 640px) 100vw, 50vw" />
                ) : (
                  <ImagePlaceholder label="Portada" compact={compact} />
                )}
              </div>
            )}
          </div>
        );
      }
      return (
        <div key={block.id || index} className={my}>
          {(block.image || showPlaceholders) && (
            <div className={`relative ${compact ? "aspect-[2/1]" : "aspect-[16/9]"} rounded-xl overflow-hidden bg-[var(--surface)] mb-4`}>
              {block.image ? (
                <BlockImage src={block.image} alt={block.imageAlt || "Portada"} sizes="(max-width: 768px) 100vw, 768px" />
              ) : (
                <ImagePlaceholder label="Portada" compact={compact} />
              )}
            </div>
          )}
          {block.subtitle && (
            <p className={`${compact ? "text-xs" : "text-base sm:text-lg"} text-[var(--text-secondary)] leading-relaxed break-words`}>
              {block.subtitle}
            </p>
          )}
        </div>
      );

    case "heading":
      if (block.level === 3) {
        return (
          <h3 key={block.id || index} className={`${compact ? "text-sm mt-3 mb-1" : "text-lg mt-8 mb-3"} font-semibold text-[var(--text)] break-words`}>
            {block.text}
          </h3>
        );
      }
      return (
        <h2 key={block.id || index} className={`${compact ? "text-base mt-4 mb-2" : "text-xl mt-10 mb-4"} font-bold text-[var(--text)] break-words`}>
          {block.text}
        </h2>
      );

    case "text":
      return (
        <p key={block.id || index} className={`${compact ? "text-xs mb-2" : "text-sm mb-4"} text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap`}>
          {block.text}
        </p>
      );

    case "image": {
      const sizeClass =
        block.size === "full"
          ? "w-full"
          : block.size === "large"
            ? "w-full max-w-2xl mx-auto"
            : "w-full max-w-md mx-auto";
      return (
        <figure key={block.id || index} className={`${my} ${sizeClass}`}>
          <div className={`relative ${compact ? "aspect-[3/2]" : "aspect-[4/3]"} rounded-xl overflow-hidden bg-[var(--surface)]`}>
            {block.url ? (
              <BlockImage src={block.url} alt={block.alt || ""} sizes="(max-width: 768px) 100vw, 768px" />
            ) : showPlaceholders ? (
              <ImagePlaceholder compact={compact} />
            ) : null}
          </div>
          {block.caption && (
            <figcaption className={`${compact ? "text-[9px]" : "text-xs"} text-[var(--text-muted)] mt-2 text-center`}>{block.caption}</figcaption>
          )}
        </figure>
      );
    }

    case "image-text": {
      const imageFirst = block.layout === "left";
      const showImage = block.url || showPlaceholders;
      return (
        <div key={block.id || index} className={`${my} grid grid-cols-1 sm:grid-cols-2 gap-6 items-start`}>
          {imageFirst && showImage && (
            <div className={`relative ${compact ? "aspect-[4/3]" : "aspect-square"} rounded-xl overflow-hidden bg-[var(--surface)]`}>
              {block.url ? (
                <BlockImage src={block.url} alt={block.alt || ""} sizes="(max-width: 640px) 100vw, 50vw" />
              ) : (
                <ImagePlaceholder compact={compact} />
              )}
            </div>
          )}
          <p className={`${compact ? "text-xs" : "text-sm"} text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap`}>
            {block.text}
          </p>
          {!imageFirst && showImage && (
            <div className={`relative ${compact ? "aspect-[4/3]" : "aspect-square"} rounded-xl overflow-hidden bg-[var(--surface)]`}>
              {block.url ? (
                <BlockImage src={block.url} alt={block.alt || ""} sizes="(max-width: 640px) 100vw, 50vw" />
              ) : (
                <ImagePlaceholder compact={compact} />
              )}
            </div>
          )}
        </div>
      );
    }

    case "two-images":
      return (
        <div key={block.id || index} className={`${my} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          {[block.left, block.right].map((img, i) => (
            <figure key={i}>
              {(img.url || showPlaceholders) && (
                <div className={`relative ${compact ? "aspect-[4/3]" : "aspect-[4/3]"} rounded-xl overflow-hidden bg-[var(--surface)]`}>
                  {img.url ? (
                    <BlockImage src={img.url} alt={img.alt || ""} sizes="(max-width: 640px) 100vw, 50vw" />
                  ) : (
                    <ImagePlaceholder compact={compact} />
                  )}
                </div>
              )}
              {img.caption && (
                <figcaption className={`${compact ? "text-[9px]" : "text-xs"} text-[var(--text-muted)] mt-2`}>{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case "gallery":
      return (
        <div
          key={block.id || index}
          className={`${my} grid gap-3 ${
            block.columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {(showPlaceholders ? block.images : block.images.filter((img) => img.url)).map((img, i) => (
            <figure key={i}>
              <div className={`relative ${compact ? "aspect-[4/3]" : "aspect-square"} rounded-xl overflow-hidden bg-[var(--surface)]`}>
                {img.url ? (
                  <BlockImage src={img.url} alt={img.alt || ""} sizes="(max-width: 640px) 50vw, 33vw" />
                ) : (
                  <ImagePlaceholder compact={compact} />
                )}
              </div>
              {img.caption && (
                <figcaption className={`${compact ? "text-[9px]" : "text-xs"} text-[var(--text-muted)] mt-1.5`}>{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case "quote":
      return (
        <blockquote key={block.id || index} className={`${my} pl-5 border-l-4 border-[var(--brand)] py-2`}>
          <p className={`${compact ? "text-xs" : "text-base"} italic text-[var(--text)] leading-relaxed break-words`}>
            &ldquo;{block.text}&rdquo;
          </p>
          {block.author && (
            <cite className={`block mt-2 ${compact ? "text-[9px]" : "text-xs"} text-[var(--text-muted)] not-italic`}>
              — {block.author}
            </cite>
          )}
        </blockquote>
      );

    case "callout": {
      const styles = {
        tip: "bg-[var(--brand-glow)] border-[var(--brand)]/30 text-[var(--text)]",
        info: "bg-blue-500/10 border-blue-500/30 text-[var(--text)]",
        warning: "bg-amber-500/10 border-amber-500/30 text-[var(--text)]",
      };
      const labels = { tip: "Consejo", info: "Info", warning: "Aviso" };
      return (
        <div key={block.id || index} className={`${mySm} p-4 rounded-xl border ${styles[block.variant]}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
            {labels[block.variant]}
          </span>
          <p className={`${compact ? "text-xs" : "text-sm"} mt-2 leading-relaxed break-words whitespace-pre-wrap`}>{block.text}</p>
        </div>
      );
    }

    case "divider":
      return <div key={block.id || index} className={`${mySm} h-px bg-[var(--border)]`} />;

    case "list":
      if (block.style === "numbered") {
        return (
          <ol key={block.id || index} className={`${myMd} space-y-2 list-decimal list-inside`}>
            {block.items.filter(Boolean).map((item, j) => (
              <li key={j} className={`${compact ? "text-xs" : "text-sm"} text-[var(--text-secondary)] leading-relaxed break-words`}>
                {item}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={block.id || index} className={`space-y-2 ${myMd}`}>
          {block.items.filter(Boolean).map((item, j) => (
            <li key={j} className={`flex items-start gap-2 ${compact ? "text-xs" : "text-sm"} text-[var(--text-secondary)] leading-relaxed min-w-0`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-1.5 flex-shrink-0" />
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "glossary":
      return (
        <div key={block.id || index} className={`${mySm} rounded-xl border border-[var(--border)] overflow-hidden`}>
          {block.items
            .filter((item) => item.term || item.definition)
            .map((item, j) => (
              <div
                key={j}
                className="flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 min-w-0"
              >
                <span className={`${compact ? "text-xs" : "text-sm"} font-bold text-[var(--brand)] flex-shrink-0 mt-0.5 break-words`}>
                  {item.term}
                </span>
                <span className={`${compact ? "text-xs" : "text-sm"} text-[var(--text-secondary)] break-words min-w-0`}>
                  {item.definition}
                </span>
              </div>
            ))}
        </div>
      );

    case "table":
      return (
        <div key={block.id || index} className={`overflow-x-auto ${mySm} rounded-xl border border-[var(--border)]`}>
          <table className={`w-full ${compact ? "text-[10px]" : "text-sm"}`}>
            <thead>
              <tr className="bg-[var(--surface)]">
                {block.headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className="border-t border-[var(--border)]">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-[var(--text-secondary)] break-words">
                      {cell || (showPlaceholders ? "…" : "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "columns":
      return (
        <div key={block.id || index} className={`${my} grid grid-cols-1 sm:grid-cols-2 gap-6`}>
          <p className={`${compact ? "text-xs" : "text-sm"} text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap`}>
            {block.left}
          </p>
          <p className={`${compact ? "text-xs" : "text-sm"} text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap`}>
            {block.right}
          </p>
        </div>
      );

    default:
      return null;
  }
}

interface BlogContentProps {
  content: string | null | undefined;
  showPlaceholders?: boolean;
  compact?: boolean;
}

export default function BlogContent({ content, showPlaceholders = false, compact = false }: BlogContentProps) {
  const blocks = parseBlogContent(content);
  if (blocks.length === 0) return null;
  return (
    <>
      {blocks.map((block, i) => renderBlock(block, i, showPlaceholders, compact))}
    </>
  );
}

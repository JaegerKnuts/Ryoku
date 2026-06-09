"use client";

import Image from "next/image";
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

function renderBlock(block: BlogBlock, index: number) {
  switch (block.type) {
    case "hero":
      if (block.layout === "image-left" || block.layout === "image-right") {
        const imageFirst = block.layout === "image-left";
        return (
          <div key={block.id || index} className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {imageFirst && block.image && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
                <BlockImage src={block.image} alt={block.imageAlt || "Portada"} sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            )}
            {block.subtitle && (
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed break-words">
                {block.subtitle}
              </p>
            )}
            {!imageFirst && block.image && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
                <BlockImage src={block.image} alt={block.imageAlt || "Portada"} sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            )}
          </div>
        );
      }
      return (
        <div key={block.id || index} className="my-8">
          {block.image && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--surface)] mb-4">
              <BlockImage src={block.image} alt={block.imageAlt || "Portada"} sizes="(max-width: 768px) 100vw, 768px" />
            </div>
          )}
          {block.subtitle && (
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed break-words">
              {block.subtitle}
            </p>
          )}
        </div>
      );

    case "heading":
      if (block.level === 3) {
        return (
          <h3 key={block.id || index} className="text-lg font-semibold mt-8 mb-3 text-[var(--text)] break-words">
            {block.text}
          </h3>
        );
      }
      return (
        <h2 key={block.id || index} className="text-xl font-bold mt-10 mb-4 text-[var(--text)] break-words">
          {block.text}
        </h2>
      );

    case "text":
      return (
        <p key={block.id || index} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 break-words whitespace-pre-wrap">
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
        <figure key={block.id || index} className={`my-8 ${sizeClass}`}>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
            {block.url && (
              <BlockImage src={block.url} alt={block.alt || ""} sizes="(max-width: 768px) 100vw, 768px" />
            )}
          </div>
          {block.caption && (
            <figcaption className="text-xs text-[var(--text-muted)] mt-2 text-center">{block.caption}</figcaption>
          )}
        </figure>
      );
    }

    case "image-text": {
      const imageFirst = block.layout === "left";
      return (
        <div key={block.id || index} className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {imageFirst && block.url && (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)]">
              <BlockImage src={block.url} alt={block.alt || ""} sizes="(max-width: 640px) 100vw, 50vw" />
            </div>
          )}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap">
            {block.text}
          </p>
          {!imageFirst && block.url && (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)]">
              <BlockImage src={block.url} alt={block.alt || ""} sizes="(max-width: 640px) 100vw, 50vw" />
            </div>
          )}
        </div>
      );
    }

    case "two-images":
      return (
        <div key={block.id || index} className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[block.left, block.right].map((img, i) => (
            <figure key={i}>
              {img.url && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface)]">
                  <BlockImage src={img.url} alt={img.alt || ""} sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
              )}
              {img.caption && (
                <figcaption className="text-xs text-[var(--text-muted)] mt-2">{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case "gallery":
      return (
        <div
          key={block.id || index}
          className={`my-8 grid gap-3 ${
            block.columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {block.images
            .filter((img) => img.url)
            .map((img, i) => (
              <figure key={i}>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)]">
                  <BlockImage src={img.url} alt={img.alt || ""} sizes="(max-width: 640px) 50vw, 33vw" />
                </div>
                {img.caption && (
                  <figcaption className="text-xs text-[var(--text-muted)] mt-1.5">{img.caption}</figcaption>
                )}
              </figure>
            ))}
        </div>
      );

    case "quote":
      return (
        <blockquote
          key={block.id || index}
          className="my-8 pl-5 border-l-4 border-[var(--brand)] py-2"
        >
          <p className="text-base italic text-[var(--text)] leading-relaxed break-words">&ldquo;{block.text}&rdquo;</p>
          {block.author && (
            <cite className="block mt-2 text-xs text-[var(--text-muted)] not-italic">— {block.author}</cite>
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
        <div
          key={block.id || index}
          className={`my-6 p-4 rounded-xl border ${styles[block.variant]}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
            {labels[block.variant]}
          </span>
          <p className="text-sm mt-2 leading-relaxed break-words whitespace-pre-wrap">{block.text}</p>
        </div>
      );
    }

    case "divider":
      return <div key={block.id || index} className="my-8 h-px bg-[var(--border)]" />;

    case "list":
      if (block.style === "numbered") {
        return (
          <ol key={block.id || index} className="my-4 space-y-2 list-decimal list-inside">
            {block.items.filter(Boolean).map((item, j) => (
              <li key={j} className="text-sm text-[var(--text-secondary)] leading-relaxed break-words">
                {item}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={block.id || index} className="space-y-2 my-4">
          {block.items.filter(Boolean).map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-1.5 flex-shrink-0" />
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "glossary":
      return (
        <div key={block.id || index} className="my-6 rounded-xl border border-[var(--border)] overflow-hidden">
          {block.items
            .filter((item) => item.term || item.definition)
            .map((item, j) => (
              <div
                key={j}
                className="flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 min-w-0"
              >
                <span className="text-sm font-bold text-[var(--brand)] flex-shrink-0 mt-0.5 break-words">
                  {item.term}
                </span>
                <span className="text-sm text-[var(--text-secondary)] break-words min-w-0">
                  {item.definition}
                </span>
              </div>
            ))}
        </div>
      );

    case "table":
      return (
        <div key={block.id || index} className="overflow-x-auto my-6 rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
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
                      {cell}
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
        <div key={block.id || index} className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap">
            {block.left}
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed break-words whitespace-pre-wrap">
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
}

export default function BlogContent({ content }: BlogContentProps) {
  const blocks = parseBlogContent(content);
  if (blocks.length === 0) return null;
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}

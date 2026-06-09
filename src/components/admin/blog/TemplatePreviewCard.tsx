"use client";

import { Eye, LayoutTemplate } from "lucide-react";
import type { BlogTemplate } from "@/lib/blog-blocks";
import { serializeBlogContent } from "@/lib/blog-content";
import BlogContent from "@/components/blog/BlogContent";

interface TemplatePreviewCardProps {
  template: BlogTemplate;
  onApply: () => void;
  onExpand: () => void;
}

export default function TemplatePreviewCard({ template, onApply, onExpand }: TemplatePreviewCardProps) {
  const blockCount = template.blocks.length;
  const blockSummary = template.blocks
    .map((b) => {
      const labels: Record<string, string> = {
        hero: "Portada",
        heading: "Título",
        text: "Texto",
        "image-text": "Img+texto",
        gallery: "Galería",
        "two-images": "2 imgs",
        glossary: "Glosario",
        table: "Tabla",
        columns: "Columnas",
        callout: "Destacado",
        quote: "Cita",
        list: "Lista",
        image: "Imagen",
        divider: "—",
      };
      return labels[b.type] || b.type;
    })
    .join(" · ");

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden hover:border-[var(--brand)]/60 transition-colors">
      <div className="p-4 pb-2">
        <p className="text-sm font-semibold mb-0.5">{template.name}</p>
        <p className="text-xs text-[var(--text-secondary)]">{template.description}</p>
        {blockCount > 0 && (
          <p className="text-[10px] text-[var(--text-muted)] mt-2 truncate" title={blockSummary}>
            {blockCount} bloques: {blockSummary}
          </p>
        )}
      </div>

      <div className="relative mx-4 mb-3 h-52 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]/30">
        {blockCount === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <LayoutTemplate className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="text-xs text-[var(--text-muted)]">Post vacío — añade bloques manualmente</p>
          </div>
        ) : (
          <div
            className="absolute top-0 left-0 w-[250%] origin-top-left pointer-events-none"
            style={{ transform: "scale(0.4)" }}
          >
            <div className="p-6 bg-[var(--bg)]">
              <BlogContent
                content={serializeBlogContent(template.blocks)}
                showPlaceholders
                compact
              />
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </div>

      <div className="flex gap-2 p-4 pt-0 mt-auto">
        {blockCount > 0 && (
          <button
            type="button"
            onClick={onExpand}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--border)] rounded-md hover:bg-[var(--surface)] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Ampliar
          </button>
        )}
        <button
          type="button"
          onClick={onApply}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          Usar plantilla
        </button>
      </div>
    </div>
  );
}

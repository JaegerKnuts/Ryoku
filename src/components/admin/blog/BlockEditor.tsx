"use client";

import type { BlogBlock } from "@/lib/blog-blocks";
import BlogImageField from "./BlogImageField";

interface BlockEditorProps {
  block: BlogBlock;
  onChange: (block: BlogBlock) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] bg-[var(--bg)]";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;

export default function BlockEditor({ block, onChange }: BlockEditorProps) {
  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["full", "image-left", "image-right"] as const).map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => onChange({ ...block, layout })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.layout === layout
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {layout === "full" ? "Imagen arriba" : layout === "image-left" ? "Imagen izquierda" : "Imagen derecha"}
              </button>
            ))}
          </div>
          <BlogImageField
            value={block.image || ""}
            onChange={(url) => onChange({ ...block, image: url })}
            alt={block.imageAlt}
            onAltChange={(alt) => onChange({ ...block, imageAlt: alt })}
            label="Imagen de portada"
          />
          <textarea
            value={block.subtitle || ""}
            onChange={(e) => onChange({ ...block, subtitle: e.target.value })}
            placeholder="Subtítulo o introducción breve"
            className={textareaClass}
            rows={2}
          />
        </div>
      );

    case "heading":
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            {([2, 3] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ ...block, level })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.level === level
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                H{level}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder={`Título de sección (H${block.level})`}
            className={inputClass}
          />
        </div>
      );

    case "text":
      return (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Escribe el párrafo..."
          className={textareaClass}
          rows={4}
        />
      );

    case "image":
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["full", "large", "medium"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ ...block, size })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.size === size
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {size === "full" ? "Ancho completo" : size === "large" ? "Grande" : "Mediana"}
              </button>
            ))}
          </div>
          <BlogImageField
            value={block.url}
            onChange={(url) => onChange({ ...block, url })}
            alt={block.alt}
            onAltChange={(alt) => onChange({ ...block, alt })}
            caption={block.caption}
            onCaptionChange={(caption) => onChange({ ...block, caption })}
          />
        </div>
      );

    case "image-text":
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["left", "right"] as const).map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => onChange({ ...block, layout })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.layout === layout
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                Imagen {layout === "left" ? "izquierda" : "derecha"}
              </button>
            ))}
          </div>
          <BlogImageField
            value={block.url}
            onChange={(url) => onChange({ ...block, url })}
            alt={block.alt}
            onAltChange={(alt) => onChange({ ...block, alt })}
            compact
          />
          <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Texto junto a la imagen..."
            className={textareaClass}
            rows={4}
          />
        </div>
      );

    case "two-images":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BlogImageField
            value={block.left.url}
            onChange={(url) => onChange({ ...block, left: { ...block.left, url } })}
            alt={block.left.alt}
            onAltChange={(alt) => onChange({ ...block, left: { ...block.left, alt } })}
            caption={block.left.caption}
            onCaptionChange={(caption) => onChange({ ...block, left: { ...block.left, caption } })}
            label="Imagen izquierda"
          />
          <BlogImageField
            value={block.right.url}
            onChange={(url) => onChange({ ...block, right: { ...block.right, url } })}
            alt={block.right.alt}
            onAltChange={(alt) => onChange({ ...block, right: { ...block.right, alt } })}
            caption={block.right.caption}
            onCaptionChange={(caption) => onChange({ ...block, right: { ...block.right, caption } })}
            label="Imagen derecha"
          />
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            {([2, 3] as const).map((columns) => (
              <button
                key={columns}
                type="button"
                onClick={() => onChange({ ...block, columns })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.columns === columns
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {columns} columnas
              </button>
            ))}
          </div>
          {block.images.map((img, index) => (
            <div key={index} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Imagen {index + 1}</span>
                {block.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...block,
                        images: block.images.filter((_, i) => i !== index),
                      })
                    }
                    className="text-xs text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                )}
              </div>
              <BlogImageField
                value={img.url}
                onChange={(url) => {
                  const images = [...block.images];
                  images[index] = { ...images[index], url };
                  onChange({ ...block, images });
                }}
                alt={img.alt}
                onAltChange={(alt) => {
                  const images = [...block.images];
                  images[index] = { ...images[index], alt };
                  onChange({ ...block, images });
                }}
                caption={img.caption}
                onCaptionChange={(caption) => {
                  const images = [...block.images];
                  images[index] = { ...images[index], caption };
                  onChange({ ...block, images });
                }}
                compact
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...block, images: [...block.images, { url: "" }] })}
            className="text-xs text-[var(--brand)] hover:underline"
          >
            + Añadir imagen a la galería
          </button>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-3">
          <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Texto de la cita..."
            className={textareaClass}
            rows={3}
          />
          <input
            type="text"
            value={block.author || ""}
            onChange={(e) => onChange({ ...block, author: e.target.value })}
            placeholder="Autor (opcional)"
            className={inputClass}
          />
        </div>
      );

    case "callout":
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["tip", "info", "warning"] as const).map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => onChange({ ...block, variant })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.variant === variant
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {variant === "tip" ? "Consejo" : variant === "info" ? "Info" : "Aviso"}
              </button>
            ))}
          </div>
          <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Mensaje destacado..."
            className={textareaClass}
            rows={3}
          />
        </div>
      );

    case "divider":
      return <p className="text-xs text-[var(--text-muted)]">Separador visual entre secciones.</p>;

    case "list":
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["bullet", "numbered"] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => onChange({ ...block, style })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  block.style === style
                    ? "bg-[var(--brand)] text-black border-[var(--brand)]"
                    : "border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {style === "bullet" ? "Viñetas" : "Numerada"}
              </button>
            ))}
          </div>
          {block.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const items = [...block.items];
                  items[index] = e.target.value;
                  onChange({ ...block, items });
                }}
                placeholder={`Elemento ${index + 1}`}
                className={inputClass}
              />
              {block.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...block, items: block.items.filter((_, i) => i !== index) })}
                  className="shrink-0 px-2 text-xs text-red-500 hover:underline"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...block, items: [...block.items, ""] })}
            className="text-xs text-[var(--brand)] hover:underline"
          >
            + Añadir elemento
          </button>
        </div>
      );

    case "glossary":
      return (
        <div className="space-y-3">
          {block.items.map((item, index) => (
            <div key={index} className="p-3 rounded-lg border border-[var(--border)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-secondary)]">Término {index + 1}</span>
                {block.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...block, items: block.items.filter((_, i) => i !== index) })
                    }
                    className="text-xs text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.term}
                onChange={(e) => {
                  const items = [...block.items];
                  items[index] = { ...items[index], term: e.target.value };
                  onChange({ ...block, items });
                }}
                placeholder="Término"
                className={inputClass}
              />
              <textarea
                value={item.definition}
                onChange={(e) => {
                  const items = [...block.items];
                  items[index] = { ...items[index], definition: e.target.value };
                  onChange({ ...block, items });
                }}
                placeholder="Definición"
                className={textareaClass}
                rows={2}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...block, items: [...block.items, { term: "", definition: "" }] })}
            className="text-xs text-[var(--brand)] hover:underline"
          >
            + Añadir término
          </button>
        </div>
      );

    case "table":
      return (
        <div className="space-y-3 overflow-x-auto">
          <div className="flex gap-2">
            {block.headers.map((header, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={header}
                onChange={(e) => {
                  const headers = [...block.headers];
                  headers[colIndex] = e.target.value;
                  onChange({ ...block, headers });
                }}
                className={`${inputClass} min-w-[120px]`}
                placeholder={`Col ${colIndex + 1}`}
              />
            ))}
          </div>
          {block.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 items-center">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  value={cell}
                  onChange={(e) => {
                    const rows = block.rows.map((r) => [...r]);
                    rows[rowIndex][colIndex] = e.target.value;
                    onChange({ ...block, rows });
                  }}
                  className={`${inputClass} min-w-[120px]`}
                />
              ))}
              {block.rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...block, rows: block.rows.filter((_, i) => i !== rowIndex) })}
                  className="text-xs text-red-500 hover:underline shrink-0"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...block, rows: [...block.rows, block.headers.map(() => "")] })}
            className="text-xs text-[var(--brand)] hover:underline"
          >
            + Añadir fila
          </button>
        </div>
      );

    case "columns":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <textarea
            value={block.left}
            onChange={(e) => onChange({ ...block, left: e.target.value })}
            placeholder="Columna izquierda..."
            className={textareaClass}
            rows={5}
          />
          <textarea
            value={block.right}
            onChange={(e) => onChange({ ...block, right: e.target.value })}
            placeholder="Columna derecha..."
            className={textareaClass}
            rows={5}
          />
        </div>
      );

    default:
      return null;
  }
}

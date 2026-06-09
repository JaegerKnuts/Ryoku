"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  GripVertical,
  LayoutTemplate,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  BLOCK_DEFINITIONS,
  BLOG_TEMPLATES,
  createBlock,
  newBlockId,
  type BlogBlock,
  type BlockType,
} from "@/lib/blog-blocks";
import { parseBlogContent, serializeBlogContent } from "@/lib/blog-content";
import BlogContent from "@/components/blog/BlogContent";
import BlockEditor from "./BlockEditor";

interface BlogEditorProps {
  value: string;
  onChange: (content: string) => void;
  postTitle?: string;
}

function getBlockLabel(block: BlogBlock): string {
  const def = BLOCK_DEFINITIONS.find((d) => d.type === block.type);
  return def?.label || block.type;
}

export default function BlogEditor({ value, onChange, postTitle }: BlogEditorProps) {
  const [blocks, setBlocks] = useState<BlogBlock[]>(() => parseBlogContent(value));
  const [showPalette, setShowPalette] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(blocks[0]?.id || null);

  const commit = (next: BlogBlock[]) => {
    setBlocks(next);
    onChange(serializeBlogContent(next));
  };

  const updateBlock = (index: number, block: BlogBlock) => {
    const next = [...blocks];
    next[index] = block;
    commit(next);
  };

  const addBlock = (type: BlockType, index?: number) => {
    const block = createBlock(type);
    const next = [...blocks];
    const insertAt = index ?? blocks.length;
    next.splice(insertAt, 0, block);
    setExpandedId(block.id);
    commit(next);
  };

  const duplicateBlock = (index: number) => {
    const source = blocks[index];
    const copy = JSON.parse(JSON.stringify(source)) as BlogBlock;
    copy.id = newBlockId();
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    setExpandedId(copy.id);
    commit(next);
  };

  const removeBlock = (index: number) => {
    if (!confirm("¿Eliminar este bloque?")) return;
    const next = blocks.filter((_, i) => i !== index);
    commit(next);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  const applyTemplate = (templateId: string) => {
    const template = BLOG_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    if (blocks.length > 0 && !confirm("¿Reemplazar el contenido actual con esta plantilla?")) return;
    const cloned = template.blocks.map((b) => {
      const block = JSON.parse(JSON.stringify(b)) as BlogBlock;
      block.id = newBlockId();
      return block;
    });
    setExpandedId(cloned[0]?.id || null);
    commit(cloned);
    setShowTemplates(false);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...blocks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    commit(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--border)] rounded-md hover:bg-[var(--surface)] transition-colors"
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          Plantillas
        </button>
        <button
          type="button"
          onClick={() => setShowPalette(!showPalette)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--border)] rounded-md hover:bg-[var(--surface)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {showPalette ? "Ocultar bloques" : "Añadir bloques"}
        </button>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[var(--border)] rounded-md hover:bg-[var(--surface)] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Vista previa
        </button>
        <span className="text-xs text-[var(--text-muted)] ml-auto">
          {blocks.length} bloque{blocks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {showTemplates && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40">
          {BLOG_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => applyTemplate(template.id)}
              className="text-left p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] transition-colors"
            >
              <p className="text-sm font-semibold mb-1">{template.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{template.description}</p>
            </button>
          ))}
        </div>
      )}

      {showPalette && (
        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-dashed border-[var(--border)]">
          {BLOCK_DEFINITIONS.map((def) => (
            <button
              key={def.type}
              type="button"
              onClick={() => addBlock(def.type)}
              title={def.description}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-full border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] hover:bg-[var(--surface)] transition-colors"
            >
              <span>{def.icon}</span>
              {def.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 min-h-[200px]">
        {blocks.length === 0 ? (
          <div className="text-center py-16 rounded-xl border-2 border-dashed border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Tu post está vacío. Elige una plantilla o añade bloques.
            </p>
            <button
              type="button"
              onClick={() => addBlock("hero")}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
              style={{ background: "var(--brand)", borderRadius: "var(--radius)" }}
            >
              <Plus className="w-4 h-4" />
              Empezar con portada
            </button>
          </div>
        ) : (
          blocks.map((block, index) => {
            const expanded = expandedId === block.id;
            return (
              <div
                key={block.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className={`rounded-xl border transition-all ${
                  expanded
                    ? "border-[var(--brand)] shadow-sm"
                    : "border-[var(--border)] hover:border-[var(--brand)]/50"
                } bg-[var(--bg)]`}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
                  onClick={() => setExpandedId(expanded ? null : block.id)}
                >
                  <GripVertical className="w-4 h-4 text-[var(--text-muted)] shrink-0 cursor-grab" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
                    {getBlockLabel(block)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] truncate flex-1">
                    {block.type === "text" && block.text}
                    {block.type === "heading" && block.text}
                    {block.type === "hero" && block.subtitle}
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="p-1.5 rounded hover:bg-[var(--surface)] disabled:opacity-30" aria-label="Subir">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="p-1.5 rounded hover:bg-[var(--surface)] disabled:opacity-30" aria-label="Bajar">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => duplicateBlock(index)} className="p-1.5 rounded hover:bg-[var(--surface)]" aria-label="Duplicar">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => removeBlock(index)} className="p-1.5 rounded hover:bg-red-500/10 text-red-500" aria-label="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-[var(--border)] pt-4">
                    <BlockEditor block={block} onChange={(updated) => updateBlock(index, updated)} />
                    <button
                      type="button"
                      onClick={() => addBlock("text", index + 1)}
                      className="mt-4 inline-flex items-center gap-1 text-xs text-[var(--brand)] hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      Insertar bloque debajo
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
              <h3 className="text-sm font-bold uppercase tracking-wider">Vista previa</h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              {postTitle && (
                <h1 className="text-2xl font-bold mb-6 break-words">{postTitle}</h1>
              )}
              <BlogContent content={serializeBlogContent(blocks)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

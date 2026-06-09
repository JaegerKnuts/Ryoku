"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";

interface BlogImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
  compact?: boolean;
  label?: string;
}

export default function BlogImageField({
  value,
  onChange,
  alt,
  onAltChange,
  caption,
  onCaptionChange,
  compact = false,
  label = "Imagen",
}: BlogImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Error al subir la imagen");
      }
    } catch {
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--brand)] bg-[var(--bg)]";

  return (
    <div className="space-y-2">
      {!compact && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </span>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL o sube imagen"
          className={`${inputClass} flex-1 min-w-0`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 border border-[var(--border)] rounded-md text-xs hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Subir
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 p-2 border border-[var(--border)] rounded-md text-[var(--text-muted)] hover:text-red-500 transition-colors"
            aria-label="Quitar imagen"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>
      {onAltChange && (
        <input
          type="text"
          value={alt || ""}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Texto alternativo (accesibilidad)"
          className={inputClass}
        />
      )}
      {onCaptionChange && (
        <input
          type="text"
          value={caption || ""}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Pie de foto (opcional)"
          className={inputClass}
        />
      )}
      {value && (
        <div className={`relative overflow-hidden rounded-lg border border-[var(--border)] ${compact ? "h-20" : "h-32"}`}>
          <img src={value} alt={alt || "Vista previa"} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

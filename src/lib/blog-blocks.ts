export const BLOG_CONTENT_VERSION = 1;

export type BlogBlock =
  | HeroBlock
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | ImageTextBlock
  | TwoImagesBlock
  | GalleryBlock
  | QuoteBlock
  | CalloutBlock
  | DividerBlock
  | ListBlock
  | GlossaryBlock
  | TableBlock
  | ColumnsBlock;

export interface HeroBlock {
  id: string;
  type: "hero";
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  layout: "full" | "image-left" | "image-right";
}

export interface HeadingBlock {
  id: string;
  type: "heading";
  level: 2 | 3;
  text: string;
}

export interface TextBlock {
  id: string;
  type: "text";
  text: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  alt?: string;
  caption?: string;
  size: "full" | "large" | "medium";
}

export interface ImageTextBlock {
  id: string;
  type: "image-text";
  url: string;
  alt?: string;
  text: string;
  layout: "left" | "right";
}

export interface TwoImagesBlock {
  id: string;
  type: "two-images";
  left: { url: string; alt?: string; caption?: string };
  right: { url: string; alt?: string; caption?: string };
}

export interface GalleryBlock {
  id: string;
  type: "gallery";
  images: { url: string; alt?: string; caption?: string }[];
  columns: 2 | 3;
}

export interface QuoteBlock {
  id: string;
  type: "quote";
  text: string;
  author?: string;
}

export interface CalloutBlock {
  id: string;
  type: "callout";
  text: string;
  variant: "info" | "tip" | "warning";
}

export interface DividerBlock {
  id: string;
  type: "divider";
}

export interface ListBlock {
  id: string;
  type: "list";
  items: string[];
  style: "bullet" | "numbered";
}

export interface GlossaryBlock {
  id: string;
  type: "glossary";
  items: { term: string; definition: string }[];
}

export interface TableBlock {
  id: string;
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface ColumnsBlock {
  id: string;
  type: "columns";
  left: string;
  right: string;
}

export interface BlogContentDocument {
  version: number;
  blocks: BlogBlock[];
}

export type BlockType = BlogBlock["type"];

export interface BlockDefinition {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  { type: "hero", label: "Portada", description: "Imagen destacada con subtítulo", icon: "🖼" },
  { type: "heading", label: "Título", description: "Encabezado de sección", icon: "H" },
  { type: "text", label: "Texto", description: "Párrafo de contenido", icon: "¶" },
  { type: "image", label: "Imagen", description: "Imagen a ancho completo o centrada", icon: "📷" },
  { type: "image-text", label: "Imagen + texto", description: "Imagen al lado del texto", icon: "◧" },
  { type: "two-images", label: "Dos imágenes", description: "Dos fotos en paralelo", icon: "◫" },
  { type: "gallery", label: "Galería", description: "Varias imágenes en rejilla", icon: "▦" },
  { type: "quote", label: "Cita", description: "Frase destacada", icon: "❝" },
  { type: "callout", label: "Destacado", description: "Caja de aviso o consejo", icon: "!" },
  { type: "list", label: "Lista", description: "Viñetas o numeración", icon: "•" },
  { type: "glossary", label: "Glosario", description: "Términos y definiciones", icon: "≡" },
  { type: "table", label: "Tabla", description: "Datos en columnas", icon: "⊞" },
  { type: "columns", label: "Dos columnas", description: "Texto en dos columnas", icon: "▥" },
  { type: "divider", label: "Separador", description: "Línea divisoria", icon: "—" },
];

export interface BlogTemplate {
  id: string;
  name: string;
  description: string;
  blocks: BlogBlock[];
}

export function newBlockId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createBlock(type: BlockType): BlogBlock {
  const id = newBlockId();

  switch (type) {
    case "hero":
      return { id, type: "hero", subtitle: "", layout: "full" };
    case "heading":
      return { id, type: "heading", level: 2, text: "" };
    case "text":
      return { id, type: "text", text: "" };
    case "image":
      return { id, type: "image", url: "", size: "full" };
    case "image-text":
      return { id, type: "image-text", url: "", text: "", layout: "left" };
    case "two-images":
      return {
        id,
        type: "two-images",
        left: { url: "" },
        right: { url: "" },
      };
    case "gallery":
      return { id, type: "gallery", images: [{ url: "" }, { url: "" }], columns: 2 };
    case "quote":
      return { id, type: "quote", text: "" };
    case "callout":
      return { id, type: "callout", text: "", variant: "tip" };
    case "divider":
      return { id, type: "divider" };
    case "list":
      return { id, type: "list", items: [""], style: "bullet" };
    case "glossary":
      return { id, type: "glossary", items: [{ term: "", definition: "" }] };
    case "table":
      return {
        id,
        type: "table",
        headers: ["Columna 1", "Columna 2"],
        rows: [["", ""]],
      };
    case "columns":
      return { id, type: "columns", left: "", right: "" };
    default:
      return { id, type: "text", text: "" };
  }
}

export const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: "blank",
    name: "En blanco",
    description: "Empieza desde cero",
    blocks: [],
  },
  {
    id: "guide",
    name: "Guía paso a paso",
    description: "Portada, introducción e imagen con texto",
    blocks: [
      { id: newBlockId(), type: "hero", subtitle: "Introducción breve al tema", layout: "full" },
      { id: newBlockId(), type: "text", text: "Escribe aquí la introducción del artículo..." },
      { id: newBlockId(), type: "heading", level: 2, text: "Paso 1" },
      {
        id: newBlockId(),
        type: "image-text",
        url: "",
        text: "Describe el primer paso con detalle...",
        layout: "left",
      },
      { id: newBlockId(), type: "heading", level: 2, text: "Paso 2" },
      {
        id: newBlockId(),
        type: "image-text",
        url: "",
        text: "Describe el segundo paso...",
        layout: "right",
      },
      { id: newBlockId(), type: "callout", text: "Consejo clave para el lector", variant: "tip" },
    ],
  },
  {
    id: "glossary",
    name: "Glosario",
    description: "Términos y definiciones",
    blocks: [
      { id: newBlockId(), type: "hero", subtitle: "Conceptos esenciales", layout: "full" },
      { id: newBlockId(), type: "text", text: "Un repaso de los términos más importantes." },
      {
        id: newBlockId(),
        type: "glossary",
        items: [
          { term: "Término 1", definition: "Definición del término" },
          { term: "Término 2", definition: "Definición del término" },
        ],
      },
    ],
  },
  {
    id: "visual",
    name: "Galería visual",
    description: "Muchas imágenes con contexto",
    blocks: [
      { id: newBlockId(), type: "hero", subtitle: "", layout: "full" },
      { id: newBlockId(), type: "text", text: "Contexto de la galería..." },
      {
        id: newBlockId(),
        type: "gallery",
        images: [{ url: "" }, { url: "" }, { url: "" }, { url: "" }],
        columns: 2,
      },
      { id: newBlockId(), type: "two-images", left: { url: "" }, right: { url: "" } },
    ],
  },
  {
    id: "comparison",
    name: "Comparativa",
    description: "Tabla y dos columnas de texto",
    blocks: [
      { id: newBlockId(), type: "heading", level: 2, text: "Comparativa" },
      { id: newBlockId(), type: "text", text: "Introduce la comparación..." },
      {
        id: newBlockId(),
        type: "table",
        headers: ["Opción A", "Opción B"],
        rows: [
          ["", ""],
          ["", ""],
        ],
      },
      { id: newBlockId(), type: "columns", left: "Ventajas de A...", right: "Ventajas de B..." },
    ],
  },
];

import {
  BLOG_CONTENT_VERSION,
  type BlogBlock,
  type BlogContentDocument,
  newBlockId,
} from "./blog-blocks";

type LegacyBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "glossary"; term: string; definition: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function parseLegacyMarkdown(content: string): LegacyBlock[] {
  const lines = content.split("\n");
  const blocks: LegacyBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.replace("## ", "") });
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.replace("### ", "") });
      i++;
      continue;
    }

    if (line === "---") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    if (line.startsWith("|") && lines[i + 1]?.startsWith("|")) {
      const headers = line.split("|").filter(Boolean).map((h) => h.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (line.startsWith("**") && line.includes("** - ")) {
      const match = line.match(/\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match) {
        blocks.push({ type: "glossary", term: match[1], definition: match[2] });
        i++;
        continue;
      }
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().replace("- ", ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    blocks.push({ type: "p", text: line });
    i++;
  }

  return blocks;
}

function legacyToBlocks(content: string): BlogBlock[] {
  return parseLegacyMarkdown(content).map((block) => {
    const id = newBlockId();
    switch (block.type) {
      case "h2":
        return { id, type: "heading", level: 2, text: block.text };
      case "h3":
        return { id, type: "heading", level: 3, text: block.text };
      case "p":
        return { id, type: "text", text: block.text };
      case "ul":
        return { id, type: "list", items: block.items, style: "bullet" as const };
      case "glossary":
        return {
          id,
          type: "glossary",
          items: [{ term: block.term, definition: block.definition }],
        };
      case "table":
        return { id, type: "table", headers: block.headers, rows: block.rows };
      case "hr":
        return { id, type: "divider" };
      default:
        return { id, type: "text", text: "" };
    }
  });
}

export function parseBlogContent(content: string | null | undefined): BlogBlock[] {
  if (!content?.trim()) return [];

  try {
    const parsed = JSON.parse(content) as BlogContentDocument;
    if (parsed?.version === BLOG_CONTENT_VERSION && Array.isArray(parsed.blocks)) {
      return parsed.blocks;
    }
  } catch {
    // legacy plain text / markdown
  }

  return legacyToBlocks(content);
}

export function serializeBlogContent(blocks: BlogBlock[]): string {
  const doc: BlogContentDocument = {
    version: BLOG_CONTENT_VERSION,
    blocks,
  };
  return JSON.stringify(doc);
}

export function isStructuredContent(content: string | null | undefined): boolean {
  if (!content?.trim()) return false;
  try {
    const parsed = JSON.parse(content) as BlogContentDocument;
    return parsed?.version === BLOG_CONTENT_VERSION && Array.isArray(parsed.blocks);
  } catch {
    return false;
  }
}

export function extractTextFromBlocks(blocks: BlogBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "hero":
        if (block.subtitle) parts.push(block.subtitle);
        break;
      case "heading":
        parts.push(block.text);
        break;
      case "text":
        parts.push(block.text);
        break;
      case "image-text":
        parts.push(block.text);
        break;
      case "quote":
        parts.push(block.text);
        if (block.author) parts.push(block.author);
        break;
      case "callout":
        parts.push(block.text);
        break;
      case "list":
        parts.push(...block.items);
        break;
      case "glossary":
        for (const item of block.items) {
          parts.push(item.term, item.definition);
        }
        break;
      case "table":
        parts.push(...block.headers);
        for (const row of block.rows) parts.push(...row);
        break;
      case "columns":
        parts.push(block.left, block.right);
        break;
      default:
        break;
    }
  }

  return parts.filter(Boolean).join(" ");
}

export function getReadTimeFromContent(content: string | null | undefined): string {
  const blocks = parseBlogContent(content);
  const text = extractTextFromBlocks(blocks);
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export interface ExtractedImage {
  url: string;
  alt?: string;
}

export function extractImagesFromBlocks(blocks: BlogBlock[]): ExtractedImage[] {
  const images: ExtractedImage[] = [];
  const seen = new Set<string>();

  const add = (url?: string, alt?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({ url, alt });
  };

  for (const block of blocks) {
    switch (block.type) {
      case "hero":
        add(block.image, block.imageAlt);
        break;
      case "image":
        add(block.url, block.alt);
        break;
      case "image-text":
        add(block.url, block.alt);
        break;
      case "two-images":
        add(block.left.url, block.left.alt);
        add(block.right.url, block.right.alt);
        break;
      case "gallery":
        for (const img of block.images) add(img.url, img.alt);
        break;
      default:
        break;
    }
  }

  return images;
}

export function extractPrimaryImage(
  content: string | null | undefined,
  coverImage?: string | null
): string | null {
  if (coverImage) return coverImage;
  const blocks = parseBlogContent(content);
  const images = extractImagesFromBlocks(blocks);
  return images[0]?.url || null;
}

export function hasHeroBlock(content: string | null | undefined): boolean {
  const blocks = parseBlogContent(content);
  return blocks.some((b) => b.type === "hero" && Boolean(b.image));
}

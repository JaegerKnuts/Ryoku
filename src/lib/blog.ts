import type { Prisma } from "@/generated/prisma/client";
import { extractImagesFromBlocks, parseBlogContent } from "./blog-content";

export const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=1200&h=800&fit=crop";

export function getBlogPostImage(post: {
  coverImage?: string | null;
  images?: { url: string }[];
}) {
  return post.coverImage || post.images?.[0]?.url || DEFAULT_BLOG_IMAGE;
}

export function getBlogPostImages(post: {
  coverImage?: string | null;
  images?: { url: string }[];
}) {
  if (post.images && post.images.length > 0) {
    return post.images.map((img) => img.url);
  }
  if (post.coverImage) return [post.coverImage];
  return [DEFAULT_BLOG_IMAGE];
}

export async function syncBlogImages(
  tx: Prisma.TransactionClient,
  postId: number,
  content: string | null | undefined,
  coverImage: string | null | undefined
) {
  const blocks = parseBlogContent(content);
  const fromBlocks = extractImagesFromBlocks(blocks);
  const images: { url: string; alt?: string }[] = [];

  if (coverImage) {
    images.push({ url: coverImage });
  }

  for (const img of fromBlocks) {
    if (!images.some((existing) => existing.url === img.url)) {
      images.push(img);
    }
  }

  await tx.blogImage.deleteMany({ where: { postId } });

  for (let i = 0; i < images.length; i++) {
    await tx.blogImage.create({
      data: {
        postId,
        url: images[i].url,
        alt: images[i].alt || null,
        order: i,
      },
    });
  }
}

/** @deprecated Usar syncBlogImages */
export async function syncBlogCoverImage(
  tx: Prisma.TransactionClient,
  postId: number,
  coverImage: string | null | undefined
) {
  await syncBlogImages(tx, postId, null, coverImage ?? null);
}

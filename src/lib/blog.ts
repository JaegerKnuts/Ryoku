import type { Prisma } from "@/generated/prisma/client";

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
  if (post.coverImage) return [post.coverImage];
  if (post.images && post.images.length > 0) {
    return post.images.map((img) => img.url);
  }
  return [DEFAULT_BLOG_IMAGE];
}

export async function syncBlogCoverImage(
  tx: Prisma.TransactionClient,
  postId: number,
  coverImage: string | null | undefined
) {
  if (coverImage === undefined) return;

  const existing = await tx.blogImage.findFirst({
    where: { postId },
    orderBy: { order: "asc" },
  });

  if (coverImage) {
    if (existing) {
      await tx.blogImage.update({
        where: { id: existing.id },
        data: { url: coverImage },
      });
    } else {
      await tx.blogImage.create({
        data: { postId, url: coverImage, order: 0 },
      });
    }
  } else if (existing) {
    await tx.blogImage.delete({ where: { id: existing.id } });
  }
}
